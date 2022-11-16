// Utility menu overlay functions
import type {
  MenuOverlayItem,
  MenuOverlayStrings,
} from '@ircsignpost/signpost-base/dist/src/menu-overlay';
import {
  CategoryWithSections,
  ZendeskCategory,
} from '@ircsignpost/signpost-base/dist/src/zendesk';

import {
  ABOUT_US_ARTICLE_ID,
  USE_CAT_SEC_ART_CONTENT_STRUCTURE,
} from './constants';

export interface CustomMenuOverlayStrings extends MenuOverlayStrings {
  information: string;
  about: string;
}

// TODO Update menu items if needed.
export function getMenuItems(
  strings: CustomMenuOverlayStrings,
  categories: ZendeskCategory[] | CategoryWithSections[]
): MenuOverlayItem[] {
  let items: MenuOverlayItem[] = [];
  items.push({ key: 'home', label: strings.home, href: '/' });
  if (USE_CAT_SEC_ART_CONTENT_STRUCTURE) {
    addMenuItemsCategories(items, categories as CategoryWithSections[]);
  } else {
    addMenuItemsInformation(items, strings, categories as ZendeskCategory[]);
  }
  items.push({
    key: 'about',
    label: strings.about,
    href: `/articles/${ABOUT_US_ARTICLE_ID}`,
  });
  return items;
}

function addMenuItemsCategories(
  items: MenuOverlayItem[],
  categories: CategoryWithSections[]
) {
  for (const { category, sections } of categories) {
    items.push({
      key: category.id.toString(),
      label: category.name,
      children: sections.map((section) => {
        return {
          key: section.id.toString(),
          label: section.name,
          href: '/sections/' + section.id.toString(),
        };
      }),
    });
  }
}

function addMenuItemsInformation(
  items: MenuOverlayItem[],
  strings: CustomMenuOverlayStrings,
  categories: ZendeskCategory[]
) {
  if (categories.length > 0) {
    items.push({
      key: 'information',
      label: strings.information,
      children: categories.map((category) => {
        return {
          key: category.id.toString(),
          label: category.name,
          href: '/categories/' + category.id.toString(),
        };
      }),
    });
  }
}
