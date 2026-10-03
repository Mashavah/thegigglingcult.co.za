'use client';

/* Comedians page: A–Z navigation for launch. Province and Rising filters are parked. */

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { LETTERS, firstLetter, sortedComedians } from '@/lib/queries';
import { ComedianCard } from './Cards';
import { Empty } from './ui';

export function ComediansGrid() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const requested = (params.get('letter') ?? '').toUpperCase();

  const setParams = useCallback((patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());

    Object.entries(patch).forEach(([k, v]) => {
      if (v == null || v === '') next.delete(k);
      else next.set(k, v);
    });

    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [params, pathname, router]);

  const base = useMemo(() => sortedComedians, []);
  const available = useMemo(() => new Set(base.map(firstLetter)), [base]);
  const letter =
    LETTERS.includes(requested) && available.has(requested)
      ? requested
      : 'all';

  const list =
    letter === 'all'
      ? base
      : base.filter((c) => firstLetter(c) === letter);

  const start = letter === 'all' ? '' : ` starting with ${letter}`;

  return (
    <>
      <nav
        className="alpha-nav enter"
        style={{ '--i': 3 } as React.CSSProperties}
        aria-label="Browse comedians by first letter"
      >
        <button
          className="alpha-btn alpha-all"
          aria-pressed={letter === 'all'}
          onClick={() => setParams({ letter: null })}
        >
          All
        </button>

        {LETTERS.map((L) => (
          <button
            key={L}
            className="alpha-btn"
            aria-pressed={letter === L}
            disabled={!available.has(L)}
            aria-label={`Comedians starting with ${L}`}
            onClick={() => setParams({ letter: L })}
          >
            {L}
          </button>
        ))}
      </nav>

      <div
        className="filter-bar enter"
        style={{ '--i': 4 } as React.CSSProperties}
      >
        <div className="filter-group">
          <span className="filter-label">Rising Stars</span>
          <span className="tag">Coming soon</span>
        </div>

        <span className="filter-result">
          {list.length} comedian{list.length === 1 ? '' : 's'}{start}
        </span>
      </div>

      <div className="grid grid-3" key={letter}>
        {list.length
          ? list.map((c, i) => <ComedianCard key={c.slug} c={c} i={i} />)
          : (
            <Empty title="Nobody. Not a soul." span>
              Try another letter.
            </Empty>
          )}
      </div>

      <p className="comedian-disclaimer">
        Bios are sourced from publicly available social profiles. Comedians can
        contact The Giggling Cult to request corrections or updates.
      </p>
    </>
  );
}
