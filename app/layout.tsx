import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ruckus — One prompt. An entire AI dev crew.",
  description:
    "Give Ruckus an idea. A specialized AI crew designs, writes, checks, builds, fixes, and ships working software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0b0d] text-[#f5f1e8] antialiased selection:bg-[#00d5ff]/30 selection:text-[#f5f1e8]">
        {children}
      </body>
    </html>
  );
}
