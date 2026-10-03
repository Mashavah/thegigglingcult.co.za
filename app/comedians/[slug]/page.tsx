import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ComedianCard, MiniEvent } from '@/components/Cards';
import { Icon } from '@/components/Icons';
import { PageMedia } from '@/components/PageMedia';
import { Avatar, ProvinceTag, RisingTag, Socials } from '@/components/ui';
import { PROVINCES } from '@/lib/data';
import { comedian, plural, sortedComedians, upcomingFor } from '@/lib/queries';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = comedian((await params).slug);
  return c ? { title: c.name, description: c.bio } : {};
}

// Demo dates are relative to today, so render on demand rather than at build time.
export const dynamic = 'force-dynamic';

export default async function ComedianPage({ params }: Props) {
  const c = comedian((await params).slug);
  if (!c) notFound();
  const shows = upcomingFor(c.slug);
  // Neighbours in the same province, for "also on the bill"
  const related = sortedComedians.filter((x) => x.slug !== c.slug && x.province === c.province).slice(0, 3);

  return (
    <>
      <section className="page-head has-media">
        <PageMedia src="/img/greenroom.jpg" priority />
        <div className="container">
          <Link className="btn btn-soft btn-sm enter" style={{ '--i': 0 } as React.CSSProperties} href="/comedians"><Icon.left /> All comedians</Link>
          <div className="enter" style={{ '--i': 1, display: 'flex', gap: 24, alignItems: 'center', marginTop: 32, flexWrap: 'wrap' } as React.CSSProperties}>
            <Avatar c={c} large />
            <div>
              <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}>{c.name}</h1>
              <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                <ProvinceTag id={c.province} /><span className="tag">{PROVINCES[c.province].city}</span>{c.upcoming && <RisingTag />}
              </div>
            </div>
          </div>
          <p className="enter" style={{ '--i': 2, maxWidth: 640, fontSize: 17 } as React.CSSProperties}>{c.bio}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container join-layout">
          <div className="enter" style={{ '--i': 3 } as React.CSSProperties}>
            <div className="drawer-section" style={{ marginBottom: 28 }}><h4>Style</h4><p>{c.style}</p></div>
            <div className="drawer-section"><h4>Follow</h4><Socials c={c} expanded /></div>
          </div>
          <div className="enter" style={{ '--i': 4 } as React.CSSProperties}>
            <div className="drawer-section">
              <h4>Upcoming shows · {plural(shows.length, 'date')}</h4>
              {shows.length
                ? <div className="lineup-list">{shows.map((e) => <MiniEvent key={e.id} e={e} />)}</div>
                : <p className="muted small">Nothing on the books. Probably “writing”.</p>}
            </div>
            <div style={{ marginTop: 20 }}>
              <Link className="btn btn-ghost" href={`/events?view=comedian&comedian=${c.slug}`}>See their gigs on the calendar <Icon.arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head"><div><span className="eyebrow">Same territory</span><h2>More from {PROVINCES[c.province].name}</h2></div></div>
            <div className="grid grid-3">{related.map((x, i) => <ComedianCard key={x.slug} c={x} i={i} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
