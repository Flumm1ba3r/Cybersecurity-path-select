#!/usr/bin/env node
/**
 * Verifies every external resource referenced by the programme and writes the
 * result to src/data/link-status.json, which the app reads to flag restricted
 * or unavailable resources instead of silently showing broken links/embeds.
 *
 * Usage:  npm run check-links
 *
 * Status meanings:
 *   available    – reachable and the expected content was found
 *   restricted   – reachable, but needs an account / registration / subscription
 *   unverified   – reachable, but content can't be confirmed automatically (e.g. login-only app)
 *   no-embed     – YouTube video exists but the owner disabled embedding
 *   (restricted + ageRestricted) – age-restricted YouTube video; linked, never embedded
 *   unavailable  – 404 / removed / private / expected content missing
 *   unchecked    – the check itself failed (network error) – status unknown
 *
 * The script never edits programme content; it only records what it observed.
 */
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../src/data/link-status.json');

/** kind: youtube-video | page */
const checks = [
  // Week 1
  { url: 'https://cyberdefenders.org/blueteam-ctf-challenges/beta-gamer/', kind: 'cd-lab', expect: 'Beta Gamer' },
  { url: 'https://cyberdefenders.org/walkthroughs/beta-gamer/', kind: 'cd-walkthrough', expect: 'Beta Gamer' },
  { url: 'https://www.youtube.com/watch?v=VYROU-ZwZX8', kind: 'youtube-video' },
  { url: 'https://www.brighttalk.com/webcast/20359/674280', kind: 'brighttalk', expect: 'Whisper' },
  // Week 2
  { url: 'https://cyberdefenders.org/blueteam-ctf-challenges/agenttesla/', kind: 'cd-lab', expect: 'AgentTesla' },
  { url: 'https://cyberdefenders.org/walkthroughs/agenttesla/', kind: 'cd-walkthrough', expect: 'AgentTesla' },
  { url: 'https://www.youtube.com/watch?v=GlDCDxNOT1c', kind: 'youtube-video' },
  { url: 'https://www.youtube.com/watch?v=sBuxwMAfGnI', kind: 'youtube-video' },
  // Week 3
  {
    url: 'https://web.cecs.pdx.edu/~dmcgrath/courses/F26/malware/ghidra_crackme_walkthrough.html',
    kind: 'page',
    expect: 'check_prefix',
  },
  { url: 'https://ghidra-sre.org/', kind: 'redirect' },
  { url: 'https://www.youtube.com/watch?v=OFAxXXcLXbc', kind: 'youtube-video' },
  { url: 'https://www.youtube.com/watch?v=TJhfnItRVOA', kind: 'youtube-video' },
  // Week 4
  { url: 'https://app.hackthebox.com/machines/Lame', kind: 'htb-app' },
  { url: 'https://hackersploit.org/hackthebox-lame-walkthrough/', kind: 'page', expect: 'Lame' },
  { url: 'https://www.youtube.com/watch?v=ntBkyid_u8Y', kind: 'youtube-video' },
  { url: 'https://www.youtube.com/@TCMSecurityAcademy', kind: 'page' },
  // Week 5
  { url: 'https://cyberdefenders.org/blueteam-ctf-challenges/revil-gold-southfield/', kind: 'cd-lab', expect: 'REvil' },
  { url: 'https://cyberdefenders.org/walkthroughs/revil-gold-southfield/', kind: 'cd-walkthrough', expect: 'REvil' },
  { url: 'https://hallibut.github.io/posts/cyber-defenders-revil-gold-southfield/', kind: 'page', expect: 'REvil' },
  { url: 'https://www.youtube.com/watch?v=9-EY5tYUfpA', kind: 'youtube-video' },
  { url: 'https://www.youtube.com/@13Cubed', kind: 'page' },
  // Setup
  { url: 'https://cyberdefenders.org/', kind: 'page', expect: 'CyberDefenders' },
  { url: 'https://cyberdefenders.org/pricing/', kind: 'page', expect: 'Pricing' },
  { url: 'https://www.hackthebox.com/', kind: 'page', expect: 'Hack The Box' },
];

async function get(url, opts = {}) {
  const res = await fetch(url, {
    headers: { 'user-agent': UA, 'accept-language': 'en' },
    redirect: opts.redirect ?? 'follow',
    signal: AbortSignal.timeout(25000),
  });
  const text = opts.redirect === 'manual' ? '' : await res.text();
  return { res, text };
}

async function check(c) {
  try {
    if (c.kind === 'youtube-video') {
      const id = new URL(c.url).searchParams.get('v');
      const { res, text } = await get(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`,
      );
      if (res.status === 200) {
        const j = JSON.parse(text);
        // oEmbed says "public" even for age-restricted videos, which can't play
        // in an embed. The public watch page carries isFamilySafe:false for those.
        let ageRestricted = false;
        try {
          const page = await get(c.url);
          ageRestricted = /"isFamilySafe":false/.test(page.text);
        } catch {
          /* watch page unavailable (rate limit) – keep the oEmbed result */
        }
        if (ageRestricted)
          return {
            status: 'restricted',
            httpStatus: 200,
            title: j.title,
            channel: j.author_name,
            ageRestricted: true,
            note: 'Age-restricted on YouTube: viewers must sign in on YouTube, so it is linked instead of embedded.',
          };
        return { status: 'available', httpStatus: 200, title: j.title, channel: j.author_name, note: 'Public and embeddable (YouTube oEmbed).' };
      }
      if (res.status === 401 || res.status === 403)
        return { status: 'no-embed', httpStatus: res.status, note: 'Video exists but embedding is disabled by the owner.' };
      return { status: 'unavailable', httpStatus: res.status, note: 'YouTube reports the video as private, removed or invalid.' };
    }

    if (c.kind === 'redirect') {
      const { res } = await get(c.url, { redirect: 'manual' });
      const loc = res.headers.get('location');
      if (res.status >= 300 && res.status < 400 && loc)
        return { status: 'available', httpStatus: res.status, note: `Redirects to ${loc}.`, redirectsTo: loc };
      if (res.ok) return { status: 'available', httpStatus: res.status };
      return { status: 'unavailable', httpStatus: res.status };
    }

    const { res, text } = await get(c.url);
    if (res.status === 404 || res.status === 410)
      return { status: 'unavailable', httpStatus: res.status, note: 'Page not found.' };
    if (!res.ok) return { status: 'unchecked', httpStatus: res.status, note: `Unexpected HTTP ${res.status}.` };
    if (c.expect && !text.includes(c.expect))
      return { status: 'unavailable', httpStatus: res.status, note: `Expected content ("${c.expect}") not found – page may have moved.` };

    if (c.kind === 'cd-lab') {
      const flag = (k) => new RegExp(`\\\\?"${k}\\\\?"\\s*:\\s*true`).test(text);
      const diff = text.match(/\\?"difficulty\\?"\s*:\s*\\?"(\w+)/)?.[1];
      const premium = flag('is_premium');
      const retired = flag('is_retired');
      const parts = [];
      if (premium) parts.push('marked premium on the platform');
      if (retired) parts.push('marked retired');
      if (diff) parts.push(`platform difficulty: ${diff}`);
      return {
        status: premium ? 'restricted' : 'available',
        httpStatus: res.status,
        premium,
        retired,
        difficulty: diff,
        note: parts.length ? `Lab page loads; ${parts.join(', ')}.` : 'Lab page loads.',
      };
    }
    if (c.kind === 'cd-walkthrough') {
      const gated = /Unlock Your Full Learning Experience/i.test(text);
      return {
        status: gated ? 'restricted' : 'available',
        httpStatus: res.status,
        note: gated
          ? 'Only a preview is visible without signing in; the full walkthrough requires an account (and possibly a subscription).'
          : 'Walkthrough page loads.',
      };
    }
    if (c.kind === 'brighttalk') {
      const reg = /Register/.test(text);
      const dur = text.replace(/<[^>]*>/g, ' ').match(/Duration:\s*(\d+)\s*mins?/i)?.[1];
      return {
        status: reg ? 'restricted' : 'available',
        httpStatus: res.status,
        note: `On-demand recording page loads${dur ? ` (listed duration ${dur} min)` : ''}${reg ? '; BrightTALK asks viewers to register before watching.' : '.'}`,
      };
    }
    if (c.kind === 'htb-app') {
      return {
        status: 'unverified',
        httpStatus: res.status,
        note: 'The HTB app loads but requires sign-in, so machine availability and subscription requirements could not be confirmed automatically.',
      };
    }
    return { status: 'available', httpStatus: res.status };
  } catch (err) {
    return { status: 'unchecked', note: `Check failed: ${err?.cause?.code ?? err?.name ?? 'error'}` };
  }
}

const results = {};
for (const c of checks) {
  const r = await check(c);
  results[c.url] = r;
  console.log(`${r.status.padEnd(12)} ${r.httpStatus ?? '---'}  ${c.url}${r.note ? `\n             ${r.note}` : ''}`);
  await new Promise((s) => setTimeout(s, 400));
}

const checkedOn = new Date().toISOString().slice(0, 10);
writeFileSync(out, JSON.stringify({ checkedOn, results }, null, 2) + '\n');
console.log(`\nWrote ${out}`);
const bad = Object.entries(results).filter(([, r]) => r.status === 'unavailable');
if (bad.length) {
  console.log(`\n${bad.length} resource(s) unavailable – the app will flag them.`);
}
