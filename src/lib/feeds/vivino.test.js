import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchVivino } from './vivino.js';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

describe('fetchVivino', () => {
  it('returns null on fetch failure', async () => {
    fetch.mockRejectedValue(new Error('network error'));
    const result = await fetchVivino();
    expect(result).toBeNull();
  });

  it('returns null on non-ok response', async () => {
    fetch.mockResolvedValue({ ok: false, status: 403 });
    const result = await fetchVivino();
    expect(result).toBeNull();
  });

  it('returns null when no wines found in HTML', async () => {
    fetch.mockResolvedValue({ ok: true, text: async () => '<html><body><p>nothing</p></body></html>' });
    const result = await fetchVivino();
    expect(result).toBeNull();
  });

  it('never throws', async () => {
    fetch.mockRejectedValue(new Error('unexpected'));
    await expect(fetchVivino()).resolves.toBeNull();
  });
});
