export function JsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'AetherDocs',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: 'Secure, client-side PDF manipulation tools. Merge, split, sign, and edit documents with privacy-first standards.',
        featureList: 'Merge PDF, Split PDF, Compress PDF, Convert PDF, Chat with PDF',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        softwareVersion: '1.0.0',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
