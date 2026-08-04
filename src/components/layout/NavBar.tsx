import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "#", label: "Home" },
  { href: "#markets", label: "Baskets" },
  { href: "#docs", label: "Docs" },
];

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between bg-black px-4 py-4 sm:px-6 sm:py-5 md:px-10">
      <Link href="/" className="flex items-center gap-2 sm:gap-2.5">
        <Image
          src="/icm-logo.png"
          alt=""
          width={60}
          height={60}
          className="h-[54px] w-[54px] shrink-0 sm:h-[60px] sm:w-[60px]"
        />
        <span className="text-base font-semibold tracking-[0.1em] text-white sm:text-lg sm:tracking-[0.15em]">
          ICM.FUN
        </span>
      </Link>

      <div className="hidden items-center gap-10 md:flex">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm font-medium text-white/80 transition hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>

      <a
        href="#get-started"
        className="rounded-lg bg-lime-300 px-3.5 py-2 text-xs font-semibold text-black transition hover:bg-lime-200 sm:px-5 sm:py-2.5 sm:text-sm"
      >
        <span className="sm:hidden">Connect</span>
        <span className="hidden sm:inline">Connect Wallet</span>
      </a>
    </nav>
  );
}
