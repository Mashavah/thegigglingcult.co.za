import type { Metadata } from 'next';
import { Suspense } from 'react';
import { JoinForm } from '@/components/JoinForm';
import { PageMedia } from '@/components/PageMedia';

export const metadata: Metadata = {
  title: 'Join the Cult',
  description: 'Join The Giggling Cult as a comedian to list your shows, or as an audience member for the weekly South African comedy newsletter.',
};

export default function JoinPage() {
  return (
    <>
      <section className="page-head has-media">
        <PageMedia src="/img/crowd.jpg" priority />
        <div className="container">
          <span className="eyebrow enter" style={{ '--i': 0 } as React.CSSProperties}>Join the cult</span>
          <h1 className="enter" style={{ '--i': 1 } as React.CSSProperties}>Pick your side.</h1>
          <p className="enter" style={{ '--i': 2 } as React.CSSProperties}>Comedians get a profile and a spot on the calendar. Audiences get one email a week with every show worth seeing. Both free. No goats involved.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container"><Suspense><JoinForm /></Suspense></div>
      </section>
    </>
  );
}
