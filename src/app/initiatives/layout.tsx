import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thrust Initiatives & Core Pillars',
  description: 'Discover the core thrust areas of Rotaract Club of Navi Mumbai: Community Service, Youth Development, Environmental Sustainability, and Vocational Excellence.',
  openGraph: {
    title: 'Thrust Initiatives | Rotaract Club of Navi Mumbai',
    description: 'Core focus areas driving lasting social change and leadership in Navi Mumbai.',
  }
};

export default function InitiativesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
