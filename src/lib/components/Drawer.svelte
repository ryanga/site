<script>
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();

  /** @type {boolean} */
  export let open = false;

  /** @type {string | null} */
  export let service = null;

  /** @type {any} Feed data for the active service */
  export let feed = null;

  function close() {
    dispatch('close');
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') close();
  }

  let touchStartY = 0;

  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    const delta = e.changedTouches[0].clientY - touchStartY;
    if (delta > 60) close();
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

{#if open}
  <div class="backdrop" on:click={close} aria-hidden="true" />

  <div
    class="drawer"
    role="dialog"
    aria-modal="true"
    on:touchstart={handleTouchStart}
    on:touchend={handleTouchEnd}
  >
    <div class="drawer-header">
      <span class="drawer-title">{service ?? ''}</span>
      <button class="close-btn" on:click={close} aria-label="Close">✕</button>
    </div>

    <div class="drawer-body">
      {#if service === 'github'}
        {#if feed && feed.length > 0}
          <ul class="feed-list">
            {#each feed as repo}
              <li class="feed-item">
                <a href={repo.url} target="_blank" rel="noopener noreferrer" class="repo-link">
                  <span class="repo-name">{repo.name}</span>
                  {#if repo.description}
                    <span class="repo-desc">{repo.description}</span>
                  {/if}
                  <span class="repo-meta">
                    {#if repo.language}<span class="repo-lang">{repo.language}</span>{/if}
                    {#if repo.stars > 0}<span class="repo-stars">★ {repo.stars}</span>{/if}
                  </span>
                </a>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="empty">No repositories found.</p>
        {/if}

      {:else if service === 'goodreads'}
        {#if feed && feed.length > 0}
          <ul class="feed-list">
            {#each feed as book}
              <li class="feed-item book-item">
                {#if book.imageUrl}
                  <img src={book.imageUrl} alt={book.title} class="book-cover" />
                {/if}
                <div class="book-info">
                  <a href={book.url} target="_blank" rel="noopener noreferrer" class="book-title">{book.title}</a>
                  <span class="book-author">{book.author}</span>
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="empty">Nothing on the currently-reading shelf.</p>
        {/if}

      {:else if service === 'pinboard'}
        {#if feed && feed.length > 0}
          <ul class="feed-list">
            {#each feed as bookmark}
              <li class="feed-item">
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" class="bookmark-link">
                  <span class="bookmark-title">{bookmark.title}</span>
                  {#if bookmark.tags}
                    <span class="bookmark-tags">{bookmark.tags}</span>
                  {/if}
                </a>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="empty">No bookmarks found.</p>
        {/if}

      {:else if service === 'vivino'}
        {#if feed && feed.length > 0}
          <ul class="feed-list">
            {#each feed as wine}
              <li class="feed-item">
                <span class="wine-name">{wine.name}</span>
                {#if wine.rating}
                  <span class="wine-rating">★ {wine.rating}</span>
                {/if}
              </li>
            {/each}
          </ul>
        {:else}
          <div class="cta">
            <a href="https://www.vivino.com/users/ryan-galgon" target="_blank" rel="noopener noreferrer" class="cta-link">
              Visit my Vivino profile →
            </a>
          </div>
        {/if}
      {/if}
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 10;
  }

  .drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 70vh;
    background: var(--bg);
    border-radius: 16px 16px 0 0;
    z-index: 11;
    display: flex;
    flex-direction: column;
    animation: slide-up 0.25s ease;
  }

  @keyframes slide-up {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 12px;
    border-bottom: 1px solid var(--surface);
  }

  .drawer-title {
    font-size: 16px;
    font-weight: 600;
    text-transform: capitalize;
    color: var(--text);
  }

  .close-btn {
    font-size: 16px;
    color: var(--subtext);
    padding: 4px 8px;
  }

  .close-btn:hover {
    color: var(--text);
  }

  .drawer-body {
    overflow-y: auto;
    padding: 16px 20px 32px;
    flex: 1;
  }

  .feed-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .feed-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .repo-link, .bookmark-link {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .repo-name, .bookmark-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
  }

  .repo-desc, .bookmark-tags {
    font-size: 12px;
    color: var(--subtext);
  }

  .repo-meta {
    display: flex;
    gap: 10px;
    font-size: 12px;
    color: var(--subtext);
    margin-top: 2px;
  }

  .book-item {
    flex-direction: row;
    align-items: flex-start;
    gap: 12px;
  }

  .book-cover {
    width: 44px;
    height: auto;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .book-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
    display: block;
  }

  .book-author {
    font-size: 12px;
    color: var(--subtext);
  }

  .wine-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
  }

  .wine-rating {
    font-size: 12px;
    color: var(--subtext);
  }

  .empty {
    font-size: 14px;
    color: var(--subtext);
  }

  .cta {
    display: flex;
    justify-content: center;
    padding: 16px 0;
  }

  .cta-link {
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
    border: 1px solid var(--surface-hover);
    padding: 10px 20px;
    border-radius: var(--radius);
  }

  .cta-link:hover {
    background: var(--surface);
  }
</style>
