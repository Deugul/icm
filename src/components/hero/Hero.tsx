import Image from "next/image";
import CoinField from "./CoinField";
import { coins } from "@/lib/coins";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-5 py-28 text-center sm:min-h-[92vh] sm:px-6 sm:py-0">
      <Image
        src="/herobg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/60" />

      <CoinField />

      <div className="relative z-10 mx-auto max-w-3xl">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-6xl md:text-7xl">
          Internet Capital Markets
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-base text-white/80 sm:mt-6 sm:text-xl">
          Fractional ownership in the companies building the internet — buy
          into Apple, Google, Amazon, Microsoft, Meta, Nvidia and Tesla in a
          single tap.
        </p>

        <div className="mt-8 flex justify-center sm:mt-10">
          <a
            href="#get-started"
            className="inline-flex items-center gap-2 rounded-lg bg-lime-300 px-6 py-3 text-base font-semibold text-black shadow-lg transition hover:bg-lime-200 sm:px-7 sm:py-3.5"
          >
            Connect Wallet
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <span className="sr-only">
          Available markets: {coins.map((c) => c.name).join(", ")}.
        </span>
      </div>
    </section>
  );
}
