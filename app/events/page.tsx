import type { Metadata } from 'next';
import { Suspense } from 'react';
import { EventsView } from '@/components/EventsView';
import { PageMedia } from '@/components/PageMedia';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Interactive calendar of every stand-up comedy show in South Africa, across all nine provinces. Browse by date, list or comedian.',
};

export default function EventsPage() {
  return (
    <>
      <section className="page-head has-media">
        <PageMedia src="/img/seats.jpg" priority />
        <div className="container">
          <span className="eyebrow enter" style={{ '--i': 0 } as React.CSSProperties}>Events</span>
          <h1 className="enter" style={{ '--i': 1 } as React.CSSProperties}>Where the laughs are.</h1>
          <p className="enter" style={{ '--i': 2 } as React.CSSProperties}>Every show we know about, three ways: a calendar, a straight list, or by comedian. Filter by province so you don&apos;t book a Durban show from Polokwane. Again.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Suspense><EventsView /></Suspense>
        </div>
      </section>
    </>
  );
}
