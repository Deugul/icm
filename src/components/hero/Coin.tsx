import { forwardRef } from "react";
import Image from "next/image";
import type { CoinDef } from "@/lib/coins";
import { clsx } from "clsx";

type CoinProps = {
  coin: CoinDef;
  /** Overrides coin.size — used to scale coins down on smaller viewports. */
  size?: number;
  className?: string;
};

// Pre-rendered coins carry their own glow/vignette padding around the disc,
// so the image is drawn larger than the physics hitbox and centered on it.
const RENDER_SCALE = 1.7;

const Coin = forwardRef<HTMLDivElement, CoinProps>(function Coin(
  { coin, size: sizeOverride, className },
  ref,
) {
  const { image, name } = coin;
  const size = sizeOverride ?? coin.size;
  const renderSize = size * RENDER_SCALE;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={name}
      className={clsx("absolute left-0 top-0 will-change-transform", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={image}
        alt=""
        width={512}
        height={512}
        className="pointer-events-none absolute max-w-none"
        style={{
          width: renderSize,
          height: renderSize,
          left: -(renderSize - size) / 2,
          top: -(renderSize - size) / 2,
        }}
      />
    </div>
  );
});

export default Coin;
