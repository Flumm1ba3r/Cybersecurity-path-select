import data from '../data/link-status.json';

export type LinkStatusKind = 'available' | 'restricted' | 'unverified' | 'no-embed' | 'unavailable' | 'unchecked';

export interface LinkStatus {
  status: LinkStatusKind;
  httpStatus?: number;
  note?: string;
  title?: string;
  channel?: string;
  premium?: boolean;
  retired?: boolean;
  difficulty?: string;
  redirectsTo?: string;
}

const results = data.results as Record<string, LinkStatus>;

export const linksCheckedOn: string = data.checkedOn;

export function getLinkStatus(url: string): LinkStatus {
  return results[url] ?? { status: 'unchecked', note: 'This link has not been checked yet.' };
}

export const statusLabel: Record<LinkStatusKind, string> = {
  available: 'Link checked',
  restricted: 'Access restricted',
  unverified: 'Sign-in required',
  'no-embed': 'Embedding disabled',
  unavailable: 'Unavailable',
  unchecked: 'Not checked',
};

export function allLinkStatuses() {
  return Object.entries(results).map(([url, s]) => ({ url, ...s }));
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
