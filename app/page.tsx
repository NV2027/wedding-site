import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-10">
      <section className="rounded-3xl border border-black/5 bg-gradient-to-b from-white to-rose-50 p-10 md:p-14 text-center">
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight">Nisha & Vickram</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600">We’re getting married</p>

        <div className="mt-6 text-xs uppercase tracking-[0.3em] text-gray-500">
          Park Hyatt Aviara · Carlsbad · August 23, 2026
        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-3 justify-center">
          <Link className="rounded-2xl bg-black text-white px-6 py-3 text-sm tracking-wide" href="/rsvp">
            RSVP
          </Link>
          <Link className="rounded-2xl border border-black/10 px-6 py-3 text-sm tracking-wide hover:bg-black hover:text-white transition" href="/travel">
            Location + Hotel Details
          </Link>
          <Link className="rounded-2xl border border-black/10 px-6 py-3 text-sm tracking-wide hover:bg-black hover:text-white transition" href="/story">
            Our Story
          </Link>
          <Link className="rounded-2xl border border-black/10 px-6 py-3 text-sm tracking-wide hover:bg-black hover:text-white transition" href="/registry">
            Registry
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
      <Card title="Quick Details">
  <ul className="space-y-2 text-gray-700">
    <li><span className="font-medium">Venue:</span> Park Hyatt Aviara</li>
    <li><span className="font-medium">City:</span> Carlsbad, California</li>
    <li>
      <span className="font-medium">Date:</span> December 31, 2026 – January 3, 2027
    </li>
    <li>
      <span className="font-medium">Room Link:</span>{" "}
      <a
        className="underline"
        target="_blank"
        href="https://www.hyatt.com/events/en-US/group-booking/SANPA/G-NBVK"
      >
        Book Here
      </a>
    </li>
  </ul>
</Card>

        <Card title="Navigation">
          <p className="text-gray-600 mb-4">Use the links above to find what you need quickly.</p>
          <div className="flex flex-wrap gap-2">
            <Pill href="/travel">Travel</Pill>
            <Pill href="/rsvp">RSVP</Pill>
            <Pill href="/story">Our Story</Pill>
            <Pill href="/registry">Registry</Pill>
          </div>
        </Card>
      </section>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-7">
      <h2 className="font-serif text-2xl tracking-tight mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-black/10 px-4 py-2 text-sm text-gray-700 hover:bg-black hover:text-white transition"
    >
      {children}
    </Link>
  );
}