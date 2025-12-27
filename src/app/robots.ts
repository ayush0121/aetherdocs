import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    // Update this to your production domain
    const baseUrl = 'https://ayush0121-aetherdocs-vph9-d2du8g266-ayush0121s-projects.vercel.app';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/profile', '/settings'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
