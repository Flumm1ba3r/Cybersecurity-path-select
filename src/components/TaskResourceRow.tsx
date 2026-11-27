import { useState } from 'react';
import type { TaskResource, Week } from '../data/types';
import { getLinkStatus } from '../lib/linkStatus';
import { Icon } from './Icon';
import { UnavailableVideoNote, VideoPlayer } from './VideoCard';
import { canEmbed, videoLinkText } from '../lib/video';
import { ExtLink, LinkStatusBadge } from './ui';

/**
 * Inline resource actions under a checklist task, so the user never has to
 * scroll back up to find the video, challenge or walkthrough a task mentions.
 */
export function TaskResourceRow({ week, resource, taskId }: { week: Week; resource: TaskResource; taskId: string }) {
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  if (resource.type === 'video') {
    const video = week.videos.find((v) => v.id === resource.videoId);
    if (!video) return null;
    const embeddable = canEmbed(video);
    const panelId = `${taskId}-player`;
    return (
      <div className="task-res">
        <div className="task-res-row">
          {embeddable && !unavailable ? (
            <button
              type="button"
              className={`btn btn-sm ${playing ? 'btn-ghost' : 'btn-primary'}`}
              aria-expanded={playing}
              aria-controls={panelId}
              onClick={() => setPlaying((p) => !p)}
            >
              <Icon name={playing ? 'x' : 'play'} size={14} />
              {playing ? 'Close video' : 'Watch here'}
            </button>
          ) : null}
          <ExtLink href={video.url} className={`btn btn-sm ${embeddable && !unavailable ? 'btn-ghost' : 'btn-primary'}`}>
            {videoLinkText(video)}
          </ExtLink>
          <span className="task-res-name">
            <Icon name="video" size={13} /> {video.title}
            {video.duration ? ` · ${video.duration}` : ''}
            <LinkStatusBadge url={video.url} compact />
          </span>
        </div>
        {video.instruction && <p className="task-res-hint">{video.instruction}</p>}
        {getLinkStatus(video.url).status === 'restricted' && <p className="task-res-hint warn">{getLinkStatus(video.url).note}</p>}
        {playing && (
          <div id={panelId} className="task-player">
            <VideoPlayer video={video} startOpen onUnavailable={setUnavailable} />
          </div>
        )}
        {unavailable && <UnavailableVideoNote video={video} />}
      </div>
    );
  }

  const link =
    resource.type === 'challenge'
      ? { url: week.challenge.url, label: 'Open challenge', name: `${week.challenge.platform} · ${week.challenge.title}`, icon: 'flag' as const }
      : resource.type === 'walkthrough'
        ? (() => {
            const w = week.walkthroughs[resource.index];
            return w && { url: w.url, label: w.type === 'Community write-up' ? 'Open write-up' : 'Open walkthrough', name: w.title, icon: 'book' as const };
          })()
        : (() => {
            const r = week.challenge.related?.[resource.index];
            return r && { url: r.url, label: `Open ${r.title.replace(/ official download$/i, '')}`, name: r.title, icon: 'download' as const };
          })();
  if (!link) return null;
  const status = getLinkStatus(link.url);

  return (
    <div className="task-res">
      <div className="task-res-row">
        <ExtLink href={link.url} className="btn btn-ghost btn-sm">
          {link.label}
        </ExtLink>
        <span className="task-res-name">
          <Icon name={link.icon} size={13} /> {link.name}
          <LinkStatusBadge url={link.url} compact />
        </span>
      </div>
      {status.status !== 'available' && status.note && <p className={`task-res-hint ${status.status === 'unavailable' ? 'bad' : 'warn'}`}>{status.note}</p>}
    </div>
  );
}
