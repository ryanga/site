import { parseStringPromise } from 'xml2js';

/**
 * @returns {Promise<Array<{title: string, url: string, tags: string, date: string}>>}
 */
export async function fetchPinboard() {
  const response = await fetch('https://feeds.pinboard.in/rss/u:ryanga/');
  if (!response.ok) throw new Error(`Pinboard RSS error: ${response.status}`);
  const xml = await response.text();
  const result = await parseStringPromise(xml, { explicitArray: true });
  const root = result['rdf:RDF'] ?? result['RDF'] ?? {};
  const items = root['item'] ?? [];
  return items.slice(0, 10).map((item) => ({
    title: item['title']?.[0] ?? '',
    url: item['link']?.[0] ?? '',
    tags: item['dc:subject']?.[0] ?? '',
    date: item['dc:date']?.[0] ?? ''
  }));
}
