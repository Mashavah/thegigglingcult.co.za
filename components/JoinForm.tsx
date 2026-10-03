'use client';

/* Join page: Audience / Comedian / Venue with production API submission. */

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { PROVINCES } from '@/lib/data';
import { Icon } from './Icons';
import { useUI } from './UIProvider';
import { Segmented } from './ui';

type Role = 'audience' | 'comedian' | 'venue';

const PERKS: Record<Role, [ReactNode, string, string][]> = {
  audience: [
    [
      <Icon.mail key="m" />,
      'One useful comedy email',
      'Shows, updates and new faces worth knowing about — without daily spam.',
    ],
    [
      <Icon.star key="s" />,
      'Discover more than headliners',
      'Find established names, local favourites and new talent on the same platform.',
    ],
    [
      <Icon.ticket key="t" />,
      'Go straight to the ticket source',
      'TGC helps you discover the show, then directs you to the official ticket provider.',
    ],
  ],
  comedian: [
    [
      <Icon.mic key="m" />,
      'Your name on the A–Z',
      'A profile with your bio, primary social link and upcoming shows.',
    ],
    [
      <Icon.pin key="p" />,
      'Make your gigs easier to find',
      'Give audiences one place to discover where you are performing next.',
    ],
    [
      <Icon.star key="s" />,
      'Rising Stars',
      'Coming soon — the future discovery category is visible at launch but is not active yet.',
    ],
  ],
  venue: [
    [
      <Icon.pin key="p" />,
      'Put your room on the map',
      'Tell audiences where your comedy night happens and how often it runs.',
    ],
    [
      <Icon.ticket key="t" />,
      'Drive discovery',
      'TGC points comedy fans toward your listed events and official ticket links.',
    ],
    [
      <Icon.star key="s" />,
      'Be part of the scene',
      'Help build a clearer picture of South African stand-up, one room at a time.',
    ],
  ],
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PLATFORMS = [
  ['instagram', 'Instagram'],
  ['x', 'X'],
  ['tiktok', 'TikTok'],
  ['youtube', 'YouTube'],
  ['facebook', 'Facebook'],
] as const;

export function JoinForm() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useUI();

  const requestedRole = params.get('as');

  const role: Role =
    requestedRole === 'comedian'
      ? 'comedian'
      : requestedRole === 'venue'
        ? 'venue'
        : 'audience';

  const setRole = (r: Role) =>
    router.replace(`${pathname}?as=${r}`, { scroll: false });

  const [phase, setPhase] =
    useState<'form' | 'sending' | 'done'>('form');

  const [invalid, setInvalid] =
    useState<Set<string>>(new Set());

  const [name, setName] = useState('');
  const [bioLen, setBioLen] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setPhase('form');
    setInvalid(new Set());
    setBioLen(0);
  }, [role]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = Object.fromEntries(
      new FormData(form).entries(),
    ) as Record<string, string>;

    const bad = new Set<string>();

    form
      .querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >('[required]')
      .forEach((el) => {
        const ok =
          el.type === 'email'
            ? EMAIL.test(el.value)
            : el.value.trim() !== '';

        if (!ok) bad.add(el.name);
      });

    if (bad.size) {
      setInvalid(bad);
      form
        .querySelector<HTMLElement>(`[name="${[...bad][0]}"]`)
        ?.focus();
      toast('A couple of required fields still need attention.');
      return;
    }

    const displayName =
      data.name ||
      data.stageName ||
      data.venueName ||
      data.legalName ||
      'there';

    setPhase('sending');
    setName(displayName.trim());

    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          role,
        }),
      });

      if (!response.ok) {
        const payload = await response
          .json()
          .catch(() => ({ error: 'Submission failed.' }));

        throw new Error(payload.error || 'Submission failed.');
      }

      setPhase('done');

      toast(
        role === 'comedian'
          ? 'Comedian submission received.'
          : role === 'venue'
            ? 'Venue submission received.'
            : 'You are on the list.',
      );

      form.reset();
      setBioLen(0);
    } catch {
      setPhase('form');
      toast('We could not send that submission. Please try again.');
    }
  };

  const cls = (n: string) =>
    `input ${invalid.has(n) ? 'is-invalid' : ''}`;

  const clear = (n: string) =>
    setInvalid((s) => {
      if (!s.has(n)) return s;
      const copy = new Set(s);
      copy.delete(n);
      return copy;
    });

  const sending = phase === 'sending';

  return (
    <div className="join-layout">
      <div>
        <div
          className="enter"
          style={{ '--i': 3 } as React.CSSProperties}
        >
          <Segmented
            value={role}
            onChange={setRole}
            label="I am a"
            options={[
              { value: 'audience', label: 'Audience' },
              { value: 'comedian', label: 'Comedian' },
              { value: 'venue', label: 'Venue' },
            ]}
          />
        </div>

        <div className="perks" key={role}>
          {PERKS[role].map(([icon, title, body], i) => (
            <div
              key={title}
              className="perk enter"
              style={{ '--i': i } as React.CSSProperties}
            >
              <i>{icon}</i>
              <div>
                <b>{title}</b>
                <span>{body}</span>
              </div>
            </div>
          ))}
        </div>

        {role === 'comedian' && (
          <div className="filter-bar" style={{ marginTop: 28 }}>
            <span className="filter-label">Rising Stars</span>
            <span className="tag">Coming soon</span>
          </div>
        )}
      </div>

      <div
        className="join-form enter"
        style={{ '--i': 5 } as React.CSSProperties}
      >
        {phase === 'done' ? (
          <div className="form-success" data-active="true">
            <span className="check-mark">
              <Icon.check />
            </span>

            <h3>
              {role === 'venue'
                ? `Thanks, ${name}.`
                : role === 'comedian'
                  ? `Submission received, ${name}.`
                  : `You're in, ${name}.`}
            </h3>

            <p className="muted">
              {role === 'comedian'
                ? 'The team will review the information and contact you if anything needs to be confirmed.'
                : role === 'venue'
                  ? 'The team will review your venue details before they are added to the platform.'
                  : 'Keep an eye on your inbox for The Giggling Cult updates.'}
            </p>

            <div
              style={{
                display: 'flex',
                gap: 10,
                marginTop: 8,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <Link className="btn btn-primary" href="/events">
                Browse events
              </Link>

              <button
                className="btn btn-ghost"
                onClick={() => setPhase('form')}
              >
                Submit another
              </button>
            </div>
          </div>
        ) : role === 'audience' ? (
          <form
            ref={formRef}
            className="form-panel"
            data-active="true"
            noValidate
            onSubmit={submit}
            key="audience"
          >
            <div>
              <h2>Stay in the loop.</h2>
              <p className="muted small" style={{ marginTop: 6 }}>
                Comedy news and show updates without the noise.
              </p>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="a-name">First name</label>
                <input
                  className={cls('name')}
                  id="a-name"
                  name="name"
                  type="text"
                  autoComplete="given-name"
                  required
                  placeholder="Thandi"
                  onInput={() => clear('name')}
                />
              </div>

              <div className="field">
                <label htmlFor="a-email">Email</label>
                <input
                  className={cls('email')}
                  id="a-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.co.za"
                  onInput={() => clear('email')}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="a-province">Your province</label>
              <select
                className={cls('province')}
                id="a-province"
                name="province"
                required
                defaultValue=""
                onChange={() => clear('province')}
              >
                <option value="">Choose a province</option>
                {Object.values(PROVINCES).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
                <option value="all">
                  Anywhere (I travel for laughs)
                </option>
              </select>
            </div>

            <button
              className={`btn btn-primary btn-lg ${
                sending ? 'is-transitioning' : ''
              }`}
              type="submit"
              disabled={sending}
            >
              <span className="btn-content">
                {sending ? 'Sending…' : 'Join the Cult'}
              </span>
            </button>

            <p className="small muted">
              Your province helps us understand where comedy demand is growing,
              including provinces that are not part of the first launch.
            </p>
          </form>
        ) : role === 'comedian' ? (
          <form
            ref={formRef}
            className="form-panel"
            data-active="true"
            noValidate
            onSubmit={submit}
            key="comedian"
          >
            <div>
              <h2>Get listed.</h2>
              <p className="muted small" style={{ marginTop: 6 }}>
                Share the details the team needs to create or update your profile.
              </p>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="c-legal-name">Real / legal name</label>
                <input
                  className={cls('legalName')}
                  id="c-legal-name"
                  name="legalName"
                  type="text"
                  required
                  autoComplete="name"
                  onInput={() => clear('legalName')}
                />
              </div>

              <div className="field">
                <label htmlFor="c-stage-name">Stage name</label>
                <input
                  className={cls('stageName')}
                  id="c-stage-name"
                  name="stageName"
                  type="text"
                  required
                  placeholder="As it appears on posters"
                  onInput={() => clear('stageName')}
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="c-email">Email</label>
                <input
                  className={cls('email')}
                  id="c-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.co.za"
                  onInput={() => clear('email')}
                />
              </div>

              <div className="field">
                <label htmlFor="c-province">Home province</label>
                <select
                  className={cls('province')}
                  id="c-province"
                  name="province"
                  required
                  defaultValue=""
                  onChange={() => clear('province')}
                >
                  <option value="">Choose a province</option>
                  {Object.values(PROVINCES).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="c-years">Years performing</label>
              <select
                className={cls('years')}
                id="c-years"
                name="years"
                required
                defaultValue=""
                onChange={() => clear('years')}
              >
                <option value="">Select</option>
                <option value="0">Just started</option>
                <option value="1">1–2 years</option>
                <option value="3">3–5 years</option>
                <option value="6">6–10 years</option>
                <option value="10">10+ years</option>
              </select>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="c-platform">Primary platform</label>
                <select
                  className={cls('platform')}
                  id="c-platform"
                  name="platform"
                  required
                  defaultValue=""
                  onChange={() => clear('platform')}
                >
                  <option value="">Select platform</option>
                  {PLATFORMS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="c-handle">Handle</label>
                <input
                  className={cls('handle')}
                  id="c-handle"
                  name="handle"
                  type="text"
                  required
                  placeholder="@yourhandle"
                  autoCapitalize="off"
                  autoCorrect="off"
                  onInput={() => clear('handle')}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="c-bio">Short bio</label>
              <textarea
                className={cls('bio')}
                id="c-bio"
                name="bio"
                maxLength={300}
                required
                placeholder="Keep it short: where you're from, your comedy style and a useful credit or two."
                onInput={(e) => {
                  setBioLen(e.currentTarget.value.length);
                  clear('bio');
                }}
              />
              <span className="hint">{bioLen}/300</span>
            </div>

            <button
              className={`btn btn-primary btn-lg ${
                sending ? 'is-transitioning' : ''
              }`}
              type="submit"
              disabled={sending}
            >
              <span className="btn-content">
                {sending ? 'Sending…' : 'Submit comedian profile'}
              </span>
            </button>
          </form>
        ) : (
          <form
            ref={formRef}
            className="form-panel"
            data-active="true"
            noValidate
            onSubmit={submit}
            key="venue"
          >
            <div>
              <h2>List your venue.</h2>
              <p className="muted small" style={{ marginTop: 6 }}>
                Tell us where the comedy happens.
              </p>
            </div>

            <div className="field">
              <label htmlFor="v-name">Venue name</label>
              <input
                className={cls('venueName')}
                id="v-name"
                name="venueName"
                type="text"
                required
                onInput={() => clear('venueName')}
              />
            </div>

            <div className="field">
              <label htmlFor="v-type">Venue type</label>
              <select
                className={cls('venueType')}
                id="v-type"
                name="venueType"
                required
                defaultValue=""
                onChange={() => clear('venueType')}
              >
                <option value="">Select venue type</option>
                <option value="club">Comedy club</option>
                <option value="bar">Bar</option>
                <option value="community-hall">Community hall</option>
                <option value="hotel">Hotel</option>
                <option value="theatre">Theatre</option>
                <option value="restaurant">Restaurant</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="v-frequency">Comedy night frequency</label>
              <input
                className={cls('frequency')}
                id="v-frequency"
                name="frequency"
                type="text"
                required
                placeholder="Weekly / Monthly / Occasional"
                onInput={() => clear('frequency')}
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="v-platform">Primary social platform</label>
                <select
                  className={cls('platform')}
                  id="v-platform"
                  name="platform"
                  required
                  defaultValue=""
                  onChange={() => clear('platform')}
                >
                  <option value="">Select platform</option>
                  {PLATFORMS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="v-handle">Handle</label>
                <input
                  className={cls('handle')}
                  id="v-handle"
                  name="handle"
                  type="text"
                  required
                  placeholder="@venuename"
                  autoCapitalize="off"
                  autoCorrect="off"
                  onInput={() => clear('handle')}
                />
              </div>
            </div>

            <button
              className={`btn btn-primary btn-lg ${
                sending ? 'is-transitioning' : ''
              }`}
              type="submit"
              disabled={sending}
            >
              <span className="btn-content">
                {sending ? 'Sending…' : 'Submit venue'}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
