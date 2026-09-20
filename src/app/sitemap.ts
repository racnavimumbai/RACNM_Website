import { MetadataRoute } from 'next';
import { getEvents, getInitiatives, getEditorials } from '@/lib/data/api';
import { siteConfig } from '@/lib/siteConfig';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://rotaractclubofnavimumbai.org';

  const [events, initiatives, editorials] = await Promise.all([
    getEvents(),
    getInitiatives(),
    getEditorials()
  ]);

  const safeDate = (dateStr?: string | null): Date => {
    if (!dateStr) return new Date();
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const publishedEvents = events.filter(e => e.status === 'published');
  const publishedEditorials = editorials.filter(ed => ed.status === 'published');

  const eventUrls = publishedEvents.map(e => ({
    url: `${baseUrl}/events/${e.slug}`,
    lastModified: safeDate(e.created_at)
  }));

  const initiativeUrls = initiatives.map(i => ({
    url: `${baseUrl}/initiatives/${i.slug}`,
    lastModified: safeDate(i.created_at)
  }));

  const editorialUrls = publishedEditorials.map(ed => ({
    url: `${baseUrl}/editorials/${ed.slug}`,
    lastModified: safeDate(ed.published_at)
  }));

  const staticRoutes = [
    '',
    '/about',
    '/initiatives',
    '/events',
    '/gallery',
    '/editorials',
    '/team',
    '/join'
  ].filter(route => !(siteConfig.hideAboutUs && route === '/about'));

  const staticUrls = staticRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date()
  }));

  return [...staticUrls, ...eventUrls, ...initiativeUrls, ...editorialUrls];
}
