"use client";

import { useState } from "react";

export default function RSVP() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-serif text-4xl tracking-tight">Thank You</h1>
        <p className="mt-4 text-gray-600">
          Your RSVP has been received. We can’t wait to celebrate with you!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-4xl tracking-tight">RSVP</h1>

      <p className="mt-4 text-gray-600">
        Please let us know which events you’ll be attending.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm mb-2">Full Name</label>
          <input
            required
            className="w-full rounded-xl border border-black/10 px-4 py-3"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm">Select Events</label>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="sangeet" />
            <label htmlFor="sangeet">Sangeet</label>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="anand" />
            <label htmlFor="anand">Anand Karaj</label>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="reception" />
            <label htmlFor="reception">Reception</label>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-black text-white px-6 py-3 text-sm tracking-wide"
        >
          Submit RSVP
        </button>
      </form>
    </div>
  );
}