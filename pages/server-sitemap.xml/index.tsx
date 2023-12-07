// pages/server-sitemap.xml/index.tsx
import generateSitemap from '@ircsignpost/signpost-base/dist/src/server-sitemap';
import type { GetServerSidePropsContext, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { getSiteUrl } from '../../lib/url';
import * as article from '../articles/[article]';
import * as category from '../categories/[category]';
import * as section from '../sections/[section]';
import * as service from '../services/[service]';

export async function getServerSideProps(
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) {
  const allPaths: string[] = await Promise.all([
    /* Put dynamic paths here and exclude them from next-sitemap.config.mjs */
    article.getStringPaths(),
    service.getStringPaths(),
    category.getStringPaths(),
    section.getStringPaths(),
  ]).then((results: string[][]) => results.flat());

  return generateSitemap(ctx, getSiteUrl(), allPaths);
}

// Default export to prevent next.js errors
export default function Sitemap() {}
