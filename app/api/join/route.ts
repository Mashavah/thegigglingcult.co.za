import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type JoinPayload = Record<string, unknown> & {
  role?: 'audience' | 'comedian' | 'venue';
};

const LABELS: Record<string, string> = {
  name: 'Name',
  email: 'Email',
  province: 'Province',
  legalName: 'Real / legal name',
  stageName: 'Stage name',
  years: 'Years performing',
  platform: 'Primary platform',
  handle: 'Handle',
  bio: 'Bio',
  venueName: 'Venue name',
  venueType: 'Venue type',
  frequency: 'Comedy night frequency',
};

export async function POST(request: Request) {
  let payload: JoinPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 });
  }

  if (
    payload.role !== 'audience' &&
    payload.role !== 'comedian' &&
    payload.role !== 'venue'
  ) {
    return NextResponse.json(
      { error: 'Unknown submission type.' },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.TGC_JOIN_TO_EMAIL;
  const from = process.env.TGC_JOIN_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error(
      'Join form email is not configured. Set RESEND_API_KEY, TGC_JOIN_TO_EMAIL and TGC_JOIN_FROM_EMAIL.',
    );
    return NextResponse.json(
      { error: 'Submission email is not configured yet.' },
      { status: 503 },
    );
  }

  const lines = Object.entries(payload)
    .filter(
      ([key, value]) =>
        key !== 'role' &&
        value != null &&
        String(value).trim() !== '',
    )
    .map(([key, value]) => `${LABELS[key] ?? key}: ${String(value)}`);

  const subject =
    payload.role === 'comedian'
      ? 'TGC comedian submission'
      : payload.role === 'venue'
        ? 'TGC venue submission'
        : 'TGC audience signup';

  const text = [
    `New ${payload.role} submission from The Giggling Cult website.`,
    '',
    ...lines,
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('Resend rejected TGC join submission:', detail);

    return NextResponse.json(
      { error: 'We could not send your submission.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
