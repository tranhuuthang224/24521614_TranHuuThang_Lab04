/**
 * Photo dataset for Homework 1: Production Multi-Route Photo & Evidence Gallery SPA.
 * Supports deep linking, filtering, and native HTML5 <dialog> modal lightbox.
 */

export const PHOTOS = [
  {
    id: 'photo-1',
    title: 'James Webb Space Telescope Deep Field',
    category: 'astronomy',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&auto=format&fit=crop&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1600&auto=format&fit=crop&q=90',
    caption: 'Gravitational lensing reveals distant galaxies formed over 13 billion years ago in the early universe.',
    camera: 'NIRCam / MIRI',
    date: '2024-07-12',
    aspectRatio: '16/9',
  },
  {
    id: 'photo-2',
    title: 'Andromeda Galaxy (M31) High Resolution Core',
    category: 'astronomy',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=90',
    caption: 'Spiral arms of the Andromeda galaxy captured across 2.5 million light-years in the northern sky.',
    camera: 'Astrophotography Rig 200mm',
    date: '2024-09-20',
    aspectRatio: '16/9',
  },
  {
    id: 'photo-3',
    title: 'UIT Smart Software System Team (S3T) Laboratory',
    category: 'pioneers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&auto=format&fit=crop&q=90',
    caption: 'Software engineering research environment at UIT focusing on React architecture and resilient full-stack systems.',
    camera: 'Laboratory Instrumentation Rig',
    date: '2024-10-15',
    aspectRatio: '16/9',
  },
  {
    id: 'photo-4',
    title: 'Theoretical Physics Archives & Einstein Heritage',
    category: 'pioneers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=90',
    caption: 'Historical manuscript archives tracing the derivation of general relativity and quantum optics.',
    camera: 'Archival Medium Format',
    date: '2024-11-01',
    aspectRatio: '16/9',
  },
  {
    id: 'photo-5',
    title: 'PUBG Vietnam Championship Competitive Arena',
    category: 'esports',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=90',
    caption: 'Main tournament stage where match telemetries and combat replay logs are monitored in real time.',
    camera: 'Arena Broadcast Cam 4K',
    date: '2024-08-25',
    aspectRatio: '16/9',
  },
  {
    id: 'photo-6',
    title: 'Himass & TanVuu Fair-Play Appeal Evidence Log',
    category: 'esports',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1600&auto=format&fit=crop&q=90',
    caption: 'Packet integrity trace and server-side tick rate recordings submitted for tribunal review.',
    camera: 'Network Packet Sniffer',
    date: '2024-11-10',
    aspectRatio: '16/9',
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'All Evidence' },
  { id: 'astronomy', label: 'Astronomy & Space' },
  { id: 'pioneers', label: 'Pioneers & Labs' },
  { id: 'esports', label: 'Esports & Tribunal' },
];

export default PHOTOS;
