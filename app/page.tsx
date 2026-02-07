export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-rose-50 px-6 py-16 text-center">
      <div id="top" />

      {/* HERO */}
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center gap-6">
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-gray-900">
          Nisha & Vickram
        </h1>

        <p className="text-lg md:text-xl text-gray-600">
          We’re getting married
        </p>

        <div className="mt-6 text-sm uppercase tracking-[0.25em] text-gray-500">
          Park Hyatt Aviara · Carlsbad · August 23, 2026
        </div>
      </div>

      {/* DETAILS */}
      <section id="details" className="mt-24 max-w-3xl mx-auto text-left">
        <h2 className="font-serif text-3xl tracking-tight text-gray-900 mb-6">
          Wedding Details
        </h2>

        <p className="text-gray-600 leading-relaxed mb-6">
          We are so excited to celebrate our wedding with you. More details
          about the venue, dress code, and weekend events will be shared here.
        </p>

        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-medium">Venue:</span> Park Hyatt Aviara
          </p>
          <p>
            <span className="font-medium">City:</span> Carlsbad, California
          </p>
          <p>
            <span className="font-medium">Date:</span> August 23, 2026
          </p>
          <p>
            <span className="font-medium">Dress Code:</span> Formal
          </p>
        </div>
      </section>

      {/* SCHEDULE */}
      <section id="schedule" className="mt-20 max-w-3xl mx-auto text-left">
        <h2 className="font-serif text-3xl tracking-tight text-gray-900 mb-6">
          Schedule
        </h2>

        <div className="space-y-4">
          <ScheduleItem
            time="4:30 PM"
            title="Ceremony"
            desc="Arrive a little early to get settled."
          />
          <ScheduleItem
            time="5:15 PM"
            title="Cocktail Hour"
            desc="Drinks, light bites, and photos."
          />
          <ScheduleItem
            time="6:30 PM"
            title="Reception"
            desc="Dinner, toasts, and dancing."
          />
          <ScheduleItem
            time="10:30 PM"
            title="Send-off"
            desc="A sweet ending to a perfect day."
          />
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Timing is approximate — we’ll update as we get closer.
        </p>
      </section>

      <div className="h-24" />
    </main>
  );
}

function ScheduleItem({
  time,
  title,
  desc,
}: {
  time: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur border border-black/5 p-5">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <div className="text-sm uppercase tracking-[0.25em] text-gray-500">
          {time}
        </div>
        <div className="font-serif text-2xl text-gray-900">{title}</div>
      </div>
      <p className="mt-2 text-gray-600">{desc}</p>
    </div>
  );
}
