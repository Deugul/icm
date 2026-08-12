"use client";

import { useState } from "react";

const CONTRACT_ADDRESS = "DZchfuc2Jom3m6zovzFNTREH4Tm4zx6mAavHCDLbpump";

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function ContractAddress({ className }: { className: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — nothing more we can do.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={CONTRACT_ADDRESS}
      className={`inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-black/40 font-medium text-white/80 backdrop-blur-xl transition hover:border-brand/40 hover:text-white ${className}`}
    >
      <span className="text-white/50">CA:</span>
      <span className="font-mono tabular-nums">{truncateAddress(CONTRACT_ADDRESS)}</span>
      {copied ? (
        <CheckIcon className="h-[1em] w-[1em] text-brand" />
      ) : (
        <CopyIcon className="h-[1em] w-[1em]" />
      )}
    </button>
  );
}
