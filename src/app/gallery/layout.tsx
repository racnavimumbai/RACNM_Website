import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photo Gallery & Visual Archive',
  description: 'A visual archive celebrating 45 years of Rotaract Club of Navi Mumbai: fellowship, community service drives, sports, and leadership conclaves.',
  openGraph: {
    title: 'Photo Gallery | Rotaract Club of Navi Mumbai',
    description: 'Visual archive and memories of RACNM events across Navi Mumbai.',
  }
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
