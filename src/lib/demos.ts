export interface DemoEntry {
  id: string;
  order: number;
}

export type DemoUrls = Readonly<Record<string, string | undefined>>;

/** Orders demos and attaches the live URL for each (undefined while the env is unset). */
export function withLiveUrl<T extends DemoEntry>(
  entries: readonly T[],
  urls: DemoUrls,
): (T & { url: string | undefined })[] {
  return [...entries]
    .sort((a, b) => a.order - b.order)
    .map((entry) => ({ ...entry, url: urls[entry.id] }));
}
