'use client';

/* Reusable "What's on" preview — launch provinces only. */

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PROVINCES, TODAY } from '@/lib/data';
import { endOfMonth, endOfWeek, eventProvince, eventsBetween, plural } from '@/lib/queries';
import type { ProvinceFilter, ProvinceId } from '@/lib/types';
import { EventCard } from './Cards';
import { Empty, ProvinceChips, Segmented } from './ui';

type Range = 'week' | 'month';

const LAUNCH_PROVINCES: ProvinceId[] = ['gp', 'wc', 'kzn', 'ec'];

export function ComingUp() {
  const [range, setRange] = useState<Range>('week');
  const [province, setProvince] = useState<ProvinceFilter>('all');

  const list = useMemo(() => {
    const to = range === 'week' ? endOfWeek() : endOfMonth();
    let result = eventsBetween(TODAY, to, province).filter((e) =>
      LAUNCH_PROVINCES.includes(eventProvince(e)),
    );

    if (range === 'week' && result.length < 3) {
      const plus7 = new Date(TODAY);
      plus7.setDate(plus7.getDate() + 7);

      result = eventsBetween(TODAY, plus7, province).filter((e) =>
        LAUNCH_PROVINCES.includes(eventProvince(e)),
      );
    }

    return result;
  }, [range, province]);

  const label =
    province === 'all'
      ? 'all launch provinces'
      : PROVINCES[province].name;

  const shown = list.slice(0, 6);

  return (
    <>
      <div className="section-head">
        <div>
          <span className="eyebrow">Laughs ahead</span>
          <h2>What&apos;s on</h2>
        </div>

        <Segmented
          value={range}
          onChange={setRange}
          label="Time range"
          options={[
            { value: 'week', label: 'This week' },
            { value: 'month', label: 'This month' },
          ]}
        />
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Province</span>
          <span className="filter-sep" />
          <div className="filter-group">
            <ProvinceChips
              value={province}
              onChange={setProvince}
              allLabel="All"
              provinces={LAUNCH_PROVINCES}
            />
          </div>
        </div>

        <span className="filter-result">
          {plural(list.length, 'show')} · {label}
        </span>
      </div>

      <p className="province-launch-note">
        Starting where the scene is loudest — more provinces unlocking soon.
      </p>

      <div className="grid grid-3" key={`${range}-${province}`}>
        {shown.length
          ? shown.map((e, i) => <EventCard key={e.id} e={e} i={i} />)
          : (
            <Empty title="Nothing listed yet." span>
              No {label} shows in this range. Try the full calendar.
            </Empty>
          )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
        <Link
          className="btn btn-ghost"
          href={province === 'all' ? '/events' : `/events?province=${province}`}
        >
          View the full calendar
        </Link>
      </div>
    </>
  );
}
