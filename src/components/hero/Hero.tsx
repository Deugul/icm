import Image from "next/image";
import CoinField from "./CoinField";
import CountdownTimer from "@/components/layout/CountdownTimer";
import { coins } from "@/lib/coins";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-6">
      <Image
        src="/herobg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_38%_at_50%_46%,rgba(0,0,0,0.7),rgba(0,0,0,0)_72%)]" />

      <CoinField />

      <div className="relative z-10 mx-auto max-w-3xl">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-white [text-shadow:0_0_25px_rgba(255,255,255,0.55),0_0_60px_rgba(113,216,119,0.35),0_2px_10px_rgba(0,0,0,0.45)] sm:text-6xl md:text-7xl">
          Internet Capital Markets
        </h1>
        <p className="mt-3 text-base font-medium tracking-tight text-white [text-shadow:0_0_16px_rgba(0,0,0,0.85),0_2px_6px_rgba(0,0,0,0.75)] sm:mt-4 sm:text-xl">
          First Stock Protocol
        </p>

        <div className="mt-8 flex justify-center sm:mt-10">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg border border-brand/25 bg-black/35 px-6 py-3 text-base font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_0_0_1px_rgba(0,0,0,0.2),0_0_36px_-8px_rgba(113,216,119,0.4),0_20px_40px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl backdrop-saturate-150 transition hover:border-brand/40 sm:px-7 sm:py-3.5"
          >
            Launching in
            <CountdownTimer className="inline-flex items-center" />
          </a>
        </div>

        <span className="sr-only">
          Available markets: {coins.map((c) => c.name).join(", ")}.
        </span>
      </div>
    </section>
  );
}
