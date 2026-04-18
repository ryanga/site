import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPinboard } from './pinboard.js';

const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns="http://purl.org/rss/1.0/"
         xmlns:dc="http://purl.org/dc/elements/1.1/">
  <item rdf:about="https://example.com/1">
    <title>Example Article</title>
    <link>https://example.com/1</link>
    <dc:subject>tech javascript</dc:subject>
    <dc:date>2024-01-15T10:00:00Z</dc:date>
  </item>
  <item rdf:about="https://example.com/2">
    <title>Another Link</title>
    <link>https://example.com/2</link>
    <dc:subject></dc:subject>
    <dc:date>2024-01-14T08:00:00Z</dc:date>
  </item>
</rdf:RDF>`;

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

describe('fetchPinboard', () => {
  it('returns mapped bookmark objects from RSS', async () => {
    fetch.mockResolvedValue({ ok: true, text: async () => mockXml });

    const result = await fetchPinboard();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      title: 'Example Article',
      url: 'https://example.com/1',
      tags: 'tech javascript',
      date: '2024-01-15T10:00:00Z'
    });
  });

  it('limits results to 10 items', async () => {
    const manyItems = Array.from({ length: 15 }, (_, i) => `
      <item rdf:about="https://example.com/${i}">
        <title>Item ${i}</title>
        <link>https://example.com/${i}</link>
        <dc:subject></dc:subject>
        <dc:date>2024-01-01T00:00:00Z</dc:date>
      </item>`).join('');
    const xml = `<?xml version="1.0"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/">${manyItems}</rdf:RDF>`;
    fetch.mockResolvedValue({ ok: true, text: async () => xml });
    const result = await fetchPinboard();
    expect(result).toHaveLength(10);
  });

  it('throws on non-ok response', async () => {
    fetch.mockResolvedValue({ ok: false, status: 500 });
    await expect(fetchPinboard()).rejects.toThrow('Pinboard RSS error: 500');
  });
});
