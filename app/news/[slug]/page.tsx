import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NewsCard } from '@/components/Cards';
import { Icon } from '@/components/Icons';
import { NEWS } from '@/lib/data';
import { fmt } from '@/lib/dates';
import { imageForCategory } from '@/lib/imagery';
import { article } from '@/lib/queries';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = article((await params).slug);
  return n ? { title: n.title, description: n.excerpt } : {};
}

// Demo dates are relative to today, so render on demand rather than at build time.
export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: Props) {
  const n = article((await params).slug);
  if (!n) notFound();
  const more = NEWS.filter((x) => x !== n).slice(0, 3);
  const s = (i: number) => ({ '--i': i } as React.CSSProperties);

  return (
    <>
      <section className="section">
        <div className="container article">
          <Link className="btn btn-soft btn-sm enter" style={s(0)} href="/news"><Icon.left /> All news</Link>
          <div className="nc-meta enter" style={{ ...s(1), display: 'flex', gap: 10, alignItems: 'center', marginTop: 28, color: 'var(--text-3)' }}>
            <span className="tag tag-accent">{n.category}</span><span>{fmt.long(n.date)}</span><span>·</span><span>{n.readTime} min read</span>
          </div>
          <h1 className="enter" style={s(2)}>{n.title}</h1>
          <div className="article-media enter" style={s(3)}><Image src={imageForCategory(n.category)} alt="" fill priority sizes="(max-width: 800px) 100vw, 760px" /></div>
          <p className="body enter" style={{ ...s(3), fontSize: 20, color: 'var(--text)' }}>{n.excerpt}</p>
          <p className="body enter" style={s(4)}>{n.body}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head"><div><span className="eyebrow">Still here?</span><h2>Keep reading, then</h2></div></div>
          <div className="grid grid-3">{more.map((x, i) => <NewsCard key={x.slug} n={x} i={i} />)}</div>
        </div>
      </section>
    </>
  );
}
