import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Initiatives & Core Pillars',
  description: 'Discover the core initiatives of Rotaract Club of Navi Mumbai: Community Service, Youth Development, Environmental Sustainability, and Vocational Excellence.',
  openGraph: {
    title: 'Initiatives | Rotaract Club of Navi Mumbai',
    description: 'Core initiatives driving lasting social change and leadership in Navi Mumbai.',
  }
};

export default function InitiativesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
