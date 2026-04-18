import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true
    }),
    prerender: {
      handleHttpError: ({ path, message }) => {
        // Ignore missing placeholder assets that will be added later
        if (path === '/photo.jpg') return;
        throw new Error(message);
      }
    }
  }
};
