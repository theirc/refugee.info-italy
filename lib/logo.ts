import type { LogoProps } from '@ircsignpost/signpost-base/dist/src/header';
import type { Locale } from '@ircsignpost/signpost-base/dist/src/locale';

import logoEnUs from '../public/logo-en-us.png';
import logoFa from '../public/logo-fa.png';
import logoFr from '../public/logo-fr.png';

export const getHeaderLogoProps = (currentLocale: Locale): LogoProps => {
  let imgSrc: string = logoEnUs.src;

  switch (currentLocale.url) {
    case 'fa':
      imgSrc = logoFa.src;
      break;
    case 'fr':
      imgSrc = logoFr.src;
      break;
    case 'en-us':
    default:
      imgSrc = logoEnUs.src;
      break;
  }

  return {
    src: imgSrc,
  };
};
