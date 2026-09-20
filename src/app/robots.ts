import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/studio/', '/admin', '/admin/', '/api/']
    },
    sitemap: 'https://rotaractnavimumbai.com/sitemap.xml'
  };
}
