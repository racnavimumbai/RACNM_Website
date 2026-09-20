import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events & Living Stories',
  description: 'Explore events, impactful projects, and memorable stories organized by the Rotaract Club of Navi Mumbai across District 3142.',
  openGraph: {
    title: 'Events & Living Stories | Rotaract Club of Navi Mumbai',
    description: 'Explore civic projects, blood drives, youth conclaves, and community events in Navi Mumbai.',
  }
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
