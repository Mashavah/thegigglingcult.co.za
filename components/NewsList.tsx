'use client';

/* Launch news listing — no topic filters yet. */

import { NEWS } from '@/lib/data';
import { NewsCard } from './Cards';

export function NewsList() {
  return (
    <div className="grid grid-3">
      {NEWS.map((n, i) => (
        <NewsCard
          key={n.slug}
          n={n}
          i={i}
          featured={i === 0}
        />
      ))}
    </div>
  );
}
