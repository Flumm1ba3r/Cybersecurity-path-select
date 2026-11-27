import { useEffect, useRef, useState } from 'react';
import type { Video } from '../data/types';
import { embedUrl, thumbnailUrl } from '../lib/youtube';
import { getLinkStatus } from '../lib/linkStatus';
import { Icon } from './Icon';
import { ExtLink, LinkStatusBadge, LinkStatusNote } from './ui';

type ThumbState = 'loading' | 'ok' | 'failed';
type PlayerState = 'idle' | 'loading' | 'ready' | 'slow';

/**
 * Video card. YouTube videos stay collapsed (thumbnail only) until the user
 * opens them, so no third-party player loads by default. Unavailable videos –
 * from the last link check, or detected at runtime via a failed thumbnail –
 * are shown as a clear warning card rather than a broken embed.
 */
export function VideoCard({ video, index }: { video: Video; index?: number }) {
  const status = getLinkStatus(video.url);
  const canEmbed = !!video.youtubeId && status.status !== 'no-embed' && status.status !== 'unavailable';
  const [thumb, setThumb] = useState<ThumbState>('loading');
  const [player, setPlayer] = useState<PlayerState>('idle');
  const slowTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(slowTimer.current), []);

  const open = () => {
    setPlayer('loading');
    window.clearTimeout(slowTimer.current);
    slowTimer.current = window.setTimeout(() => setPlayer((p) => (p === 'loading' ? 'slow' : p)), 12000);
  };

  const unavailable = status.status === 'unavailable' || (canEmbed && thumb === 'failed');
  const linkText =
    video.kind === 'channel' ? 'Open channel' : video.kind === 'recording' ? 'Open recording' : 'Watch on YouTube';

  return (
    <article className={`video-card ${unavailable ? 'is-unavailable' : ''}`} aria-labelledby={`${video.id}-title`}>
      <div className="video-media">
        {canEmbed && player !== 'idle' && !unavailable ? (
          <div className="video-frame">
            {(player === 'loading' || player === 'slow') && (
              <div className="video-loading" aria-live="polite">
                <span className="spinner" aria-hidden="true" />
                <span>{player === 'slow' ? 'The player is taking a while. You can open it on YouTube instead.' : 'Loading player…'}</span>
              </div>
            )}
            <iframe
              src={embedUrl(video.youtubeId!)}
              title={`${video.title} — ${video.source}`}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => {
                window.clearTimeout(slowTimer.current);
                setPlayer('ready');
              }}
            />
          </div>
        ) : canEmbed && !unavailable ? (
          <button type="button" className="video-poster" onClick={open} aria-label={`Play video: ${video.title}`}>
            <img
              src={thumbnailUrl(video.youtubeId!)}
              alt=""
              loading="lazy"
              onLoad={(e) => {
                // YouTube serves a 120×90 grey placeholder for removed videos.
                setThumb(e.currentTarget.naturalWidth <= 120 ? 'failed' : 'ok');
              }}
              onError={() => setThumb('failed')}
              className={thumb === 'ok' ? 'is-loaded' : ''}
            />
            <span className="video-play">
              <Icon name="play" size={22} />
            </span>
            <span className="video-poster-hint">Click to load the player (youtube-nocookie.com)</span>
          </button>
        ) : (
          <div className={`video-placeholder ${unavailable ? 'is-bad' : ''}`}>
            <Icon name={unavailable ? 'alert' : video.kind === 'channel' ? 'layers' : 'video'} size={30} />
            <span>
              {unavailable
                ? 'Video unavailable'
                : video.kind === 'channel'
                  ? 'YouTube channel'
                  : video.kind === 'recording'
                    ? 'External recording'
                    : 'External video'}
            </span>
          </div>
        )}
      </div>

      <div className="video-body">
        <div className="video-meta">
          {index !== undefined && <span className="pill">Watch {index + 1}</span>}
          <span className="muted">{video.source}</span>
          {video.duration && (
            <span className="muted">
              <Icon name="clock" size={13} /> {video.duration}
            </span>
          )}
          {unavailable && status.status !== 'unavailable' ? (
            <span className="status status-unavailable">Not loading here</span>
          ) : (
            <LinkStatusBadge url={video.url} />
          )}
        </div>
        <h3 id={`${video.id}-title`}>{video.title}</h3>
        {status.title && status.title !== video.title && (
          <p className="video-verified">
            On YouTube: “{status.title}”{status.channel ? ` · ${status.channel}` : ''}
          </p>
        )}
        {video.instruction && <p className="video-instruction">{video.instruction}</p>}
        <p className="video-purpose">
          <strong>Focus:</strong> {video.purpose}
        </p>

        {unavailable && (
          <p className="status-note status-note-danger" role="status">
            <strong>This video could not be loaded.</strong>{' '}
            {status.status === 'unavailable'
              ? status.note
              : 'The preview failed to load, so the video may have been removed or made private, or your network may block YouTube.'}{' '}
            Don’t substitute a random video: check the link, or note it and move on.
          </p>
        )}
        {!unavailable && <LinkStatusNote url={video.url} />}
        {video.kind === 'recording' && (
          <p className="muted small">BrightTALK recordings open on brighttalk.com and can’t be embedded here.</p>
        )}

        <div className="video-actions">
          <ExtLink href={video.url} className="btn btn-ghost btn-sm">
            {linkText}
          </ExtLink>
          {canEmbed && player !== 'idle' && !unavailable && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPlayer('idle')}>
              Close player
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
