import { getAllPublicPaths, getRouteSEO } from '../shared/seoMeta';

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function resolveRequestOrigin(
  protocol: string,
  host: string | undefined
): string {
  const configured = process.env.APP_URL?.trim();
  if (configured && configured !== 'MY_APP_URL' && /^https?:\/\//i.test(configured)) {
    return configured.replace(/\/+$/, '');
  }
  if (host) {
    return `${protocol}://${host}`;
  }
  return 'http://localhost:3000';
}

export function injectRouteSEOIntoHtml(
  templateHtml: string,
  pathname: string,
  origin: string
): { html: string; status: 200 | 404; robots: string } {
  const seo = getRouteSEO(pathname, origin);

  let html = templateHtml;

  // Replace default title, description, robots, and OG/Twitter tags cleanly
  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtmlAttr(seo.title)}</title>`
  );
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/i,
    `<meta name="description" content="${escapeHtmlAttr(seo.description)}" />`
  );
  html = html.replace(
    /<meta\s+name="robots"[\s\S]*?\/>/i,
    `<meta name="robots" content="${escapeHtmlAttr(seo.robots)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:type"[\s\S]*?\/>/i,
    `<meta property="og:type" content="${escapeHtmlAttr(seo.ogType)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"[\s\S]*?\/>/i,
    `<meta property="og:title" content="${escapeHtmlAttr(seo.title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/i,
    `<meta property="og:description" content="${escapeHtmlAttr(seo.description)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"[\s\S]*?\/>/i,
    `<meta name="twitter:title" content="${escapeHtmlAttr(seo.title)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"[\s\S]*?\/>/i,
    `<meta name="twitter:description" content="${escapeHtmlAttr(seo.description)}" />`
  );

  const jsonLdScripts = seo.jsonLd
    .map(
      (schema) =>
        `<script type="application/ld+json">${safeJsonLdStringify(schema)}</script>`
    )
    .join('\n    ');

  const headExtra = `<link rel="canonical" href="${escapeHtmlAttr(seo.canonicalUrl)}" />
    <meta property="og:url" content="${escapeHtmlAttr(seo.canonicalUrl)}" />
    ${jsonLdScripts}`;

  html = html.replace('<!--SSR_HEAD_PLACEHOLDER-->', headExtra);

  // Provide semantic indexable content inside <noscript> for non-JS crawlers
  const noscriptBlock = `<noscript><main><h1>${escapeHtmlAttr(seo.ssrHeading)}</h1><p>${escapeHtmlAttr(seo.ssrSummary)}</p></main></noscript>`;
  html = html.replace('<!--SSR_SEO_CONTENT-->', noscriptBlock);

  return { html, status: seo.status, robots: seo.robots };
}

export function buildSitemapXml(origin: string): string {
  const cleanOrigin = origin.replace(/\/+$/, '');
  const paths = getAllPublicPaths();
  const today = new Date().toISOString().split('T')[0];

  const urls = paths
    .map((path) => {
      const loc = `${cleanOrigin}${path === '/' ? '/' : path}`;
      const priority =
        path === '/'
          ? '1.0'
          : path.startsWith('/blog/')
          ? '0.8'
          : path.startsWith('/cv-review/') || path.includes('checker') || path.includes('review')
          ? '0.9'
          : '0.6';
      const changefreq = path === '/' || path === '/blog' ? 'weekly' : 'monthly';
      return `  <url>
    <loc>${escapeHtmlAttr(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function buildRobotsTxt(origin: string): string {
  const cleanOrigin = origin.replace(/\/+$/, '');
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /results
Disallow: /analysis

Sitemap: ${cleanOrigin}/sitemap.xml
`;
}
