'use client';

/* Comedians page: A–Z letter nav, province + rising filters, alphabetical grid.
   Letter, province and rising are mirrored into the URL. */

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { PROVINCES } from '@/lib/data';
import { LETTERS, firstLetter, sortedComedians } from '@/lib/queries';
import type { ProvinceFilter } from '@/lib/types';
import { ComedianCard } from './Cards';
import { Empty, ProvinceChips } from './ui';

const isProvince = (v: string | null): v is ProvinceFilter => !!v && v in PROVINCES;

export function ComediansGrid() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const province: ProvinceFilter = isProvince(params.get('province')) ? (params.get('province') as ProvinceFilter) : 'all';
  const rising = params.get('rising') === '1';
  const requested = (params.get('letter') ?? '').toUpperCase();

  const setParams = useCallback((patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => { if (v == null || v === 'all' || v === '') next.delete(k); else next.set(k, v); });
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [params, pathname, router]);

  // Comedians matching province/rising (the letter is applied on top)
  const base = useMemo(() => sortedComedians.filter((c) => (province === 'all' || c.province === province) && (!rising || c.upcoming)), [province, rising]);
  const available = useMemo(() => new Set(base.map(firstLetter)), [base]);
  // A letter with no matches under the current filters falls back to All
  const letter = LETTERS.includes(requested) && available.has(requested) ? requested : 'all';

  const list = letter === 'all' ? base : base.filter((c) => firstLetter(c) === letter);
  const where = province === 'all' ? '' : ` in ${PROVINCES[province].name}`;
  const who = rising ? 'rising comic' : 'comedian';
  const start = letter === 'all' ? '' : ` starting with ${letter}`;

  return (
    <>
      <nav className="alpha-nav enter" style={{ '--i': 3 } as React.CSSProperties} aria-label="Browse by first letter">
        <button className="alpha-btn alpha-all" aria-pressed={letter === 'all'} onClick={() => setParams({ letter: null })}>All</button>
        {LETTERS.map((L) => (
          <button key={L} className="alpha-btn" aria-pressed={letter === L} disabled={!available.has(L)} aria-label={`Comedians starting with ${L}`} onClick={() => setParams({ letter: L })}>{L}</button>
        ))}
      </nav>

      <div className="filter-bar enter" style={{ '--i': 4 } as React.CSSProperties}>
        <div className="filter-group">
          <span className="filter-label">Province</span>
          <span className="filter-sep" />
          <div className="filter-group"><ProvinceChips value={province} onChange={(p) => setParams({ province: p })} /></div>
        </div>
        <div className="filter-group">
          <span className="filter-sep" />
          <label className="check"><input type="checkbox" checked={rising} onChange={(e) => setParams({ rising: e.target.checked ? '1' : null })} /> Rising stars only</label>
        </div>
        <span className="filter-result">{list.length} {who}{list.length === 1 ? '' : 's'}{start}{where}</span>
      </div>

      <div className="grid grid-3" key={`${letter}-${province}-${rising}`}>
        {list.length
          ? list.map((c, i) => <ComedianCard key={c.slug} c={c} i={i} />)
          : <Empty title="Nobody. Not a soul." span>Try another letter, or clear the province filter. They can&apos;t all be from Durban.</Empty>}
      </div>
    </>
  );
}
