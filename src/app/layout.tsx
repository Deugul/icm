import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ICM.FUN — Internet Capital Markets",
  description:
    "Fractional ownership in the companies building the internet. Invest in Apple, Google, Amazon, Microsoft, Meta, Nvidia and Tesla from $1, commission-free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
