'use client';

/* Events page: calendar / list / by-comedian views with a province filter.
   View, province and comedian are mirrored into the URL so links are shareable. */

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EVENTS, PROVINCES, TODAY } from '@/lib/data';
import { fmt } from '@/lib/dates';
import { LETTERS, bySlug, eventProvince, inProvince, plural, sameDay, sortedComedians, upcomingEvents, upcomingFor } from '@/lib/queries';
import type { Comedian, Event, ProvinceFilter } from '@/lib/types';
import { EventCard, EventsByDate } from './Cards';
import { Icon } from './Icons';
import { Avatar, Empty, ProvinceChips, ProvinceTag, RisingTag, Segmented } from './ui';

type View = 'calendar' | 'list' | 'comedian';
const VIEWS: View[] = ['calendar', 'list', 'comedian'];
const HINTS: Record<View, string> = {
  calendar: 'Dots mark shows by province. Colours, because reading is hard.',
  list: 'Soonest first. Panic accordingly.',
  comedian: 'Only comics with shows on the books. The rest are “writing”.',
};
const isProvince = (v: string | null): v is ProvinceFilter => !!v && v in PROVINCES;

export function EventsView() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const view: View = VIEWS.includes(params.get('view') as View) ? (params.get('view') as View) : 'calendar';
  const province: ProvinceFilter = isProvince(params.get('province')) ? params.get('province') as ProvinceFilter : 'all';
  const comedianSlug = params.get('comedian') && bySlug[params.get('comedian')!] ? params.get('comedian')! : null;

  const setParams = useCallback((patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => { if (v == null || v === 'all' || v === 'calendar') next.delete(k); else next.set(k, v); });
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [params, pathname, router]);

  const provinceLabel = province === 'all' ? 'all provinces' : PROVINCES[province].name;

  return (
    <>
      <div className="section-head" style={{ marginBottom: 16, border: 0, paddingBottom: 0 }}>
        <Segmented value={view} onChange={(v) => setParams({ view: v })} label="View"
          options={[{ value: 'calendar', label: 'Calendar' }, { value: 'list', label: 'List' }, { value: 'comedian', label: 'By comedian' }]} />
        <span className="small muted">{HINTS[view]}</span>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Province</span>
          <span className="filter-sep" />
          <div className="filter-group"><ProvinceChips value={province} onChange={(p) => setParams({ province: p })} /></div>
        </div>
        <span className="filter-result" id="filter-result" />
      </div>

      {view === 'calendar' && <CalendarView province={province} provinceLabel={provinceLabel} />}
      {view === 'list' && <ListView province={province} provinceLabel={provinceLabel} />}
      {view === 'comedian' && <ComedianView province={province} provinceLabel={provinceLabel} slug={comedianSlug} onPick={(s) => setParams({ comedian: s })} />}
    </>
  );
}

/* Writes the result summary into the filter bar */
function useResult(text: string) {
  useEffect(() => { const el = document.getElementById('filter-result'); if (el) el.textContent = text; }, [text]);
}

/* ---------- Calendar ---------- */
function CalendarView({ province, provinceLabel }: { province: ProvinceFilter; provinceLabel: string }) {
  const [month, setMonth] = useState(() => new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const [selected, setSelected] = useState(() => new Date(TODAY));
  const [switching, setSwitching] = useState(false);

  const eventsOn = useCallback((d: Date) => allEvents(province).filter((e) => sameDay(e.date, d)), [province]);

  const y = month.getFullYear(); const m = month.getMonth();
  const cells = useMemo(() => {
    const first = new Date(y, m, 1);
    const lead = (first.getDay() + 6) % 7; // Monday-based
    const days = new Date(y, m + 1, 0).getDate();
    const out: { d: Date; other: boolean }[] = [];
    for (let i = lead; i > 0; i--) out.push({ d: new Date(y, m, 1 - i), other: true });
    for (let i = 1; i <= days; i++) out.push({ d: new Date(y, m, i), other: false });
    while (out.length % 7) out.push({ d: new Date(y, m + 1, out.length - lead - days + 1), other: true });
    return out;
  }, [y, m]);

  const monthCount = allEvents(province).filter((e) => e.date.getFullYear() === y && e.date.getMonth() === m).length;
  useResult(`${plural(monthCount, 'show')} in ${fmt.monLong(month)} · ${provinceLabel}`);

  const switchMonth = (delta: number) => {
    const next = new Date(y, m + delta, 1);
    const firstWithShows = allEvents(province).find((e) => e.date.getFullYear() === next.getFullYear() && e.date.getMonth() === next.getMonth());
    setSwitching(true);
    setTimeout(() => { setMonth(next); setSelected(firstWithShows ? new Date(firstWithShows.date) : next); setSwitching(false); }, 120);
  };
  const goToday = () => { setMonth(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)); setSelected(new Date(TODAY)); };

  // Arrow keys move focus across the grid — instant, no animation.
  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(e.key in map)) return;
    const days = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('.cal-day:not([disabled])')];
    const idx = days.indexOf(document.activeElement as HTMLButtonElement);
    const next = days[idx + map[e.key]];
    if (idx >= 0 && next) { e.preventDefault(); next.focus(); }
  };

  const selectedInMonth = selected.getMonth() === m && selected.getFullYear() === y;
  const dayEvents = eventsOn(selected);

  return (
    <div className="calendar">
      <div className="cal">
        <div className="cal-head">
          <span className="cal-title">{fmt.monLong(month)} {y}</span>
          <div className="cal-nav">
            <button className="icon-btn" onClick={() => switchMonth(-1)} aria-label="Previous month"><Icon.left /></button>
            <button className="btn btn-soft btn-sm" onClick={goToday}>Today</button>
            <button className="icon-btn" onClick={() => switchMonth(1)} aria-label="Next month"><Icon.right /></button>
          </div>
        </div>
        <div className="cal-dow">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <span key={d}>{d}</span>)}</div>
        <div className={`cal-grid ${switching ? 'is-switching' : ''}`} role="grid" onKeyDown={onKey}>
          {cells.map(({ d, other }) => {
            const evs = other ? [] : eventsOn(d);
            const provs = [...new Set(evs.map(eventProvince))];
            const cls = ['cal-day', other && 'is-other', d < TODAY && 'is-past', sameDay(d, TODAY) && 'is-today'].filter(Boolean).join(' ');
            return (
              <button key={d.toISOString()} className={cls} role="gridcell" disabled={other} tabIndex={other ? -1 : 0}
                aria-pressed={!other && sameDay(d, selected)} aria-label={`${fmt.long(d)}${evs.length ? `, ${plural(evs.length, 'show')}` : ''}`}
                onClick={() => setSelected(d)}>
                <span className="n">{d.getDate()}</span>
                <span className="cal-dots">{provs.map((p) => <i key={p} style={{ background: `var(--${p})` }} />)}</span>
              </button>
            );
          })}
        </div>
        <div className="cal-legend">
          {Object.values(PROVINCES).map((p) => <span key={p.id}><i style={{ background: `var(--${p.id})` }} />{p.name}</span>)}
          <span style={{ marginLeft: 'auto' }}>Click a day. Go on.</span>
        </div>
      </div>
      <div className="cal-side" key={selected.toISOString()}>
        {!selectedInMonth
          ? <Empty title="Pick a day, any day">The ones with dots have shows. Start there.</Empty>
          : <>
              <div className="cal-side-title">{fmt.long(selected)} <span className="muted">· {fmt.relative(selected)}</span></div>
              {dayEvents.length
                ? dayEvents.map((e, i) => <EventCard key={e.id} e={e} i={i} />)
                : <Empty title="Dead night.">{province === 'all' ? 'Even comedians need sleep. Try another date.' : `Nothing in ${PROVINCES[province].name}. Try another province, or another date.`}</Empty>}
            </>}
      </div>
    </div>
  );
}

/* All events (past included) in a province — the calendar shows history too */
const allEvents = (p: ProvinceFilter): Event[] => EVENTS.filter((e) => inProvince(e, p));

/* ---------- List ---------- */
function ListView({ province, provinceLabel }: { province: ProvinceFilter; provinceLabel: string }) {
  const list = useMemo(() => upcomingEvents(province), [province]);
  useResult(`${plural(list.length, 'upcoming show')} · ${provinceLabel}`);
  return list.length
    ? <div key={province}><EventsByDate events={list} /></div>
    : <Empty title="Nothing on the books">No shows listed for {provinceLabel} yet. Give it a minute.</Empty>;
}

/* ---------- By comedian ---------- */
function ComedianView({ province, provinceLabel, slug, onPick }: { province: ProvinceFilter; provinceLabel: string; slug: string | null; onPick: (s: string) => void }) {
  const [search, setSearch] = useState('');
  const [letter, setLetter] = useState('all');

  const all = useMemo(() => sortedComedians
    .map((c) => ({ c, shows: upcomingFor(c.slug, province) }))
    .filter(({ shows }) => shows.length), [province]);
  const available = useMemo(() => new Set(all.map(({ c }) => c.name[0].toUpperCase())), [all]);
  const activeLetter = letter !== 'all' && !available.has(letter) ? 'all' : letter;

  const q = search.trim().toLowerCase();
  let list = q ? all.filter(({ c }) => c.name.toLowerCase().includes(q)) : all;
  if (activeLetter !== 'all') list = list.filter(({ c }) => c.name[0].toUpperCase() === activeLetter);

  useResult(`${plural(all.length, 'comedian')} with upcoming shows · ${provinceLabel}`);

  const picked: Comedian | null = slug ? bySlug[slug] : null;
  const pickedShows = picked ? upcomingFor(picked.slug, province) : [];

  return (
    <div className="picker">
      <div className="picker-list">
        <div className="picker-search">
          <div className="search-wrap">
            <Icon.search />
            <input className="input" type="search" placeholder="Who are we looking for?" autoComplete="off" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <nav className="alpha-nav alpha-compact" aria-label="Browse comedians by first letter">
          <button className="alpha-btn alpha-all" aria-pressed={activeLetter === 'all'} onClick={() => setLetter('all')}>All</button>
          {LETTERS.map((L) => (
            <button key={L} className="alpha-btn" aria-pressed={activeLetter === L} disabled={!available.has(L)} aria-label={`Comedians starting with ${L}`} onClick={() => setLetter(L)}>{L}</button>
          ))}
        </nav>
        <div>
          {list.length
            ? list.map(({ c, shows }) => (
                <button key={c.slug} className="picker-item" aria-pressed={slug === c.slug} onClick={() => onPick(c.slug)}>
                  <Avatar c={c} /><span className="name">{c.name}</span><span className="count">{shows.length}</span>
                </button>
              ))
            : <div className="picker-empty">{q ? `Nobody called “${search}”. Yet.` : `No one under ${activeLetter} with a show booked.`}</div>}
        </div>
      </div>
      <div key={slug ?? 'none'}>
        {!picked
          ? <Empty title="Pick your poison">Choose a name on the left to see every show they&apos;re on.</Empty>
          : <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, flexWrap: 'wrap' }}>
                <Avatar c={picked} large />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h2 style={{ fontSize: 28 }}>{picked.name}</h2>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}><ProvinceTag id={picked.province} />{picked.upcoming && <RisingTag />}<span className="tag">{plural(pickedShows.length, 'show')}</span></div>
                </div>
                <Link className="btn btn-ghost btn-sm" href={`/comedians/${picked.slug}`}>Profile <Icon.arrow /></Link>
              </div>
              {pickedShows.length
                ? <EventsByDate events={pickedShows} />
                : <Empty title={`Not in ${provinceLabel} this time`}>Try another province. They travel, mostly.</Empty>}
            </>}
      </div>
    </div>
  );
}
