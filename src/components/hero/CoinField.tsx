"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import Coin from "./Coin";
import { coins, type CoinDef } from "@/lib/coins";

const CURSOR_RADIUS = 200;
const CURSOR_FORCE = 0.0011;
const HOVER_SCALE_RADIUS = 170;
const HOVER_MAX_SCALE = 1.32;
const SPRING_STRENGTH = 0.000022;
const WOBBLE_STRENGTH = 0.000016;
const POSITION_LERP = 0.35;
const SCALE_LERP = 0.16;
const BREATHE_AMPLITUDE = 0.05;
const BREATHE_SPEED = 0.0016;

const MOBILE_BREAKPOINT = 768;

// Clockwise angle from top (12 o'clock) — used on wider viewports where
// there's enough side gutter to ring the coins around the headline.
const RING_ANGLES: Record<string, number> = {
  microsoft: 25,
  tesla: 75,
  meta: 125,
  google: 172,
  amazon: 200,
  apple: 285,
  nvidia: 335,
};

type Anchor = { coin: CoinDef; x: number; y: number };

function getSizeScale(width: number) {
  if (width < 400) return 0.5;
  if (width < MOBILE_BREAKPOINT) return 0.62;
  if (width < 1024) return 0.85;
  return 1;
}

function ringAnchors(width: number, height: number): Anchor[] {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const radiusX = Math.min(width * 0.42, 620);
  // Clamp so the topmost coin clears the fixed glass nav bar overlaying the hero.
  const radiusY = Math.min(height * 0.38, radiusX * 0.95, cy - 120);

  return coins.map((coin) => {
    const angle = ((RING_ANGLES[coin.id] ?? 0) * Math.PI) / 180;
    return {
      coin,
      x: cx + radiusX * Math.sin(angle),
      y: cy - radiusY * Math.cos(angle),
    };
  });
}

// Two clear bands (top / bottom) — keeps coins away from the full-width
// headline column on narrow viewports, where a ring would collide with it.
function bandAnchors(width: number, height: number): Anchor[] {
  const topCount = Math.ceil(coins.length / 2);
  return coins.map((coin, i) => {
    const isTop = i < topCount;
    const bandIndex = isTop ? i : i - topCount;
    const bandSize = isTop ? topCount : coins.length - topCount;
    const cellW = width / bandSize;
    const x = (bandIndex + 0.5) * cellW;
    // Keep clear of the fixed glass nav bar overlaying the hero.
    const y = isTop ? Math.max(height * 0.12, 110) : height * 0.9;
    return { coin, x, y };
  });
}

function getAnchors(width: number, height: number) {
  return width < MOBILE_BREAKPOINT ? bandAnchors(width, height) : ringAnchors(width, height);
}

export default function CoinField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const coinRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const [sizeScale, setSizeScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotionMQL = window.matchMedia("(prefers-reduced-motion: reduce)");

    let disposePhysics: (() => void) | null = null;

    // prefers-reduced-motion: place coins on their resting positions, no animation.
    const layoutStatic = (width: number, height: number, scale: number) => {
      getAnchors(width, height).forEach(({ coin, x, y }) => {
        const el = coinRefs.current.get(coin.id);
        if (!el) return;
        const radius = (coin.size * scale) / 2;
        el.style.transform = `translate3d(${x - radius}px, ${y - radius}px, 0)`;
      });
    };

    const buildPhysics = (width: number, height: number, scale: number) => {
      const { Engine, Runner, Bodies, Composite, Events, Body } = Matter;

      const engine = Engine.create();
      engine.gravity.y = 0;

      const wallThickness = 80;
      const walls = [
        Bodies.rectangle(width / 2, -wallThickness / 2, width + wallThickness * 2, wallThickness, { isStatic: true }),
        Bodies.rectangle(width / 2, height + wallThickness / 2, width + wallThickness * 2, wallThickness, { isStatic: true }),
        Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height + wallThickness * 2, { isStatic: true }),
        Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height + wallThickness * 2, { isStatic: true }),
      ];

      const anchors = getAnchors(width, height);
      const anchorById = new Map(anchors.map(({ coin, x, y }) => [coin.id, { x, y }]));

      const bodies = anchors.map(({ coin, x, y }, i) =>
        Object.assign(
          Bodies.circle(x, y, (coin.size * scale) / 2, {
            restitution: 0.55,
            friction: 0.02,
            frictionAir: 0.06,
            label: coin.id,
          }),
          { wobblePhase: i * 1.7 },
        ),
      );

      const renderState = new Map(
        bodies.map((body) => [body.label, { x: body.position.x, y: body.position.y, angle: 0, scale: 1 }]),
      );

      Composite.add(engine.world, [...walls, ...bodies]);

      const onPointerMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      };
      const onPointerLeave = () => {
        pointerRef.current = null;
      };
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerleave", onPointerLeave);

      const beforeUpdate = () => {
        const pointer = pointerRef.current;
        const t = engine.timing.timestamp;

        for (const body of bodies) {
          const anchor = anchorById.get(body.label)!;
          const phase = body.wobblePhase;

          // Spring pulling each coin back toward its resting position.
          Body.applyForce(body, body.position, {
            x: (anchor.x - body.position.x) * SPRING_STRENGTH * body.mass,
            y: (anchor.y - body.position.y) * SPRING_STRENGTH * body.mass,
          });

          // Smooth, continuous drift — no random spikes, so the motion never jitters.
          Body.applyForce(body, body.position, {
            x: Math.sin(t * 0.0007 + phase) * WOBBLE_STRENGTH * body.mass,
            y: Math.cos(t * 0.0009 + phase) * WOBBLE_STRENGTH * body.mass,
          });

          if (pointer) {
            const dx = body.position.x - pointer.x;
            const dy = body.position.y - pointer.y;
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < CURSOR_RADIUS) {
              const strength = (1 - dist / CURSOR_RADIUS) * CURSOR_FORCE * body.mass;
              Body.applyForce(body, body.position, {
                x: (dx / dist) * strength,
                y: (dy / dist) * strength,
              });
            }
          }
        }
      };

      const afterUpdate = () => {
        const pointer = pointerRef.current;
        const t = engine.timing.timestamp;

        for (const body of bodies) {
          const el = coinRefs.current.get(body.label);
          if (!el) continue;

          const state = renderState.get(body.label)!;
          state.x += (body.position.x - state.x) * POSITION_LERP;
          state.y += (body.position.y - state.y) * POSITION_LERP;
          state.angle += (body.angle - state.angle) * POSITION_LERP;

          // Idle breathing — a slow, gentle size pulse so coins never look static.
          const breathe = 1 + Math.sin(t * BREATHE_SPEED + body.wobblePhase * 1.3) * BREATHE_AMPLITUDE;

          let targetScale = breathe;
          if (pointer) {
            const dist = Math.hypot(body.position.x - pointer.x, body.position.y - pointer.y);
            const falloff = Math.max(0, 1 - dist / HOVER_SCALE_RADIUS);
            targetScale = breathe * (1 + falloff * falloff * (HOVER_MAX_SCALE - 1));
          }
          state.scale += (targetScale - state.scale) * SCALE_LERP;

          const radius = body.circleRadius ?? 0;
          el.style.transform = `translate3d(${state.x - radius}px, ${state.y - radius}px, 0) rotate(${state.angle}rad) scale(${state.scale})`;
        }
      };

      Events.on(engine, "beforeUpdate", beforeUpdate);
      Events.on(engine, "afterUpdate", afterUpdate);

      const runner = Runner.create();
      Runner.run(runner, engine);

      return () => {
        Runner.stop(runner);
        Events.off(engine, "beforeUpdate", beforeUpdate);
        Events.off(engine, "afterUpdate", afterUpdate);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerLeave);
      };
    };

    const rebuild = () => {
      disposePhysics?.();
      disposePhysics = null;

      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      const scale = getSizeScale(width);
      setSizeScale(scale);

      if (reduceMotionMQL.matches) {
        layoutStatic(width, height, scale);
        return;
      }
      disposePhysics = buildPhysics(width, height, scale);
    };

    let hasRunOnce = false;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const scheduleRebuild = () => {
      if (!hasRunOnce) {
        hasRunOnce = true;
        rebuild();
        return;
      }
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(rebuild, 200);
    };

    const resizeObserver = new ResizeObserver(scheduleRebuild);
    resizeObserver.observe(container);

    return () => {
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      disposePhysics?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {coins.map((coin) => (
        <Coin
          key={coin.id}
          coin={coin}
          size={coin.size * sizeScale}
          ref={(el) => {
            if (el) coinRefs.current.set(coin.id, el);
            else coinRefs.current.delete(coin.id);
          }}
        />
      ))}
    </div>
  );
}
