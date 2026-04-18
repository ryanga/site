import { parseStringPromise } from 'xml2js';

/**
 * @returns {Promise<Array<{title: string, author: string, imageUrl: string|null, url: string}>>}
 */
export async function fetchGoodreads() {
  const response = await fetch(
    'https://www.goodreads.com/review/list_rss/6224631?shelf=currently-reading'
  );
  if (!response.ok) throw new Error(`Goodreads RSS error: ${response.status}`);
  const xml = await response.text();
  const result = await parseStringPromise(xml, { explicitArray: true });
  const items = result?.rss?.channel?.[0]?.item ?? [];
  return items.map((item) => {
    const imageUrl = item['book_image_url']?.[0];
    return {
      title: item.title?.[0] ?? '',
      author: item['author_name']?.[0] ?? '',
      imageUrl: imageUrl || null,
      url: item.link?.[0] ?? ''
    };
  });
}
