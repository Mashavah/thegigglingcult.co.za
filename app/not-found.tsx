import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="page-head">
      <div className="container">
        <Image className="brand-tile" src="/brand/tgc-tile-maroon.png" alt="" width={96} height={96} style={{ marginBottom: 20 }} />
        <span className="eyebrow">404</span>
        <h1>Nobody&apos;s on this stage.</h1>
        <p>That page doesn&apos;t exist. The calendar does.</p>
        <div style={{ marginTop: 28 }}><Link className="btn btn-primary" href="/events">Back to the shows</Link></div>
      </div>
    </section>
  );
}
