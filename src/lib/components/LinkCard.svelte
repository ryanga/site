<script>
  /** @type {{ label: string, href?: string|null, external?: boolean, onclick?: () => void, icon?: import('svelte').Snippet }} */
  let { label, href = null, external = false, onclick = null, icon } = $props();
</script>

{#if href}
  <a
    {href}
    target={external ? '_blank' : null}
    rel={external ? 'noopener noreferrer' : null}
    class="card"
  >
    <span class="icon">{@render icon?.()}</span>
    <span class="label">{label}</span>
  </a>
{:else}
  <button class="card" {onclick}>
    <span class="icon">{@render icon?.()}</span>
    <span class="label">{label}</span>
  </button>
{/if}

<style>
  .card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    background: var(--surface);
    border-radius: var(--radius);
    width: 100%;
    text-align: left;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.15s;
    cursor: pointer;
  }

  .card:hover {
    background: var(--surface-hover);
  }

  .icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    color: var(--subtext);
  }

  .label {
    color: var(--text);
  }
</style>
