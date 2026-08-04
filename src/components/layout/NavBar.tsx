import Link from "next/link";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";

export default function NavBar() {
  return (
    <div className="absolute inset-x-4 top-4 z-20 sm:inset-x-8 sm:top-6 md:inset-x-12">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-brand/25 bg-black/35 px-4 py-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_0_0_1px_rgba(0,0,0,0.2),0_0_36px_-8px_rgba(113,216,119,0.4),0_20px_40px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl backdrop-saturate-150 sm:px-6 md:px-8">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5">
          <Image
            src="/icm-logo.png"
            alt=""
            width={52}
            height={52}
            className="h-10 w-10 shrink-0 sm:h-11 sm:w-11"
          />
          <span className="text-base font-semibold tracking-[0.1em] text-white sm:text-lg sm:tracking-[0.15em]">
            ICM.FUN
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden items-center gap-1.5 text-xs font-medium text-white/60 sm:inline-flex">
            Launching in
            <CountdownTimer className="inline-flex items-center gap-1.5" />
          </span>
          <a
            href="#get-started"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-xs font-semibold text-black transition hover:bg-brand-light sm:px-5 sm:py-2.5 sm:text-sm"
          >
            DAPP
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
