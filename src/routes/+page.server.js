import { fetchGithub } from '$lib/feeds/github.js';
import { fetchGoodreads } from '$lib/feeds/goodreads.js';
import { fetchPinboard } from '$lib/feeds/pinboard.js';
import { fetchVivino } from '$lib/feeds/vivino.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const [github, goodreads, pinboard, vivino] = await Promise.allSettled([
    fetchGithub(),
    fetchGoodreads(),
    fetchPinboard(),
    fetchVivino()
  ]);

  return {
    feeds: {
      github: github.status === 'fulfilled' ? github.value : [],
      goodreads: goodreads.status === 'fulfilled' ? goodreads.value : [],
      pinboard: pinboard.status === 'fulfilled' ? pinboard.value : [],
      vivino: vivino.status === 'fulfilled' ? vivino.value : null
    }
  };
}
