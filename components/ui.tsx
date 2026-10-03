'use client';

/* Small shared UI primitives: avatar, tags, chips, segmented control, socials */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { PROVINCES } from '@/lib/data';
import photos from '@/lib/photos.json';
import type { Comedian, ProvinceFilter, ProvinceId, SocialNetwork } from '@/lib/types';
import { Icon, SOCIAL_LABEL, SOCIAL_URL } from './Icons';

/* ---------- Avatar (photo with initials fallback) ---------- */
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

const PHOTOS = new Set<string>(photos);

export function Avatar({ c, large = false }: { c: Comedian; large?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  // Explicit `photo` URL, else a file in public/img/comedians indexed by scripts/index-photos.js
  const src = c.photo ?? (PHOTOS.has(c.slug) ? `/img/comedians/${c.slug}.jpg` : null);
  // An image that finished loading before hydration never fires onLoad — check on mount.
  useEffect(() => { if (img.current?.complete && img.current.naturalWidth > 0) setLoaded(true); }, []);
  return (
    <span className={`avatar ${large ? 'avatar-lg' : ''} ${loaded ? 'has-photo' : ''}`} aria-hidden="true">
      {initials(c.name)}
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img ref={img} src={src} alt="" loading="lazy" decoding="async" onLoad={() => setLoaded(true)} />
      )}
    </span>
  );
}

/* ---------- Tags ---------- */
export const ProvinceTag = ({ id }: { id: ProvinceId }) => (
  <span className="tag" data-province={id}>{PROVINCES[id].short}</span>
);
export const RisingTag = () => <span className="tag tag-rising">Rising</span>;

/* ---------- Socials ---------- */
export function Socials({ c, expanded = false }: { c: Comedian; expanded?: boolean }) {
  const entries = Object.entries(c.socials) as [SocialNetwork, string][];
  if (expanded) {
    return (
      <div className="social-row">
        {entries.map(([k, h]) => { const I = Icon[k]; return (
          <a key={k} className="social-link" href={SOCIAL_URL[k](h)} target="_blank" rel="noopener"><I />{SOCIAL_LABEL[k]}</a>
        ); })}
      </div>
    );
  }
  return (
    <div className="socials">
      {entries.map(([k, h]) => { const I = Icon[k]; return (
        <a key={k} className="social" href={SOCIAL_URL[k](h)} target="_blank" rel="noopener" aria-label={`${c.name} on ${SOCIAL_LABEL[k]}`} ><I /></a>
      ); })}
    </div>
  );
}

/* ---------- Province chips (single select) ---------- */
export function ProvinceChips({ value, onChange, allLabel = 'All provinces' }: { value: ProvinceFilter; onChange: (v: ProvinceFilter) => void; allLabel?: string }) {
  return (
    <>
      <button className="chip" aria-pressed={value === 'all'} onClick={() => onChange('all')}>{allLabel}</button>
      {Object.values(PROVINCES).map((p) => (
        <button key={p.id} className="chip" data-province={p.id} aria-pressed={value === p.id} onClick={() => onChange(p.id)}>{p.name}</button>
      ))}
    </>
  );
}

/* ---------- Segmented control with a sliding indicator ---------- */
export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState<{ x: number; w: number } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const measure = () => {
      const el = ref.current?.querySelector<HTMLButtonElement>(`[data-value="${value}"]`);
      if (el) setInd({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    // Widths shift once the display font lands
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    const t = setTimeout(() => setReady(true), 50);
    return () => { window.removeEventListener('resize', measure); clearTimeout(t); };
  }, [value]);

  return (
    <div className="seg" role="group" aria-label={label} ref={ref}>
      <span className="seg-indicator" style={{ width: ind?.w ?? 0, transform: `translateX(${ind?.x ?? 0}px)`, transition: ready ? undefined : 'none' }} />
      {options.map((o) => (
        <button key={o.value} className="seg-btn" data-value={o.value} aria-pressed={value === o.value} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

/* ---------- Empty state ---------- */
export const Empty = ({ title, children, span = false }: { title: string; children?: ReactNode; span?: boolean }) => (
  <div className="empty" style={span ? { gridColumn: '1 / -1' } : undefined}><b>{title}</b>{children && <span>{children}</span>}</div>
);
