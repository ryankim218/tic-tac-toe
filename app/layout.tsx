import type { Metadata } from "next";
import { Cinzel, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elemental Clash",
  description:
    "A two-player local tic-tac-toe duel with custom identities and a persistent scoreboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-ink">
        {children}

        <footer className="py-4 text-center text-xs text-white/70">
          © 2026 Ryan Kim M. All rights reserved.{" "}
          <a
            href="https://github.com/ryankim218"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ice hover:underline"
          >
            GitHub
          </a>
        </footer>
      </body>
    </html>
  );
}
