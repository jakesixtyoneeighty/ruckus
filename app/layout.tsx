import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eveable | Autonomous Multi-Agent Web Builder",
  description: "Autonomous full-stack application builder powered by Vercel Eve and Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#07080d] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
