import type { Video } from '../data/types';
import { getLinkStatus } from './linkStatus';

export function canEmbed(video: Video): boolean {
  const s = getLinkStatus(video.url).status;
  return !!video.youtubeId && s !== 'no-embed' && s !== 'unavailable';
}

export function videoLinkText(video: Video): string {
  return video.kind === 'channel' ? 'Open channel' : video.kind === 'recording' ? 'Open recording' : 'Watch on YouTube';
}
