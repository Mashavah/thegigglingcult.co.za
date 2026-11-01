import type { Metadata } from 'next';
import { NewsList } from '@/components/NewsList';
import { PageMedia } from '@/components/PageMedia';

export const metadata: Metadata = {
  title: 'News',
  description: 'News, stories, interviews and updates from South African stand-up comedy.',
};

export default function NewsPage() {
  return (
    <>
      <section className="page-head has-media">
        <PageMedia src="/img/festival.jpg" priority />
        <div className="container">
          <span className="eyebrow enter" style={{ '--i': 0 } as React.CSSProperties}>In the know</span>
          <h1 className="enter" style={{ '--i': 1 } as React.CSSProperties}>News</h1>
          <p className="enter" style={{ '--i': 2 } as React.CSSProperties}>Stories, spotlights and everything happening in South African comedy.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container"><NewsList /></div>
      </section>
    </>
  );
}
