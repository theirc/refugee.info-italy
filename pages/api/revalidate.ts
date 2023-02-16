import {
  ZendeskArticleTranslation,
  getArticleTranslations,
  getLastArticlesEdited,
} from '@ircsignpost/signpost-base/dist/src/zendesk';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ZENDESK_AUTH_HEADER } from '../../lib/constants';
import { LOCALES } from '../../lib/locale';
import { getZendeskUrl } from '../../lib/url';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    let time = new Date();
    time.setHours(time.getHours() - 2);
    time.setSeconds(0, 0);
    const unixTime = Math.floor(time.getTime() - 1000)
      .toString()
      .slice(0, -3);

    const articles = await getLastArticlesEdited(
      getZendeskUrl(),
      unixTime,
      ZENDESK_AUTH_HEADER
    );

    if (!articles.length) {
      return res.status(200).json('nothing to revalidate');
    }

    const result = await Promise.allSettled(
      articles.map(async (article) => {
        for (let lang in LOCALES) {
          const pathToRevalidate = `/${LOCALES[lang].url}/articles/${article.id}`;
          await res.revalidate(pathToRevalidate);
        }
      })
    );

    return res.status(200).json({
      revalidated: true,
      articles,
      time,
      status: handleResults(result),
    });
  } catch (err) {
    return res.status(500).send('Error revalidating ' + err);
  }
}

const isFulfilled = <T>(
  p: PromiseSettledResult<T>
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';
const isRejected = <T>(
  p: PromiseSettledResult<T>
): p is PromiseRejectedResult => p.status === 'rejected';

function handleResults(results: PromiseSettledResult<void>[]) {
  const errors = results.filter(isRejected);
  const success = results.filter(isFulfilled);
  return { errors, success };
}
