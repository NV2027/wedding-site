"use client";

import { useEffect, useMemo, useState } from "react";

type EventKey = "sangeet" | "anand_karaj" | "reception";

type Invite = {
  inviteId: string;
  exactName: string;
  maxPartySize: number;
  allowedEvents: EventKey[];
};

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
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [invites, setInvites] = useState<Invite[]>([]);

  const [nameInput, setNameInput] = useState("");
  const [invite, setInvite] = useState<Invite | null>(null);

  const [eventResponses, setEventResponses] = useState<
    Partial<Record<EventKey, EventResponse>>
  >({});
  const [guestNames, setGuestNames] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/rsvp", { cache: "no-store" });
        const data = await res.json();
        setInvites(data.invites ?? []);
      } catch (e) {
        console.error(e);
        alert("Unable to load invitations. Please try again later.");
      } finally {
        setLoadingInvites(false);
      }
    })();
  }, []);

  const maxGuestsMinusOne = useMemo(() => {
    return invite ? Math.max(invite.maxPartySize - 1, 0) : 0;
  }, [invite]);

  function initForInvite(found: Invite) {
    setInvite(found);

    // Initialize event responses for allowed events
    const initial: Partial<Record<EventKey, EventResponse>> = {};
    found.allowedEvents.forEach((k) => {
      initial[k] = { attending: false, partySize: 1 };
    });
    setEventResponses(initial);

    // Initialize guest name slots (maxPartySize - 1)
    setGuestNames(Array(Math.max(found.maxPartySize - 1, 0)).fill(""));

    setNotes("");
    setStep("form");
  }

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeName(nameInput);
    const found = invites.find((i) => normalizeName(i.exactName) === normalized);

    if (!found) {
      alert(
        "Name not found. Please check spelling and try again (must match your invitation)."
      );
      return;
    }

    initForInvite(found);
  }

  function updateEvent(key: EventKey, patch: Partial<EventResponse>) {
    setEventResponses((prev) => {
      const current = prev[key] ?? { attending: false, partySize: 1 };
      const next = { ...current, ...patch };

      // If toggling off, reset party size to 1
      if (!next.attending) next.partySize = 1;

      // Bound party size
      if (invite) {
        next.partySize = Math.min(Math.max(next.partySize, 1), invite.maxPartySize);
      }
      return { ...prev, [key]: next };
    });
  }

  function selectedMaxPartySize() {
    if (!invite) return 1;
    const sizes = Object.values(eventResponses).map((r) =>
      r?.attending ? r.partySize : 1
    );
    return sizes.length ? Math.max(...sizes) : 1;
  }

  function neededGuestCount() {
    return Math.max(selectedMaxPartySize() - 1, 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!invite) return;

    const anyYes = invite.allowedEvents.some((k) => eventResponses[k]?.attending);
    // Allow "no to everything", but require an explicit decision:
    // If they left everything unchecked, treat as "no to all" is fine.
    // (Checkbox is "Attending", unchecked = not attending)
    // So anyYes can be false and that's acceptable.

    const needGuests = neededGuestCount();
    const enteredGuests = guestNames.slice(0, needGuests).map((s) => s.trim());
    const missing = enteredGuests.some((s) => s.length === 0);
    if (needGuests > 0 && missing) {
      alert("Please enter the name(s) of your guest(s).");
      return;
    }

    // Prepare values for sheet columns (Yes/No/Blank)
    const sangeet = invite.allowedEvents.includes("sangeet")
      ? eventResponses.sangeet?.attending
        ? "Yes"
        : "No"
      : "";
    const anand = invite.allowedEvents.includes("anand_karaj")
      ? eventResponses.anand_karaj?.attending
        ? "Yes"
        : "No"
      : "";
    const reception = invite.allowedEvents.includes("reception")
      ? eventResponses.reception?.attending
        ? "Yes"
        : "No"
      : "";

    // Party size = max selected across events they said yes to (or 1 if all No)
    const partySize = anyYes ? selectedMaxPartySize() : 1;

    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteId: invite.inviteId,
          exactName: invite.exactName,
          sangeet,
          anand_karaj: anand,
          reception,
          party_size: partySize,
          guest_names: enteredGuests.join(", "),
          notes: notes.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Submission failed");
      }

      setStep("done");
    } catch (err) {
      console.error(err);
      alert("Sorry — we couldn’t submit your RSVP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "done" && invite) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-serif text-4xl tracking-tight">Thank You</h1>
        <p className="mt-4 text-gray-600">
          We’ve received your RSVP for{" "}
          <span className="font-medium">{invite.exactName}</span>.
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
            disabled={loadingInvites}
          />

          <button
            type="submit"
            className="rounded-xl bg-black text-white px-6 py-3 text-sm tracking-wide disabled:opacity-60"
            disabled={loadingInvites}
          >
            {loadingInvites ? "Loading..." : "Continue"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500">
          Tip: spelling must match what was used on your invitation.
        </p>
      </div>
    );
  }

  if (!invite) return null;

  const needGuests = neededGuestCount();

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-4xl tracking-tight">RSVP</h1>
      <p className="mt-4 text-gray-600">
        Welcome, <span className="font-medium">{invite.exactName}</span>.
      </p>
      <p className="mt-1 text-gray-600">
        Your invitation allows up to{" "}
        <span className="font-medium">{invite.maxPartySize}</span>{" "}
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
                      onChange={(e) => updateEvent(key, { partySize: Number(e.target.value) })}
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
                const enabled = idx < needGuests;
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
                      enabled ? "" : "opacity-50"
                    }`}
                    disabled={!enabled}
                  />
                );
              })}

              <p className="text-sm text-gray-500">
                You currently selected up to{" "}
                <span className="font-medium">{needGuests}</span>{" "}
                {needGuests === 1 ? "guest" : "guests"}.
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
          className="rounded-xl bg-black text-white px-6 py-3 text-sm tracking-wide disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit RSVP"}
        </button>
      </form>
    </div>
  );
}