import Image from "next/image";
import CoinField from "./CoinField";
import ContractAddress from "@/components/layout/ContractAddress";
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_20%_at_50%_42%,rgba(0,0,0,0.45),rgba(0,0,0,0)_70%)] sm:bg-[radial-gradient(ellipse_45%_38%_at_50%_46%,rgba(0,0,0,0.7),rgba(0,0,0,0)_72%)]" />

      <CoinField />

      <div className="relative z-10 mx-auto max-w-3xl">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-white [text-shadow:0_0_25px_rgba(255,255,255,0.55),0_0_60px_rgba(113,216,119,0.35),0_2px_10px_rgba(0,0,0,0.45)] sm:text-6xl md:text-7xl">
          Internet Capital Markets
        </h1>

        <div className="mt-8 flex flex-col items-center gap-5 sm:mt-10">
          <span className="text-2xl font-semibold text-white">First Stock Protocol</span>

          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <a
              href="https://icm.zebec.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center whitespace-nowrap rounded-lg bg-brand px-5 py-3 text-xs font-semibold text-black shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_0_0_1px_rgba(0,0,0,0.2),0_0_36px_-8px_rgba(113,216,119,0.4),0_20px_40px_-15px_rgba(0,0,0,0.7)] transition hover:bg-brand-light sm:px-7 sm:py-3.5 sm:text-sm"
            >
              ICM | STOCK CARD
            </a>
            <a
              href="#"
              className="flex items-center justify-center whitespace-nowrap rounded-lg bg-brand px-5 py-3 text-xs font-semibold text-black shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_0_0_1px_rgba(0,0,0,0.2),0_0_36px_-8px_rgba(113,216,119,0.4),0_20px_40px_-15px_rgba(0,0,0,0.7)] transition hover:bg-brand-light sm:px-6 sm:py-3.5 sm:text-sm"
            >
              BASKETS
            </a>
          </div>

          <ContractAddress className="w-64 justify-center px-3 py-1.5 text-sm sm:w-72 sm:text-base" />
        </div>

        <span className="sr-only">
          Available markets: {coins.map((c) => c.name).join(", ")}.
        </span>
      </div>
    </section>
  );
}
