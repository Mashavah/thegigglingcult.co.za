import type { Metadata } from 'next';
import { Suspense } from 'react';
import { JoinForm } from '@/components/JoinForm';
import { PageMedia } from '@/components/PageMedia';

export const metadata: Metadata = {
  title: 'Join the Cult',
  description:
    'Join The Giggling Cult as an audience member, comedian or comedy venue.',
};

export default function JoinPage() {
  return (
    <>
      <section className="page-head has-media">
        <PageMedia src="/img/crowd.jpg" priority />
        <div className="container">
          <span className="eyebrow enter" style={{ '--i': 0 } as React.CSSProperties}>
            Join the cult
          </span>
          <h1 className="enter" style={{ '--i': 1 } as React.CSSProperties}>
            There&apos;s a place for you here.
          </h1>
          <p className="enter" style={{ '--i': 2 } as React.CSSProperties}>
            Follow the scene as an audience member, get listed as a comedian,
            or put your comedy venue on the map.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Suspense>
            <JoinForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
