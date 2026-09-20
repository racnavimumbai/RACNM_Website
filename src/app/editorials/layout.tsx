import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editorials & Bulletins',
  description: 'Read the official newsletters, magazines, bulletins, and thought pieces published by the Rotaract Club of Navi Mumbai.',
  openGraph: {
    title: 'Editorials & Bulletins | Rotaract Club of Navi Mumbai',
    description: 'Official bulletins and literary publications of Rotaract Club of Navi Mumbai.',
  }
};

export default function EditorialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
