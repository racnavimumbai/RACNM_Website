import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | 45 Years of Youth Leadership Legacy',
  description: 'Chartered in 1982 in Navi Mumbai, Rotaract Club of Navi Mumbai is the oldest community-based club in Zone 1, District 3142. Learn about our 45-year journey and Four-Way Test.',
  openGraph: {
    title: 'About Us | Rotaract Club of Navi Mumbai',
    description: '45 Years of leadership, fellowship, and service in Navi Mumbai (Est. 1982).',
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
