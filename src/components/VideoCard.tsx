import { useEffect, useRef, useState } from 'react';
import type { Video } from '../data/types';
import { embedUrl, thumbnailUrl } from '../lib/youtube';
import { getLinkStatus } from '../lib/linkStatus';
import { canEmbed, videoLinkText } from '../lib/video';
import { Icon } from './Icon';
import { ExtLink, LinkStatusBadge, LinkStatusNote } from './ui';

type ThumbState = 'loading' | 'ok' | 'failed';
type PlayerState = 'idle' | 'loading' | 'ready' | 'slow';

/**
 * The media area of a video: a click-to-load poster, the youtube-nocookie
 * player, or a clear placeholder when the video can't be embedded / is
 * unavailable. No third-party player loads until the user asks for it.
 */
export function VideoPlayer({
  video,
  startOpen = false,
  onUnavailable,
  onClose,
}: {
  video: Video;
  startOpen?: boolean;
  onUnavailable?: (unavailable: boolean) => void;
  onClose?: () => void;
}) {
  const status = getLinkStatus(video.url);
  const embeddable = canEmbed(video);
  const [thumb, setThumb] = useState<ThumbState>('loading');
  const [player, setPlayer] = useState<PlayerState>(startOpen && embeddable ? 'loading' : 'idle');
  const slowTimer = useRef<number | undefined>(undefined);

  const armSlowTimer = () => {
    window.clearTimeout(slowTimer.current);
    slowTimer.current = window.setTimeout(() => setPlayer((p) => (p === 'loading' ? 'slow' : p)), 12000);
  };
  useEffect(() => {
    if (startOpen && embeddable) armSlowTimer();
    return () => window.clearTimeout(slowTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unavailable = status.status === 'unavailable' || (embeddable && thumb === 'failed');
  const reported = useRef<boolean | null>(null);
  useEffect(() => {
    if (reported.current !== unavailable) {
      reported.current = unavailable;
      onUnavailable?.(unavailable);
    }
  }, [unavailable, onUnavailable]);

  const open = () => {
    setPlayer('loading');
    armSlowTimer();
  };

  return (
    <div className="video-media">
      {embeddable && !unavailable && player !== 'idle' ? (
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
          {onClose && (
            <button type="button" className="video-close" onClick={onClose} aria-label="Close video">
              <Icon name="x" size={16} />
            </button>
          )}
        </div>
      ) : embeddable && !unavailable ? (
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
  );
}

export function UnavailableVideoNote({ video }: { video: Video }) {
  const status = getLinkStatus(video.url);
  return (
    <p className="status-note status-note-danger" role="status">
      <strong>This video could not be loaded.</strong>{' '}
      {status.status === 'unavailable'
        ? status.note
        : 'The preview failed to load, so the video may have been removed or made private, or your network may block YouTube.'}{' '}
      Don’t substitute a random video: check the link, or note it and move on.
    </p>
  );
}

export function VideoCard({ video, index }: { video: Video; index?: number }) {
  const status = getLinkStatus(video.url);
  const [unavailable, setUnavailable] = useState(status.status === 'unavailable');

  return (
    <article className={`video-card ${unavailable ? 'is-unavailable' : ''}`} aria-labelledby={`${video.id}-title`}>
      <VideoPlayer video={video} onUnavailable={setUnavailable} />

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

        {unavailable ? <UnavailableVideoNote video={video} /> : <LinkStatusNote url={video.url} />}
        {video.kind === 'recording' && (
          <p className="muted small">BrightTALK recordings open on brighttalk.com and can’t be embedded here.</p>
        )}

        <div className="video-actions">
          <ExtLink href={video.url} className="btn btn-ghost btn-sm">
            {videoLinkText(video)}
          </ExtLink>
        </div>
      </div>
    </article>
  );
}
