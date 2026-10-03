'use client';

/* Home: "What's on" — this week / this month with a province filter */

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PROVINCES, TODAY } from '@/lib/data';
import { endOfMonth, endOfWeek, eventsBetween, plural } from '@/lib/queries';
import type { ProvinceFilter } from '@/lib/types';
import { EventCard } from './Cards';
import { Empty, ProvinceChips, Segmented } from './ui';

type Range = 'week' | 'month';

export function ComingUp() {
  const [range, setRange] = useState<Range>('week');
  const [province, setProvince] = useState<ProvinceFilter>('all');

  const list = useMemo(() => {
    const to = range === 'week' ? endOfWeek() : endOfMonth();
    let l = eventsBetween(TODAY, to, province);
    // Late in the week "this week" would look empty — pad to the next 7 days.
    if (range === 'week' && l.length < 3) {
      const plus7 = new Date(TODAY); plus7.setDate(plus7.getDate() + 7);
      l = eventsBetween(TODAY, plus7, province);
    }
    return l;
  }, [range, province]);

  const label = province === 'all' ? 'all provinces' : PROVINCES[province].name;
  const shown = list.slice(0, 6);

  return (
    <>
      <div className="section-head">
        <div><span className="eyebrow">Book it before your cousin does</span><h2>What&apos;s on</h2></div>
        <Segmented value={range} onChange={setRange} label="Time range" options={[{ value: 'week', label: 'This week' }, { value: 'month', label: 'This month' }]} />
      </div>
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Province</span>
          <span className="filter-sep" />
          <div className="filter-group"><ProvinceChips value={province} onChange={setProvince} allLabel="All" /></div>
        </div>
        <span className="filter-result">{plural(list.length, 'show')} · {label}</span>
      </div>
      <div className="grid grid-3" key={`${range}-${province}`}>
        {shown.length
          ? shown.map((e, i) => <EventCard key={e.id} e={e} i={i} />)
          : <Empty title="Tumbleweeds." span>No {label} shows in this range. The full calendar is less depressing.</Empty>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
        <Link className="btn btn-ghost" href={province === 'all' ? '/events' : `/events?province=${province}`}>The whole unholy calendar</Link>
      </div>
    </>
  );
}
