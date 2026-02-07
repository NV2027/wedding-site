import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nisha & Vickram",
  description: "Wedding website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-black/5">
          <nav className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-serif text-lg tracking-tight">
              Nisha & Vickram
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm tracking-wide text-gray-700">
              <Link className="hover:text-gray-900" href="/travel">Location + Hotel Details</Link>
              <Link className="hover:text-gray-900" href="/rsvp">RSVP</Link>
             <Link className="hover:text-gray-900" href="/events">Events</Link>
              <Link className="hover:text-gray-900" href="/registry">Registry</Link>
            </div>

            <Link
              href="/rsvp"
              className="md:hidden text-sm rounded-xl border border-black/10 px-3 py-2"
            >
              RSVP
            </Link>
          </nav>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-14">{children}</main>

        <footer className="border-t border-black/5 py-10 text-center text-sm text-gray-500">
          We can’t wait to celebrate with you.
        </footer>
      </body>
    </html>
  );
}