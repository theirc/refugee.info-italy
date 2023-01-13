import CategoryPage, {
  CategoryStrings,
  getSectionsForCategory,
} from '@ircsignpost/signpost-base/dist/src/category-page';
import CookieBanner from '@ircsignpost/signpost-base/dist/src/cookie-banner';
import { MenuOverlayItem } from '@ircsignpost/signpost-base/dist/src/menu-overlay';
import { MenuItem } from '@ircsignpost/signpost-base/dist/src/select-menu';
import { Section } from '@ircsignpost/signpost-base/dist/src/topic-with-articles';
import {
  getArticlesForSection,
  getCategories,
  getTranslationsFromDynamicContent,
} from '@ircsignpost/signpost-base/dist/src/zendesk';
import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';

import {
  CATEGORIES_TO_HIDE,
  CATEGORY_ICON_NAMES,
  GOOGLE_ANALYTICS_IDS,
  REVALIDATION_TIMEOUT_SECONDS,
  SEARCH_BAR_INDEX,
  SITE_TITLE,
  USE_CAT_SEC_ART_CONTENT_STRUCTURE,
  ZENDESK_AUTH_HEADER,
} from '../../lib/constants';
import {
  LOCALES,
  Locale,
  getLocaleFromCode,
  getZendeskLocaleId,
} from '../../lib/locale';
import { getHeaderLogoProps } from '../../lib/logo';
import { getMenuItems } from '../../lib/menu';
import {
  CATEGORY_PLACEHOLDERS,
  COMMON_DYNAMIC_CONTENT_PLACEHOLDERS,
  SECTION_PLACEHOLDERS,
  getLastUpdatedLabel,
  populateCategoryStrings,
  populateFilterSelectStrings,
  populateMenuOverlayStrings,
} from '../../lib/translations';
import { getZendeskUrl } from '../../lib/url';

interface CategoryProps {
  currentLocale: Locale;
  pageTitle: string;
  categoryId: number;
  categoryItems: MenuItem[];
  sections: Section[];
  // A list of |MenuOverlayItem|s to be displayed in the header and side menu.
  menuOverlayItems: MenuOverlayItem[];
  strings: CategoryStrings;
  selectFilterLabel: string;
  filterItems: MenuItem[];
}

export default function Category({
  currentLocale,
  pageTitle,
  categoryId,
  categoryItems,
  sections,
  menuOverlayItems,
  strings,
  selectFilterLabel,
  filterItems,
}: CategoryProps) {
  const [sectionDisplayed, setSectionDisplayed] = useState<Section[]>(sections);

  const handleFilterSectionChange = async (val: string) => {
    const dynamicContent = await getTranslationsFromDynamicContent(
      getZendeskLocaleId(currentLocale),
      COMMON_DYNAMIC_CONTENT_PLACEHOLDERS.concat(SECTION_PLACEHOLDERS),
      getZendeskUrl(),
      { Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_ZENDESK_OAUTH_TOKEN }
    );

    const sections = await Promise.all(
      sectionDisplayed.map(async (x) => {
        const articles = (
          await getArticlesForSection(currentLocale, x.id, getZendeskUrl(), val)
        ).map((article) => {
          return {
            id: article.id,
            title: article.title,
            lastEdit: {
              label: getLastUpdatedLabel(dynamicContent),
              value: article.updated_at,
              locale: currentLocale,
            },
          };
        });

        return { id: x.id, name: x.name, articles };
      })
    );

    setSectionDisplayed(sections);
  };

  useEffect(() => {
    setSectionDisplayed(sections);
  }, [sections]);

  return (
    <CategoryPage
      currentLocale={currentLocale}
      locales={LOCALES}
      pageTitle={pageTitle}
      categoryId={categoryId}
      categoryItems={categoryItems}
      sections={sectionDisplayed}
      menuOverlayItems={menuOverlayItems}
      headerLogoProps={getHeaderLogoProps(currentLocale)}
      searchBarIndex={SEARCH_BAR_INDEX}
      cookieBanner={
        <CookieBanner
          strings={strings.cookieBannerStrings}
          googleAnalyticsIds={GOOGLE_ANALYTICS_IDS}
        />
      }
      strings={strings}
      selectFilterLabel={selectFilterLabel}
      filterSelect={true}
      filterItems={filterItems}
      onSelectFilterChange={handleFilterSectionChange}
    />
  );
}

async function getStaticParams() {
  const categories = await Promise.all(
    Object.values(LOCALES).map(
      async (locale) => await getCategories(locale, getZendeskUrl())
    )
  );

  return categories.flat().map((category) => {
    return {
      category: category.id.toString(),
      locale: category.locale,
    };
  });
}

export async function getStaticPaths() {
  if (USE_CAT_SEC_ART_CONTENT_STRUCTURE) {
    // Category page does not exist in this type of content structure.
    // All paths under categories should return 404
    // (https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-false).
    return {
      paths: [],
      fallback: false,
    };
  }

  const categoryParams = await getStaticParams();

  return {
    paths: categoryParams.map(({ category, locale }) => {
      return {
        params: { category },
        locale,
      };
    }),
    fallback: 'blocking',
  };
}

function getStringPath(category: string, locale: string): string {
  return `/${locale}/categories/${category}`;
}

export async function getStringPaths(): Promise<string[]> {
  if (USE_CAT_SEC_ART_CONTENT_STRUCTURE) {
    // Category page does not exist in this type of content structure.
    return [];
  }
  const params = await getStaticParams();
  return params.map((param) => getStringPath(param.category, param.locale));
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  if (!locale) {
    throw new Error(
      `Failed to get static props for a category (id: ${params?.category}): missing locale.`
    );
  }

  const currentLocale = getLocaleFromCode(locale);
  const dynamicContent = await getTranslationsFromDynamicContent(
    getZendeskLocaleId(currentLocale),
    COMMON_DYNAMIC_CONTENT_PLACEHOLDERS.concat(CATEGORY_PLACEHOLDERS),
    getZendeskUrl(),
    ZENDESK_AUTH_HEADER
  );
  const strings: CategoryStrings = populateCategoryStrings(dynamicContent);

  const categories = (
    await getCategories(currentLocale, getZendeskUrl())
  ).filter((c) => !CATEGORIES_TO_HIDE.includes(c.id));

  const categoryItems = categories.map((category) => {
    return {
      name: category.name,
      value: category.id,
      iconName: CATEGORY_ICON_NAMES[category.id.toString()] || 'help_outline',
      link: '/categories/' + category.id.toString(),
    };
  });

  const menuOverlayItems = getMenuItems(
    populateMenuOverlayStrings(dynamicContent),
    categories
  );

  const sections = await getSectionsForCategory(
    currentLocale,
    Number(params?.category),
    getZendeskUrl(),
    getLastUpdatedLabel(dynamicContent)
  );

  const filterSelectStrings = populateFilterSelectStrings(dynamicContent);

  const filterItems: MenuItem[] = [
    { name: filterSelectStrings.mostRecent, value: 'updated_at' },
  ];

  return {
    props: {
      currentLocale,
      pageTitle: SITE_TITLE,
      categoryId: Number(params?.category),
      categoryItems,
      sections,
      menuOverlayItems,
      strings,
      selectFilterLabel: filterSelectStrings.filterLabel,
      filterItems,
    },
    revalidate: REVALIDATION_TIMEOUT_SECONDS,
  };
};
