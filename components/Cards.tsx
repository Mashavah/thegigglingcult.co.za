'use client';

/* Event, comedian and news cards */

import Image from 'next/image';
import Link from 'next/link';
import { TODAY, VENUES } from '@/lib/data';
import { fmt } from '@/lib/dates';
import { imageForCategory } from '@/lib/imagery';
import { TYPE_LABEL, bySlug, plural, sameDay, upcomingFor } from '@/lib/queries';
import type { Article, Comedian, Event } from '@/lib/types';
import { Icon } from './Icons';
import { useUI } from './UIProvider';
import { Avatar, ProvinceTag, RisingTag, Socials } from './ui';

const Price = ({ e }: { e: Event }) => (
  <span className="event-price">{e.soldOut ? <span className="tag tag-soldout">Sold out</span> : fmt.rand(e.price)}</span>
);

export function EventCard({ e, i = 0 }: { e: Event; i?: number }) {
  const { openEvent } = useUI();
  const v = VENUES[e.venue];
  const cls = ['card is-button event-card enter', e.date < TODAY && 'is-past', sameDay(e.date, TODAY) && 'is-today'].filter(Boolean).join(' ');
  return (
    <button className={cls} style={{ '--i': i } as React.CSSProperties} data-type={e.type} onClick={() => openEvent(e.id)}>
      <div className="ec-top">
        <div className="event-date"><span className="d">{fmt.day(e.date)}</span><span className="m">{fmt.dow(e.date)} · {fmt.mon(e.date)}</span></div>
        <ProvinceTag id={v.province} />
      </div>
      <h3>{e.title}</h3>
      <div className="event-meta">
        <span><strong>{v.name}</strong> · {v.area}</span>
        <span>{e.time} · {TYPE_LABEL[e.type]}</span>
      </div>
      <div className="event-lineup">
        {e.lineup.slice(0, 4).map((s) => <span key={s}>{bySlug[s].name}</span>)}
        {e.lineup.length > 4 && <span>+{e.lineup.length - 4}</span>}
      </div>
      <div className="ec-foot">
        <Price e={e} />
        <span className="small muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Details <Icon.arrow style={{ width: 14, height: 14 }} /></span>
      </div>
    </button>
  );
}

export function EventRow({ e, i = 0 }: { e: Event; i?: number }) {
  const { openEvent } = useUI();
  const v = VENUES[e.venue];
  return (
    <button className="event-row enter" style={{ '--i': i } as React.CSSProperties} onClick={() => openEvent(e.id)}>
      <div className="event-date"><span className="d">{fmt.day(e.date)}</span><span className="m">{fmt.dow(e.date)}</span></div>
      <div>
        <h3>{e.title}</h3>
        <div className="event-meta">
          <span><strong>{v.name}</strong></span>
          <span>{e.time}</span>
          <span>{e.lineup.slice(0, 3).map((s) => bySlug[s].name).join(', ')}{e.lineup.length > 3 && ` +${e.lineup.length - 3}`}</span>
        </div>
      </div>
      <div className="er-right"><ProvinceTag id={v.province} /><Price e={e} /></div>
    </button>
  );
}

export function MiniEvent({ e }: { e: Event }) {
  const { openEvent } = useUI();
  const v = VENUES[e.venue];
  return (
    <button className="mini-event" onClick={() => openEvent(e.id)}>
      <div className="event-date"><span className="d">{fmt.day(e.date)}</span><span className="m">{fmt.mon(e.date)}</span></div>
      <div>
        <div className="t">{e.title}</div>
        <div className="s">{v.name} · {e.time}{e.soldOut && ' · Sold out'}</div>
      </div>
    </button>
  );
}

/* Groups a list of events under date headings */
export function EventsByDate({ events }: { events: Event[] }) {
  const groups = new Map<string, Event[]>();
  events.forEach((e) => { const k = fmt.key(e.date); if (!groups.has(k)) groups.set(k, []); groups.get(k)!.push(e); });
  let i = 0;
  return (
    <>
      {[...groups.values()].map((evs) => (
        <div className="date-group" key={fmt.key(evs[0].date)}>
          <div className="date-group-title">{fmt.long(evs[0].date)} <span className="muted">{fmt.relative(evs[0].date)}</span></div>
          <div className="stack">{evs.map((e) => <EventRow key={e.id} e={e} i={i++} />)}</div>
        </div>
      ))}
    </>
  );
}

export function ComedianCard({ c, i = 0 }: { c: Comedian; i?: number }) {
  const shows = upcomingFor(c.slug).length;
  return (
    // The whole card is clickable via the stretched name link; the social icons stay separate links (no nested <a>).
    <article className="card is-button comedian-card enter" style={{ '--i': i } as React.CSSProperties}>
      <div className="cc-media"><Avatar c={c} /></div>
      <div className="cc-body">
        <div className="cc-top">
          <h3><Link className="cc-link" href={`/comedians/${c.slug}`}>{c.name}</Link></h3>
          <div className="cc-sub"><ProvinceTag id={c.province} />{c.upcoming && <RisingTag />}</div>
        </div>
        <p className="bio">{c.bio}</p>
        <div className="cc-foot">
          <span className="style-line">{shows ? plural(shows, 'upcoming show') : 'Between gigs'}</span>
          <Socials c={c} />
        </div>
      </div>
    </article>
  );
}

export function NewsCard({ n, i = 0, featured = false }: { n: Article; i?: number; featured?: boolean }) {
  return (
    <Link className={`card is-link news-card enter ${featured ? 'news-feature' : ''}`} style={{ '--i': i } as React.CSSProperties} href={`/news/${n.slug}`}>
      <div className="nc-media"><Image src={imageForCategory(n.category)} alt="" fill sizes={featured ? '(max-width: 900px) 100vw, 66vw' : '(max-width: 900px) 100vw, 33vw'} /></div>
      <div className="nc-body">
      <div className="nc-meta"><span className="tag tag-accent">{n.category}</span><span>{fmt.short(n.date)}</span><span>·</span><span>{n.readTime} min read</span></div>
      <h3>{n.title}</h3>
      <p>{n.excerpt}</p>
      <span className="nc-foot">Read <Icon.arrow /></span>
      </div>
    </Link>
  );
}
