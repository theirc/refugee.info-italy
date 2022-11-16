import { AlgoliaSearchIndex } from '@ircsignpost/signpost-base/dist/src/search-common';
import { LatLngExpression } from 'leaflet';

export const SITE_TITLE = 'Refugee.info Italy';

export const COUNTRY_ID = 11;

export const MAP_DEFAULT_COORDS: LatLngExpression = [
  34.45830721078611, 65.09457416213823,
];

// Cache statically generated pages for 1 hour. The timeout was chosen
// arbitrarily. Our website has static, non-urgent resources, so we probably do
// not need to serve content faster.
export const REVALIDATION_TIMEOUT_SECONDS: number = 1 * 60 * 60;

// The "about us" article ID.
export const ABOUT_US_ARTICLE_ID: number = 5389267022103;

// The information hierary of the website.
// Set to true for the category -> section -> article hierarchy, similar to that of United for Ukraine.
// Set to false for the "information" -> category -> article hierarchy, similar to that of Beporsed.
export const USE_CAT_SEC_ART_CONTENT_STRUCTURE = false;

// A mapping from category ID to a Material icon for that category.
export const CATEGORY_ICON_NAMES: { [key: string]: string } = {
  /* TODO */
  '123': 'home_work', // Placeholder
};

// A mapping from section ID to a Material icon for that section.
export const SECTION_ICON_NAMES: { [key: string]: string } = {
  /* TODO */
  '123': 'home_work', // Placeholder
};

// A list of category IDs that the site should not display.
export const CATEGORIES_TO_HIDE: number[] = [
  5388415886487, 5388365977367, 5388415940887, 4421271418775, 4420351027479,
];

// A map from a locale code to Zendesk locale id used for dynamic content translations.
// https://developer.zendesk.com/api-reference/ticketing/account-configuration/locales/
// Keep in sync with locales configured in /next.config.js.
export const DYNAMIC_CONTENT_LOCALES: { [key: string]: number } = {
  'en-us': 1, // English locale id
  ps: 1348, // Pashto locale id
  fa: 1016, // Persian locale id
  fr: 16, // French locale id
  uk: 1173, // Ukranian locale id
};

export const ZENDESK_AUTH_HEADER = {
  Authorization: 'Bearer ' + process.env.ZENDESK_OAUTH_TOKEN,
};

export const GOOGLE_ANALYTICS_IDS = [
  process.env.NEXT_PUBLIC_GA_ID ?? '',
  process.env.NEXT_PUBLIC_GA4_ID ?? '',
];

// Algolia search app ID, Search API key and search index name:
// https://www.algolia.com/account/api-keys/
export const ALGOLIA_SEARCH_APP_ID = 'BWATZIXLX6';
export const ALGOLIA_SEARCH_API_KEY = '0d9093280e7b2bc2b6ca12ed4180fd0a';

// TODO: create Algolia indexes for Articles and Queries and replace the names here.
// See README for more info on how to create indexes.
export const ALGOLIA_ARTICLE_INDEX_NAME = 'zendesk_signpost-italy_articles';
export const ALGOLIA_QUERY_INDEX_NAME =
  'zendesk_signpost-italy_articles_query_suggestions';

export const SEARCH_BAR_INDEX: AlgoliaSearchIndex = {
  appId: ALGOLIA_SEARCH_APP_ID,
  publicApiKey: ALGOLIA_SEARCH_API_KEY,
  indexName: ALGOLIA_QUERY_INDEX_NAME,
};

export const SEARCH_RESULTS_PAGE_INDEX: AlgoliaSearchIndex = {
  appId: ALGOLIA_SEARCH_APP_ID,
  publicApiKey: ALGOLIA_SEARCH_API_KEY,
  indexName: ALGOLIA_ARTICLE_INDEX_NAME,
};
