const ID_RE = /^[A-Za-z0-9_-]{11}$/;

/**
 * Extract a YouTube video ID only from an unambiguous watch / short / embed URL.
 * Returns null for channels, playlists or anything we cannot confidently parse –
 * callers then show an external-link card instead of an iframe.
 */
export function youtubeIdFromUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, '');
  let id: string | null = null;
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') id = url.searchParams.get('v');
    else {
      const m = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/);
      if (m) id = m[1];
    }
  } else if (host === 'youtu.be') {
    id = url.pathname.slice(1).split('/')[0] || null;
  }
  return id && ID_RE.test(id) ? id : null;
}

export function embedUrl(id: string): string {
  const params = new URLSearchParams({ rel: '0', modestbranding: '1' });
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
}

export function thumbnailUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
