import { NextResponse } from "next/server";
import { google } from "googleapis";

function getEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function getAuth() {
  const clientEmail = getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = getEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function getSheets() {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = getEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
  return { sheets, spreadsheetId };
}

// Sheet/tab names
const INVITES_TAB = "Invites";
const RESPONSES_TAB = "Responses";

type EventKey = "sangeet" | "anand_karaj" | "reception";

function normalizeName(s: string) {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

export async function GET() {
  // Returns the invite list (server-side) for lookup.
  // For MVP simplicity, we send all invites and match in the client.
  // Later we can do server-side lookup to avoid exposing the whole list.
  const { sheets, spreadsheetId } = await getSheets();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${INVITES_TAB}!A2:D`,
  });

  const rows = res.data.values ?? [];
  const invites = rows
    .filter((r) => r.length >= 4)
    .map((r) => {
      const inviteId = String(r[0] ?? "");
      const exactName = String(r[1] ?? "");
      const maxPartySize = Number(r[2] ?? 1) || 1;
      const allowedEvents = String(r[3] ?? "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean) as EventKey[];

      return { inviteId, exactName, maxPartySize, allowedEvents };
    });

  return NextResponse.json({ invites });
}

export async function POST(req: Request) {
  const body = await req.json();

  const {
    inviteId,
    exactName,
    sangeet,
    anand_karaj,
    reception,
    party_size,
    guest_names,
    notes,
  } = body ?? {};

  if (!inviteId || !exactName) {
    return NextResponse.json(
      { error: "Missing inviteId or exactName" },
      { status: 400 }
    );
  }

  const { sheets, spreadsheetId } = await getSheets();
  const timestamp = new Date().toISOString();

  // Read existing invite_ids in Responses column B (B2:B)
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${RESPONSES_TAB}!B2:B`,
  });

  const ids = existing.data.values?.flat().map(String) ?? [];
  const idx = ids.findIndex((id) => id === String(inviteId));

  const rowValues = [
    timestamp,
    String(inviteId),
    String(exactName),
    String(sangeet ?? ""),
    String(anand_karaj ?? ""),
    String(reception ?? ""),
    String(party_size ?? ""),
    String(guest_names ?? ""),
    String(notes ?? ""),
  ];

  if (idx === -1) {
    // Not found → append new row
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${RESPONSES_TAB}!A:I`,
      valueInputOption: "RAW",
      requestBody: { values: [rowValues] },
    });
  } else {
    // Found → update the existing row (row number = idx + 2 because data starts at row 2)
    const rowNumber = idx + 2;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${RESPONSES_TAB}!A${rowNumber}:I${rowNumber}`,
      valueInputOption: "RAW",
      requestBody: { values: [rowValues] },
    });
  }

  return NextResponse.json({ ok: true });
}