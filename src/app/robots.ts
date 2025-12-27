import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    // Update this to your production domain
    const baseUrl = 'https://aetherdocs-mu.vercel.app';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/profile', '/settings'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
