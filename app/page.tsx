import Image from 'next/image';
import Link from 'next/link';
import { ComingUp } from '@/components/ComingUp';
import { MiniEvent, NewsCard } from '@/components/Cards';
import { Icon } from '@/components/Icons';
import { PageMedia } from '@/components/PageMedia';
import { COMEDIANS, EVENTS, NEWS, PROVINCES, TODAY, VENUES, WEEK_SUMMARY } from '@/lib/data';
import { fmt } from '@/lib/dates';
import { endOfWeek, eventProvince, eventsBetween, startOfWeek, upcomingEvents } from '@/lib/queries';
import type { ProvinceId } from '@/lib/types';

export default function Home() {
  const weekStart = startOfWeek();
  const weekEnd = endOfWeek();
  const thisWeek = eventsBetween(weekStart, weekEnd);
  const upcoming = upcomingEvents();
  const weekAhead = thisWeek.filter((e) => e.date >= TODAY);

  const counts = Object.fromEntries(Object.keys(PROVINCES).map((k) => [k, 0])) as Record<ProvinceId, number>;
  thisWeek.forEach((e) => { counts[eventProvince(e)]++; });
  const venueCounts = new Map<string, number>();
  thisWeek.forEach((e) => venueCounts.set(e.venue, (venueCounts.get(e.venue) ?? 0) + 1));
  const busiest = [...venueCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  const headliners = thisWeek.filter((e) => e.type === 'headline' || e.type === 'tour').length;
  const comicsOnStage = new Set(thisWeek.flatMap((e) => e.lineup)).size;
  const soldOut = thisWeek.filter((e) => e.soldOut).length;
  const total = thisWeek.length || 1;
  const ticker = upcoming.slice(0, 12);
  const picks = WEEK_SUMMARY.picks.map((title) => EVENTS.find((e) => e.title === title && e.date >= TODAY)).filter((e): e is NonNullable<typeof e> => !!e);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-media" aria-hidden="true"><Image src="/img/hero.jpg" alt="" fill priority sizes="100vw" /></div>
        <div className="container hero-inner">
          <h1 className="enter" style={{ '--i': 0 } as React.CSSProperties}>Come for the giggles. <em>Stay for the cult.</em></h1>
          <p className="lead enter" style={{ '--i': 1 } as React.CSSProperties}>The Giggling Cult keeps the sacred calendar of every stand-up show in South Africa, all nine provinces: who&apos;s on, where, when, and whether it&apos;s sold out yet. No robes. No rituals. Just laughing in a dark room with strangers.</p>
          <div className="hero-actions enter" style={{ '--i': 2 } as React.CSSProperties}>
            <Link className="btn btn-primary btn-lg" href="/events">Show me the shows</Link>
            <Link className="btn btn-ghost btn-lg" href="/comedians">Find your comedian</Link>
          </div>
          <div className="hero-stats enter" style={{ '--i': 3 } as React.CSSProperties}>
            <div className="stat"><b>{weekAhead.length}</b><span>shows before Sunday</span></div>
            <div className="stat"><b>{upcoming.length}</b><span>shows on the books</span></div>
            <div className="stat"><b>{COMEDIANS.length}</b><span>comics in the congregation</span></div>
            <div className="stat"><b>{Object.keys(PROVINCES).length}</b><span>provinces, every one of them</span></div>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...ticker, ...ticker].map((e, i) => <span key={i}>{fmt.relative(e.date)} <b>{e.title}</b> {VENUES[e.venue].name}</span>)}
        </div>
      </div>

      {/* This week */}
      <section className="section band">
        <PageMedia src="/img/festival.jpg" />
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">The weekly sermon</span>
              <h2>{fmt.dow(weekStart)} {fmt.day(weekStart)} – {fmt.dow(weekEnd)} {fmt.day(weekEnd)} {fmt.monLong(weekEnd)}</h2>
            </div>
          </div>
          <div className="week-panel">
            <div className="week-editorial enter" style={{ '--i': 0 } as React.CSSProperties}>
              <div className="week-media"><Image src="/img/tickets.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 60vw" /></div>
              <div className="week-body">
              <span className="eyebrow" style={{ margin: 0 }}>From the pulpit</span>
              <h3>{WEEK_SUMMARY.headline}</h3>
              <p>{WEEK_SUMMARY.body}</p>
              <div className="week-picks">
                <span className="filter-label" style={{ marginBottom: 4 }}>Go to these. Seriously.</span>
                {picks.map((e) => <MiniEvent key={e.id} e={e} />)}
              </div>
              </div>
            </div>
            <div className="week-stats">
              <div className="week-stat is-wide enter" style={{ '--i': 1 } as React.CSSProperties}>
                <b>{thisWeek.length}</b><span>shows this week across {Object.values(counts).filter(Boolean).length} provinces. Pick a lane.</span>
                <div className="bar">{(Object.keys(counts) as ProvinceId[]).map((k) => <i key={k} style={{ width: `${(counts[k] / total) * 100}%`, background: `var(--${k})` }} />)}</div>
                <div className="legend">{(Object.keys(counts) as ProvinceId[]).filter((k) => counts[k]).map((k) => <span key={k}><i style={{ background: `var(--${k})` }} />{PROVINCES[k].short} {counts[k]}</span>)}</div>
              </div>
              <div className="week-stat enter" style={{ '--i': 2 } as React.CSSProperties}><b>{comicsOnStage}</b><span>comics risking it all</span></div>
              <div className="week-stat enter" style={{ '--i': 3 } as React.CSSProperties}><b>{headliners}</b><span>headliners, name on the poster</span></div>
              <div className="week-stat enter" style={{ '--i': 4 } as React.CSSProperties}><b>{soldOut}</b><span>gone already. Should&apos;ve moved faster.</span></div>
              <div className="week-stat enter" style={{ '--i': 5 } as React.CSSProperties}><b style={{ fontSize: 17, lineHeight: 1.2 }}>{busiest ? VENUES[busiest[0] as keyof typeof VENUES].name : '—'}</b><span>hardest-working room · {busiest ? busiest[1] : 0} shows</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming up */}
      <section className="section">
        <div className="container">
          <ComingUp />
        </div>
      </section>

      {/* News */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Hot off the mic</span><h2>Who&apos;s doing what, where</h2></div>
            <Link className="btn btn-soft btn-sm" href="/news">All the goss</Link>
          </div>
          <div className="grid grid-3">{NEWS.slice(0, 3).map((n, i) => <NewsCard key={n.slug} n={n} i={i} />)}</div>
        </div>
      </section>

      {/* Join */}
      <section className="section band">
        <PageMedia src="/img/crowd.jpg" />
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Join the cult</span><h2>Initiation is free. Robes optional.</h2></div>
          </div>
          <div className="join-split">
            <Link className="join-tile" href="/join?as=comedian">
              <span className="tag tag-accent" style={{ alignSelf: 'flex-start' }}>Comedians</span>
              <h3>Get on the list. The good list.</h3>
              <p>A profile on the A–Z, your socials linked, and every gig you do on the calendar the week it&apos;s announced. Bookers look here. So will your mother.</p>
              <span className="arrow">Enlist as a comedian <Icon.arrow /></span>
            </Link>
            <Link className="join-tile" href="/join?as=audience">
              <span className="tag" style={{ alignSelf: 'flex-start' }}>Audience</span>
              <h3>One email a week. Zero spam. Mostly jokes.</h3>
              <p>Pick your province and we&apos;ll send the week&apos;s shows, the sold-out warnings, and the new faces to see before they get famous and expensive.</p>
              <span className="arrow">Join the flock <Icon.arrow /></span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
