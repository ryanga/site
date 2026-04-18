/**
 * @returns {Promise<Array<{name: string, description: string|null, language: string|null, stars: number, url: string}>>}
 */
export async function fetchGithub() {
  const response = await fetch(
    'https://api.github.com/users/ryanga/repos?sort=pushed&per_page=6',
    { headers: { 'User-Agent': 'galgon.com personal site' } }
  );
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
  const repos = await response.json();
  return repos.map((repo) => ({
    name: repo.name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    url: repo.html_url
  }));
}
