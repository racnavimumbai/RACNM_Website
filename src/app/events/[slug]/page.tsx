import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/data/api';
import EventDetailClient from './EventDetailClient';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: 'Event Not Found' };

  return {
    title: `${event.title} | RCNM Events`,
    description: event.summary,
    openGraph: {
      title: `${event.title} | Rotaract Club of Navi Mumbai`,
      description: event.summary,
      images: event.cover_image ? [{ url: event.cover_image, alt: event.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.summary,
      images: event.cover_image ? [event.cover_image] : undefined,
    }
  };
}

export default async function EventDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  // Schema.org Event structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.summary,
    startDate: event.event_date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Navi Mumbai',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN'
      }
    },
    image: [event.cover_image],
    organizer: {
      '@type': 'Organization',
      name: 'Rotaract Club of Navi Mumbai',
      url: 'https://rotaractnavimumbai.com'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventDetailClient event={event} />
    </>
  );
}
