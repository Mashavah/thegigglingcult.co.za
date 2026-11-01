import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Giggling Cult',
    short_name: 'Giggling Cult',
    description: "SA's home of stand-up comedy.",
    start_url: '/',
    display: 'standalone',
    background_color: '#111111',
    theme_color: '#111111',
    icons: [
      { src: '/brand/tgc-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/brand/tgc-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/brand/tgc-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
