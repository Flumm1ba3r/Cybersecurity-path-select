import type { Video } from '../data/types';
import { getLinkStatus, type LinkStatus } from './linkStatus';

/**
 * Strict embed policy: only embed a YouTube video that the last link check
 * confirmed as public AND embeddable AND not age-restricted. Anything that
 * needs a sign-in, a subscription, or simply wasn't verified is shown as a
 * clean external-link card – never as an iframe that would render YouTube's
 * error / sign-in screen.
 */
export function canEmbed(video: Video): boolean {
  const s = getLinkStatus(video.url);
  return video.kind === 'video' && !!video.youtubeId && s.status === 'available' && !s.ageRestricted;
}

export function videoLinkText(video: Video): string {
  return video.kind === 'channel' ? 'Open channel' : video.kind === 'recording' ? 'Open recording' : 'Watch on YouTube';
}

export function hostName(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/** Short, neutral reason why a video is linked instead of embedded. */
export function linkOnlyReason(video: Video, s: LinkStatus = getLinkStatus(video.url)): string | null {
  if (s.ageRestricted) return 'Age-restricted on YouTube: sign in on YouTube to watch.';
  switch (s.status) {
    case 'restricted':
    case 'unverified':
      return video.kind === 'recording' ? `Sign-in required on ${hostName(video.url)}.` : 'Sign-in required to watch.';
    case 'no-embed':
      return 'The owner doesn’t allow this video to be embedded.';
    case 'unchecked':
      return video.kind === 'video' ? 'Not verified yet, so it opens on YouTube instead of playing here.' : null;
    default:
      return null;
  }
}
