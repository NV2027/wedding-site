import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[78vh] md:min-h-[88vh] flex items-center justify-center overflow-hidden rounded-3xl">
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url(/hero.jpg)" }}
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/10" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl px-6 py-16 text-center text-white">
          <h1 className="font-serif text-5xl md:text-7xl tracking-tight">
            Nisha & Vickram
          </h1>

          <p className="mt-4 text-lg md:text-2xl text-white/90">
            We’re getting married
          </p>

          <div className="mt-6 text-xs md:text-sm uppercase tracking-[0.3em] text-white/80">
            Park Hyatt Aviara · Carlsbad · Dec 31, 2026 – Jan 3, 2027
          </div>

          <div className="mt-10 flex flex-col md:flex-row gap-3 justify-center">
            <Link
              className="rounded-2xl bg-white text-black px-6 py-3 text-sm tracking-wide hover:bg-white/90 transition"
              href="/rsvp"
            >
              RSVP
            </Link>
            <Link
              className="rounded-2xl border border-white/30 bg-white/10 backdrop-blur px-6 py-3 text-sm tracking-wide hover:bg-white/20 transition"
              href="/travel"
            >
              Location + Hotel Details
            </Link>
            <Link
              className="rounded-2xl border border-white/30 bg-white/10 backdrop-blur px-6 py-3 text-sm tracking-wide hover:bg-white/20 transition"
              href="/events"
            >
              Events
            </Link>
            <Link
              className="rounded-2xl border border-white/30 bg-white/10 backdrop-blur px-6 py-3 text-sm tracking-wide hover:bg-white/20 transition"
              href="/registry"
            >
              Registry
            </Link>
          </div>
        </div>
      </section>

      {/* BELOW THE HERO */}
      <section className="mx-auto max-w-5xl px-6 mt-10 md:mt-14">
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Quick Details">
            <ul className="space-y-2 text-gray-700">
              <li>
                <span className="font-medium">Venue:</span> Park Hyatt Aviara
              </li>
              <li>
                <span className="font-medium">City:</span> Carlsbad, California
              </li>
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

          <Card title="Start Here">
            <p className="text-gray-600">
              Planning to attend? Please check Travel for hotel booking and airport info,
              then visit Events for the weekend schedule.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Pill href="/travel">Travel</Pill>
              <Pill href="/events">Events</Pill>
              <Pill href="/rsvp">RSVP</Pill>
              <Pill href="/registry">Registry</Pill>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white/70 backdrop-blur p-7">
      <h2 className="font-serif text-2xl tracking-tight mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm text-gray-700 hover:bg-black hover:text-white transition"
    >
      {children}
    </Link>
  );
}