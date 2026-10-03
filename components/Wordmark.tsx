'use client';

import Image from 'next/image';

/* Uses the approved wordmark styling from the supplied brand reference. */
export function Wordmark() {
  return (
    <div className="footer-wordmark footer-wordmark-image" aria-hidden="true">
      <Image
        src="/brand/tgc-wordmark-text.png"
        alt=""
        width={795}
        height={360}
        sizes="(max-width: 700px) 92vw, 1200px"
      />
    </div>
  );
}
