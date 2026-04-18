import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGoodreads } from './goodreads.js';

const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Currently Reading</title>
    <item>
      <title><![CDATA[The Name of the Wind]]></title>
      <link>https://www.goodreads.com/book/show/186074</link>
      <author_name><![CDATA[Patrick Rothfuss]]></author_name>
      <book_image_url><![CDATA[https://images.goodreads.com/cover.jpg]]></book_image_url>
    </item>
    <item>
      <title><![CDATA[Dune]]></title>
      <link>https://www.goodreads.com/book/show/44767458</link>
      <author_name><![CDATA[Frank Herbert]]></author_name>
      <book_image_url></book_image_url>
    </item>
  </channel>
</rss>`;

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

describe('fetchGoodreads', () => {
  it('returns mapped book objects from RSS', async () => {
    fetch.mockResolvedValue({ ok: true, text: async () => mockXml });

    const result = await fetchGoodreads();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      title: 'The Name of the Wind',
      author: 'Patrick Rothfuss',
      imageUrl: 'https://images.goodreads.com/cover.jpg',
      url: 'https://www.goodreads.com/book/show/186074'
    });
    expect(result[1].imageUrl).toBeNull();
  });

  it('throws on non-ok response', async () => {
    fetch.mockResolvedValue({ ok: false, status: 404 });
    await expect(fetchGoodreads()).rejects.toThrow('Goodreads RSS error: 404');
  });

  it('returns empty array when no items in feed', async () => {
    const emptyXml = `<?xml version="1.0"?><rss version="2.0"><channel><title>x</title></channel></rss>`;
    fetch.mockResolvedValue({ ok: true, text: async () => emptyXml });
    const result = await fetchGoodreads();
    expect(result).toEqual([]);
  });
});
