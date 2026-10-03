'use client';

/* Join page: audience / comedian toggle, validation, morphing submit.
   Signups are stored in localStorage for the demo — wire `submit()` to a real endpoint. */

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { PROVINCES } from '@/lib/data';
import { Icon } from './Icons';
import { useUI } from './UIProvider';
import { Segmented } from './ui';

type Role = 'audience' | 'comedian';

const PERKS: Record<Role, [ReactNode, string, string][]> = {
  audience: [
    [<Icon.mail key="m" />, 'One email, every Monday', 'The week\'s shows in your province, with sold-out warnings before it\'s too late to say “I was going to go”.'],
    [<Icon.star key="s" />, 'New faces first', 'We flag the rising comics while tickets are still R90 and they still reply to DMs.'],
    [<Icon.ticket key="t" />, 'Presales, when we have them', 'Some venues give our list first dibs. We pass it straight on, no cover charge.'],
  ],
  comedian: [
    [<Icon.mic key="m" />, 'Your name on the A–Z', 'Bio, province, socials and every upcoming gig, on one page you can actually send to a booker.'],
    [<Icon.pin key="p" />, 'Your gigs on the calendar', 'Tell us where you\'re playing and it shows up for everyone browsing that province. Even the Tuesday ones.'],
    [<Icon.star key="s" />, 'The Rising list', 'Newer comics get a badge and a spot in our weekly “who to watch”. Bookers read it. So do other comics, jealously.'],
  ],
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function JoinForm() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useUI();

  const role: Role = params.get('as') === 'comedian' ? 'comedian' : 'audience';
  const setRole = (r: Role) => router.replace(`${pathname}?as=${r}`, { scroll: false });

  const [phase, setPhase] = useState<'form' | 'sending' | 'done'>('form');
  const [invalid, setInvalid] = useState<Set<string>>(new Set());
  const [name, setName] = useState('');
  const [bioLen, setBioLen] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { setPhase('form'); setInvalid(new Set()); }, [role]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const bad = new Set<string>();
    form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[required]').forEach((el) => {
      const ok = el.type === 'email' ? EMAIL.test(el.value) : el.value.trim() !== '';
      if (!ok) bad.add(el.name);
    });
    if (bad.size) {
      setInvalid(bad);
      form.querySelector<HTMLElement>(`[name="${[...bad][0]}"]`)?.focus();
      toast('A couple of fields are still blank. Commit to the bit.');
      return;
    }
    setPhase('sending');
    setName(data.name.trim());
    try {
      const key = 'tgc-signups';
      const existing = JSON.parse(localStorage.getItem(key) ?? '[]');
      existing.push({ ...data, role, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch { /* storage unavailable — demo only */ }
    setTimeout(() => {
      setPhase('done');
      toast(role === 'comedian' ? 'Application received. Don\'t call us.' : 'Subscribed. See you Monday.');
      form.reset();
      setBioLen(0);
    }, 700);
  };

  const cls = (n: string) => `input ${invalid.has(n) ? 'is-invalid' : ''}`;
  const clear = (n: string) => setInvalid((s) => { if (!s.has(n)) return s; const c = new Set(s); c.delete(n); return c; });
  const sending = phase === 'sending';

  return (
    <div className="join-layout">
      <div>
        <div className="enter" style={{ '--i': 3 } as React.CSSProperties}>
          <Segmented value={role} onChange={setRole} label="I am a" options={[{ value: 'audience', label: 'Audience member' }, { value: 'comedian', label: 'Comedian' }]} />
        </div>
        <div className="perks" key={role}>
          {PERKS[role].map(([icon, title, body], i) => (
            <div key={title} className="perk enter" style={{ '--i': i } as React.CSSProperties}><i>{icon}</i><div><b>{title}</b><span>{body}</span></div></div>
          ))}
        </div>
      </div>

      <div className="join-form enter" style={{ '--i': 5 } as React.CSSProperties}>
        {phase === 'done' ? (
          <div className="form-success" data-active="true">
            <span className="check-mark"><Icon.check /></span>
            <h3>{role === 'comedian' ? `Welcome to the cult, ${name}.` : `You're in, ${name}.`}</h3>
            <p className="muted">{role === 'comedian'
              ? 'We\'ll review your profile and email you when it\'s on the A–Z. Start sending us your gigs in the meantime. All of them. Even the Tuesday ones.'
              : 'First sermon lands on Monday. Until then, the calendar is right there. Go book something.'}</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link className="btn btn-primary" href="/events">Go book something</Link>
              <button className="btn btn-ghost" onClick={() => setPhase('form')}>Recruit someone else</button>
            </div>
          </div>
        ) : role === 'audience' ? (
          <form ref={formRef} className="form-panel" data-active="true" noValidate onSubmit={submit} key="audience">
            <div><h2>The weekly sermon, straight to your inbox.</h2><p className="muted small" style={{ marginTop: 6 }}>Every Monday. Unsubscribe in one click, no guilt trip. Well, a small one.</p></div>
            <div className="field-row">
              <div className="field"><label htmlFor="a-name">First name</label><input className={cls('name')} id="a-name" name="name" type="text" autoComplete="given-name" required placeholder="Thandi" onInput={() => clear('name')} /></div>
              <div className="field"><label htmlFor="a-email">Email</label><input className={cls('email')} id="a-email" name="email" type="email" autoComplete="email" required placeholder="you@example.co.za" onInput={() => clear('email')} /></div>
            </div>
            <div className="field">
              <label htmlFor="a-province">Your province</label>
              <select className={cls('province')} id="a-province" name="province" required defaultValue="" onChange={() => clear('province')}>
                <option value="">Choose a province</option>{Object.values(PROVINCES).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}<option value="all">Anywhere (I travel for laughs)</option>
              </select>
            </div>
            <label className="check"><input type="checkbox" name="openmics" /> Also warn me about open mics and new-faces nights (high risk, high reward)</label>
            <button className={`btn btn-primary btn-lg ${sending ? 'is-transitioning' : ''}`} type="submit" disabled={sending}><span className="btn-content">{sending ? 'Sending…' : 'Join the flock'}</span></button>
            <p className="small muted">You&apos;ll get one email a week. We don&apos;t sell your details to venues, promoters or your ex.</p>
          </form>
        ) : (
          <form ref={formRef} className="form-panel" data-active="true" noValidate onSubmit={submit} key="comedian">
            <div><h2>Get your name on the wall.</h2><p className="muted small" style={{ marginTop: 6 }}>We&apos;ll check you&apos;re real (and funny-adjacent) and email you when it&apos;s live.</p></div>
            <div className="field-row">
              <div className="field"><label htmlFor="c-name">Stage name</label><input className={cls('name')} id="c-name" name="name" type="text" required placeholder="As it appears on posters. Or would, if you had posters." onInput={() => clear('name')} /></div>
              <div className="field"><label htmlFor="c-email">Email</label><input className={cls('email')} id="c-email" name="email" type="email" autoComplete="email" required placeholder="you@example.co.za" onInput={() => clear('email')} /></div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="c-province">Home province</label>
                <select className={cls('province')} id="c-province" name="province" required defaultValue="" onChange={() => clear('province')}>
                  <option value="">Choose a province</option>{Object.values(PROVINCES).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="c-years">Years performing</label>
                <select className={cls('years')} id="c-years" name="years" required defaultValue="" onChange={() => clear('years')}>
                  <option value="">Select</option><option value="0">Just started (please be gentle)</option><option value="1">1–2 years</option><option value="3">3–5 years</option><option value="6">6–10 years</option><option value="10">10+ years (veteran, or just stubborn)</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="c-instagram">Instagram handle</label>
              <input className="input" id="c-instagram" name="instagram" type="text" placeholder="@yourhandle" autoCapitalize="off" autoCorrect="off" />
              <span className="hint">X, TikTok, YouTube and Facebook can come later. One handle. Focus.</span>
            </div>
            <div className="field">
              <label htmlFor="c-bio">Short bio</label>
              <textarea className="input" id="c-bio" name="bio" maxLength={280} placeholder="Two sentences. Where you're from, what your comedy is like, and the one credit your aunty brings up at every braai." onInput={(e) => setBioLen(e.currentTarget.value.length)} />
              <span className="hint">{bioLen}/280</span>
            </div>
            <label className="check"><input type="checkbox" name="newsletter" defaultChecked /> Also send me the weekly line-up and open-mic list (know thy enemy)</label>
            <button className={`btn btn-primary btn-lg ${sending ? 'is-transitioning' : ''}`} type="submit" disabled={sending}><span className="btn-content">{sending ? 'Sending…' : 'Initiate me'}</span></button>
            <p className="small muted">Every level welcome. If you&apos;ve done a paid spot or survived a regular open mic, you belong here.</p>
          </form>
        )}
      </div>
    </div>
  );
}
