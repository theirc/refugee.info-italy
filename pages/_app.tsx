import 'antd/dist/antd.less';
import '../styles/globals.css';
import "mapbox-gl/dist/mapbox-gl.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@ircsignpost/signpost-base/styles/topic-with-articles.less';
import '@ircsignpost/signpost-base/styles/footer-page.less';
import '@ircsignpost/signpost-base/styles/header.less';
import '@ircsignpost/signpost-base/styles/header-banner.less';
import '@ircsignpost/signpost-base/styles/layout.less';
import '@ircsignpost/signpost-base/styles/home-page.less';
import '@ircsignpost/signpost-base/styles/home-page-card.less';
import '@ircsignpost/signpost-base/styles/home-page-cards-list.less';
import '@ircsignpost/signpost-base/styles/locale-select-page.less';
import '@ircsignpost/signpost-base/styles/preview-banner.less';
import '@ircsignpost/signpost-base/styles/responsive.less';
import '@ircsignpost/signpost-base/styles/search-bar.less';
import '@ircsignpost/signpost-base/styles/search-results-page.less';
import '@ircsignpost/signpost-base/styles/select-menu.less';
import '@ircsignpost/signpost-base/styles/service-map.less';
import '@ircsignpost/signpost-base/styles/map.less';
import '@ircsignpost/signpost-base/styles/service-list.less';
import '@ircsignpost/signpost-base/styles/cookie-banner.less';
import '@ircsignpost/signpost-base/styles/article-content.less';
import '@ircsignpost/signpost-base/styles/share-button.less';
import Analytics from '@ircsignpost/signpost-base/dist/src/analytics';
import { GOOGLE_ANALYTICS_IDS } from '../lib/constants';

import type { AppProps } from 'next/app';
import { BreadcrumbsProvider } from '../context/BreadcrumbsContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BreadcrumbsProvider>
      <Analytics googleAnalyticsIds={GOOGLE_ANALYTICS_IDS}/>
      <Component {...pageProps} />
    </BreadcrumbsProvider>
  );
}

export default MyApp;
