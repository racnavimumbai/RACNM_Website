import { MetadataRoute } from 'next';
import { getEvents, getInitiatives, getEditorials } from '@/lib/data/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://rotaractclubofnavimumbai.org';

  const [events, initiatives, editorials] = await Promise.all([
    getEvents(),
    getInitiatives(),
    getEditorials()
  ]);

  const eventUrls = events.map(e => ({
    url: `${baseUrl}/events/${e.slug}`,
    lastModified: new Date(e.created_at)
  }));

  const initiativeUrls = initiatives.map(i => ({
    url: `${baseUrl}/initiatives/${i.slug}`,
    lastModified: new Date(i.created_at)
  }));

  const editorialUrls = editorials.map(ed => ({
    url: `${baseUrl}/editorials/${ed.slug}`,
    lastModified: new Date(ed.published_at)
  }));

  const staticUrls = [
    '',
    '/about',
    '/initiatives',
    '/events',
    '/gallery',
    '/editorials',
    '/team',
    '/join'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date()
  }));

  return [...staticUrls, ...eventUrls, ...initiativeUrls, ...editorialUrls];
}
