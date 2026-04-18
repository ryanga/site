<script>
  import LinkCard from '$lib/components/LinkCard.svelte';
  import Drawer from '$lib/components/Drawer.svelte';

  let { data } = $props();

  let activeService = $state(null);

  function openDrawer(service) {
    activeService = service;
  }

  function closeDrawer() {
    activeService = null;
  }

  function getFeed(service) {
    if (!data?.feeds) return null;
    return data.feeds[service] ?? null;
  }
</script>

<main>
  <header>
    <img class="avatar" src="/photo.jpg" alt="Ryan Galgon" />
    <h1>Ryan Galgon</h1>
  </header>

  <div class="grid">
    <LinkCard label="GitHub" on:click={() => openDrawer('github')}>
      <svelte:fragment slot="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
      </svelte:fragment>
    </LinkCard>

    <LinkCard label="Goodreads" on:click={() => openDrawer('goodreads')}>
      <svelte:fragment slot="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      </svelte:fragment>
    </LinkCard>

    <LinkCard label="Pinboard" on:click={() => openDrawer('pinboard')}>
      <svelte:fragment slot="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      </svelte:fragment>
    </LinkCard>

    <LinkCard label="Vivino" on:click={() => openDrawer('vivino')}>
      <svelte:fragment slot="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>
      </svelte:fragment>
    </LinkCard>

    <LinkCard label="LinkedIn" href="https://www.linkedin.com/in/ryangalgon" external={true}>
      <svelte:fragment slot="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
      </svelte:fragment>
    </LinkCard>
  </div>
</main>

<Drawer
  open={activeService !== null}
  service={activeService}
  feed={activeService ? getFeed(activeService) : null}
  on:close={closeDrawer}
/>

<style>
  main {
    width: 100%;
    max-width: var(--max-width);
  }

  header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
  }

  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    background: var(--surface);
  }

  h1 {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text);
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  @media (max-width: 380px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
