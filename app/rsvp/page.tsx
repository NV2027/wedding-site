"use client";

import { useMemo, useState } from "react";

type EventKey = "sangeet" | "anand_karaj" | "reception";

type Invite = {
  inviteId: string;
  exactName: string; // what the guest must type (we’ll normalize case/spaces)
  maxPartySize: number; // total seats including the primary guest
  allowedEvents: EventKey[];
};

const INVITES: Invite[] = [
  {
    inviteId: "INV001",
    exactName: "Jon Smith",
    maxPartySize: 2,
    allowedEvents: ["anand_karaj", "reception"],
  },
  {
    inviteId: "INV002",
    exactName: "Jason Patel",
    maxPartySize: 4,
    allowedEvents: ["sangeet", "anand_karaj", "reception"],
  },
];

const EVENT_LABELS: Record<EventKey, string> = {
  sangeet: "Sangeet",
  anand_karaj: "Anand Karaj",
  reception: "Reception",
};

function normalizeName(s: string) {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

type EventResponse = {
  attending: boolean;
  partySize: number; // 1..maxPartySize
};

export default function RSVPPage() {
  const [step, setStep] = useState<"lock" | "form" | "done">("lock");
  const [nameInput, setNameInput] = useState("");
  const [invite, setInvite] = useState<Invite | null>(null);

  const [eventResponses, setEventResponses] = useState<
    Partial<Record<EventKey, EventResponse>>
  >({});
  const [guestNames, setGuestNames] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const maxGuestsMinusOne = useMemo(() => {
    return invite ? Math.max(invite.maxPartySize - 1, 0) : 0;
  }, [invite]);

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeName(nameInput);
    const found = INVITES.find((i) => normalizeName(i.exactName) === normalized);
    if (!found) {
      setInvite(null);
      setStep("lock");
      alert("Name not found. Please check spelling and try again.");
      return;
    }
    setInvite(found);

    // Initialize event responses for allowed events
    const initial: Partial<Record<EventKey, EventResponse>> = {};
    found.allowedEvents.forEach((k) => {
      initial[k] = { attending: false, partySize: 1 };
    });
    setEventResponses(initial);

    // Initialize guest names slots (maxPartySize - 1)
    setGuestNames(Array(Math.max(found.maxPartySize - 1, 0)).fill(""));

    setStep("form");
  }

  function updateEvent(key: EventKey, patch: Partial<EventResponse>) {
    setEventResponses((prev) => {
      const current = prev[key] ?? { attending: false, partySize: 1 };
      const next = { ...current, ...patch };

      // If toggling off, reset party size to 1 (clean)
      if (!next.attending) next.partySize = 1;

      // Bound party size
      if (invite) {
        next.partySize = Math.min(Math.max(next.partySize, 1), invite.maxPartySize);
      }
      return { ...prev, [key]: next };
    });
  }

  function requiredGuestCountForAnyEvent() {
    if (!invite) return 0;
    // Max party size selected across events (because the same invite applies)
    const sizes = Object.values(eventResponses).map((r) => (r?.attending ? r.partySize : 1));
    const maxSelected = sizes.length ? Math.max(...sizes) : 1;
    return Math.max(maxSelected - 1, 0);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!invite) return;

    const anyYes = invite.allowedEvents.some((k) => eventResponses[k]?.attending);
    if (!anyYes) {
      alert("Please select attending Yes/No for at least one event (or choose No for all).");
      // technically “No for all” is allowed — but we want explicit action:
      // We'll treat "No for all" as allowed if user confirmed. For now, keep simple:
      // If they submit with all No, we allow it.
    }

    const neededGuestFields = requiredGuestCountForAnyEvent();
    const entered = guestNames.slice(0, neededGuestFields).map((s) => s.trim());
    const missing = entered.some((s) => s.length === 0);
    if (neededGuestFields > 0 && missing) {
      alert("Please enter the name(s) of your guest(s).");
      return;
    }

    // For now, we just show a success screen.
    // Next step: POST this payload to an API route that writes to Google Sheets.
    console.log("RSVP payload", {
      inviteId: invite.inviteId,
      exactName: invite.exactName,
      responses: eventResponses,
      guestNames: entered,
      notes,
    });

    setStep("done");
  }

  if (step === "done" && invite) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-serif text-4xl tracking-tight">Thank You</h1>
        <p className="mt-4 text-gray-600">
          We’ve received your RSVP for <span className="font-medium">{invite.exactName}</span>.
        </p>
        <p className="mt-2 text-gray-600">
          If you need to make a change later, you can return and submit again.
        </p>
      </div>
    );
  }

  if (step === "lock") {
    return (
      <div className="max-w-2xl">
        <h1 className="font-serif text-4xl tracking-tight">RSVP</h1>
        <p className="mt-4 text-gray-600">
          Please enter your full name to access your invitation.
        </p>

        <form onSubmit={handleLookup} className="mt-8 space-y-4">
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Full name (e.g., Jon Smith)"
            className="w-full rounded-xl border border-black/10 px-4 py-3"
            required
          />

          <button
            type="submit"
            className="rounded-xl bg-black text-white px-6 py-3 text-sm tracking-wide"
          >
            Continue
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500">
          Tip: spelling must match what was used on your invitation.
        </p>
      </div>
    );
  }

  // step === "form"
  if (!invite) return null;

  const neededGuestFields = requiredGuestCountForAnyEvent();

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-4xl tracking-tight">RSVP</h1>
      <p className="mt-4 text-gray-600">
        Welcome, <span className="font-medium">{invite.exactName}</span>.
      </p>
      <p className="mt-1 text-gray-600">
        Your invitation allows up to <span className="font-medium">{invite.maxPartySize}</span>{" "}
        {invite.maxPartySize === 1 ? "person" : "people"} total.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <section className="space-y-4">
          <h2 className="font-serif text-2xl">Your Events</h2>

          {invite.allowedEvents.map((key) => {
            const resp = eventResponses[key] ?? { attending: false, partySize: 1 };
            return (
              <div
                key={key}
                className="rounded-2xl border border-black/10 bg-white/60 p-5 space-y-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="font-serif text-xl">{EVENT_LABELS[key]}</div>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={resp.attending}
                      onChange={(e) => updateEvent(key, { attending: e.target.checked })}
                    />
                    Attending
                  </label>
                </div>

                {resp.attending && (
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-700">Party size:</label>
                    <select
                      className="rounded-xl border border-black/10 px-3 py-2 text-sm"
                      value={resp.partySize}
                      onChange={(e) =>
                        updateEvent(key, { partySize: Number(e.target.value) })
                      }
                    >
                      {Array.from({ length: invite.maxPartySize }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-500">(includes you)</span>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">Guest Names</h2>
          {maxGuestsMinusOne === 0 ? (
            <p className="text-gray-600">No additional guests are included in this invitation.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-600">
                Enter guest name(s) if you are bringing additional people.
              </p>

              {Array.from({ length: maxGuestsMinusOne }, (_, idx) => {
                const disabled = idx >= neededGuestFields; // only require/show as enabled what they selected
                return (
                  <input
                    key={idx}
                    value={guestNames[idx] ?? ""}
                    onChange={(e) => {
                      const next = [...guestNames];
                      next[idx] = e.target.value;
                      setGuestNames(next);
                    }}
                    placeholder={idx === 0 ? "Guest 1 name" : `Guest ${idx + 1} name`}
                    className={`w-full rounded-xl border border-black/10 px-4 py-3 ${
                      disabled ? "opacity-50" : ""
                    }`}
                    disabled={disabled}
                  />
                );
              })}

              <p className="text-sm text-gray-500">
                You currently selected up to{" "}
                <span className="font-medium">{neededGuestFields}</span>{" "}
                {neededGuestFields === 1 ? "guest" : "guests"}.
              </p>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">Notes (optional)</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-black/10 px-4 py-3"
            rows={4}
            placeholder="Dietary notes, questions, etc."
          />
        </section>

        <button
          type="submit"
          className="rounded-xl bg-black text-white px-6 py-3 text-sm tracking-wide"
        >
          Submit RSVP
        </button>

        <p className="text-sm text-gray-500">
          For now, this form saves locally only. Next step: connect submissions to Google Sheets.
        </p>
      </form>
    </div>
  );
}