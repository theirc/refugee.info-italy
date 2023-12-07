// @return The site's effective URL, e.g., https://unitedforukraine.org
//
// This function is copy-pasted from /lib/url.ts, because I couldn't figure out
// how to import functions into this config.
function getSiteUrl() {
  // If SITE_URL is present, use that. Otherwise use the Vercel deployment's
  // dynamic URL for preview and dev deployments.
  return process.env.SITE_URL ?? 'https://' + process.env.VERCEL_URL;
}

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: getSiteUrl(),
  generateRobotsTxt: true,
  exclude: [
    '/*/articles/*',
    '/*/services/*',
    '/*/categories/*',
    '/*/sections/*',
    '/server-sitemap.xml',
  ],
  robotsTxtOptions: {
    additionalSitemaps: [getSiteUrl() + '/server-sitemap.xml'],
  },
  // Don't generate an index sitemap, because the site is small (<5000 resources).
  generateIndexSitemap: false,
};

export default config;
