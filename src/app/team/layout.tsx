import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leadership & Board of Directors',
  description: 'Meet the Executive Board and Directors steering the 45th Year of Rotaract Club of Navi Mumbai under the theme MAGNUM OPUS.',
  openGraph: {
    title: 'Leadership & Board | Rotaract Club of Navi Mumbai',
    description: 'Meet the 45th Board of Directors of Rotaract Club of Navi Mumbai.',
  }
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
