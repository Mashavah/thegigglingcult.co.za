'use client';

/* News listing with topic chips */

import { useState } from 'react';
import { NEWS } from '@/lib/data';
import { NewsCard } from './Cards';

export function NewsList() {
  const topics = [...new Set(NEWS.map((n) => n.category))];
  const [topic, setTopic] = useState('all');
  const list = NEWS.filter((n) => topic === 'all' || n.category === topic);

  return (
    <>
      <div className="filter-bar enter" style={{ '--i': 3 } as React.CSSProperties}>
        <div className="filter-group">
          <span className="filter-label">Topic</span>
          <span className="filter-sep" />
          <div className="filter-group">
            <button className="chip" aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>All</button>
            {topics.map((t) => <button key={t} className="chip" aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</button>)}
          </div>
        </div>
        <span className="filter-result">{list.length} article{list.length === 1 ? '' : 's'}{topic === 'all' ? '' : ` · ${topic}`}</span>
      </div>
      <div className="grid grid-3" key={topic}>
        {list.map((n, i) => <NewsCard key={n.slug} n={n} i={i} featured={i === 0 && topic === 'all'} />)}
      </div>
    </>
  );
}
