import * as cheerio from 'cheerio';

/**
 * Best-effort scrape of public Vivino profile.
 * Returns null on any failure — never throws.
 * @returns {Promise<Array<{name: string, rating: number|null}> | null>}
 */
export async function fetchVivino() {
  try {
    const response = await fetch('https://www.vivino.com/users/ryan-galgon', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!response.ok) return null;

    const html = await response.text();
    const $ = cheerio.load(html);

    const wines = [];

    // Try multiple selector strategies to find wine elements
    // Strategy 1: Look for activity/review items
    $('[class*="activity"], [class*="review"], [class*="wine-card"], [class*="wineCard"]').each((_, el) => {
      const nameEl = $(el).find('[class*="wine-name"], [class*="label"], [class*="name"], h3, h4').first();
      const ratingEl = $(el).find('[class*="rating"], [class*="score"], [class*="stars"]').first();

      const name = nameEl.text().trim();
      const ratingText = ratingEl.text().trim().replace(/[^\d.]/g, '');
      const rating = ratingText ? parseFloat(ratingText) : null;

      if (name && name.length > 2) {
        wines.push({ name, rating: rating && !isNaN(rating) ? rating : null });
      }
    });

    // Strategy 2: Look for any links to wine pages with text content
    $('a[href*="/wines/"]').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 2) {
        // Check if we already have this wine to avoid duplicates
        if (!wines.some(w => w.name.toLowerCase() === text.toLowerCase())) {
          wines.push({ name: text, rating: null });
        }
      }
    });

    // Return null if no wines found, otherwise return first 10
    return wines.length > 0 ? wines.slice(0, 10) : null;
  } catch {
    return null;
  }
}
