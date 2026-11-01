import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ComediansGrid } from '@/components/ComediansGrid';
import { PageMedia } from '@/components/PageMedia';

export const metadata: Metadata = {
  title: 'Comedians',
  description: 'Browse South African stand-up comedians alphabetically by first name or stage name.',
};

export default function ComediansPage() {
  return (
    <>
      <section className="page-head has-media">
        <PageMedia src="/img/greenroom.jpg" priority />
        <div className="container">
          <span className="eyebrow enter" style={{ '--i': 0 } as React.CSSProperties}>Meet the cult</span>
          <h1 className="enter" style={{ '--i': 1 } as React.CSSProperties}>Comedians</h1>
          <p className="enter" style={{ '--i': 2 } as React.CSSProperties}>Browse the directory alphabetically by first name or stage name. Comedians tour, so province labels are intentionally left off cards at launch.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Suspense><ComediansGrid /></Suspense>
        </div>
      </section>
    </>
  );
}
