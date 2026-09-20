import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getInitiativeBySlug, getEvents } from '@/lib/data/api';
import InitiativeDetailClient from './InitiativeDetailClient';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const initiative = await getInitiativeBySlug(slug);
  if (!initiative) return { title: 'Initiative Not Found' };

  return {
    title: `${initiative.title} | RCNM Thrust Areas`,
    description: initiative.summary,
    openGraph: {
      title: `${initiative.title} | Rotaract Club of Navi Mumbai`,
      description: initiative.summary,
      images: initiative.cover_image ? [{ url: initiative.cover_image, alt: initiative.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: initiative.title,
      description: initiative.summary,
      images: initiative.cover_image ? [initiative.cover_image] : undefined,
    }
  };
}

export default async function InitiativeDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [initiative, allEvents] = await Promise.all([
    getInitiativeBySlug(slug),
    getEvents()
  ]);

  if (!initiative) {
    notFound();
  }

  const connectedEvents = allEvents.filter(
    e => e.initiative_id === initiative.id || e.summary.toLowerCase().includes(initiative.title.toLowerCase().slice(0, 5))
  );

  return <InitiativeDetailClient initiative={initiative} connectedEvents={connectedEvents} />;
}
