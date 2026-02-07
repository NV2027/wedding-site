export default function Travel() {
  return (
    <div className="max-w-3xl space-y-12">
      <h1 className="font-serif text-4xl tracking-tight">
        Location + Hotel Details
      </h1>

      {/* PRIMARY VENUE */}
      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Venue</h2>
        <p className="text-gray-700">
          All wedding events will take place at the Park Hyatt Aviara in
          Carlsbad, California.
        </p>
        <p className="text-gray-600">
          Because multiple celebrations will occur throughout the weekend,
          staying on property will provide the most convenience.
        </p>
      </section>

      {/* ROOM BLOCK */}
      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Room Block</h2>
        <p className="text-gray-700">
          A discounted room block is available for our guests at the Park
          Hyatt Aviara. We encourage booking early, as availability may be
          limited.
        </p>

        <a
          href="https://www.hyatt.com/events/en-US/group-booking/SANPA/G-NBVK"
          target="_blank"
          className="inline-block mt-2 rounded-xl border border-black/10 px-5 py-3 text-sm tracking-wide hover:bg-black hover:text-white transition"
        >
          Book Through Our Room Block
        </a>
      </section>

      {/* STAYING ELSEWHERE */}
      <section className="space-y-3">
        <h2 className="font-serif text-2xl">If You Stay Elsewhere</h2>
        <p className="text-gray-700">
          Guests who choose accommodations outside the Park Hyatt Aviara will
          be responsible for arranging their own transportation to and from
          the venue.
        </p>
      </section>

      {/* AIRPORT */}
      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Airport</h2>
        <p className="text-gray-700">
          The nearest airport is San Diego International Airport (SAN),
          approximately 35–40 minutes from the resort depending on traffic.
        </p>
      </section>

      {/* FUTURE HOTELS */}
      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Additional Hotel Options</h2>
        <p className="text-gray-500">
          We will share recommendations for nearby hotels soon for guests who
          prefer alternative accommodations.
        </p>
      </section>
    </div>
  );
}