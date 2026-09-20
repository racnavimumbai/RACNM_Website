import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Us | Become a Member',
  description: 'Become a part of Navi Mumbai’s premier youth leadership movement. Join the Rotaract Club of Navi Mumbai and lead community change.',
  openGraph: {
    title: 'Join Rotaract Club of Navi Mumbai',
    description: 'Apply for membership in RACNM and grow your leadership, professional skills, and community impact.',
  }
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
