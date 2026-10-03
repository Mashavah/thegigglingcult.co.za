import Image from 'next/image';

/* Full-bleed photograph behind a page header or band */
export function PageMedia({ src, priority = false }: { src: string; priority?: boolean }) {
  return (
    <div className="page-media" aria-hidden="true">
      <Image src={src} alt="" fill sizes="100vw" priority={priority} />
    </div>
  );
}
