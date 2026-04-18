import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGithub } from './github.js';

const mockRepos = [
  {
    name: 'my-project',
    description: 'A cool project',
    language: 'JavaScript',
    stargazers_count: 5,
    html_url: 'https://github.com/ryanga/my-project'
  },
  {
    name: 'another-repo',
    description: null,
    language: 'Python',
    stargazers_count: 0,
    html_url: 'https://github.com/ryanga/another-repo'
  }
];

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

describe('fetchGithub', () => {
  it('returns mapped repo objects on success', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockRepos
    });

    const result = await fetchGithub();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      name: 'my-project',
      description: 'A cool project',
      language: 'JavaScript',
      stars: 5,
      url: 'https://github.com/ryanga/my-project'
    });
    expect(result[1].description).toBeNull();
  });

  it('throws on non-ok response', async () => {
    fetch.mockResolvedValue({ ok: false, status: 403 });
    await expect(fetchGithub()).rejects.toThrow('GitHub API error: 403');
  });

  it('calls the correct GitHub API endpoint', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] });
    await fetchGithub();
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/users/ryanga/repos?sort=pushed&per_page=6',
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });
});
