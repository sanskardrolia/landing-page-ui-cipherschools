import { GOAL_TRACKS } from '../data/goalTracks';

/* Score the learner's words against every track's keywords.
   Multi-word keywords count as phrases; single words need a word boundary
   (so "ai" doesn't match "maintain"). Returns tracks sorted by score, best first. */
const norm = (s) => ` ${s.toLowerCase().replace(/[^a-z0-9+#./ ]+/g, ' ').replace(/\s+/g, ' ').trim()} `;

export const matchGoal = (text) => {
  const t = norm(text);
  if (t.trim().length < 2) return [];
  return GOAL_TRACKS
    .map((track) => {
      let score = 0;
      const hits = [];
      Object.entries(track.keywords).forEach(([kw, w]) => {
        if (t.includes(` ${kw} `)) { score += w; hits.push(kw); }
      });
      return { track, score, hits };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
};

/* "in 3 months", "6 months", "1 year" → weeks, to tailor the timeline line */
export const timeframeWeeks = (text) => {
  const m = text.toLowerCase().match(/(\d+)\s*(week|weeks|month|months|year|years)/);
  if (!m) return null;
  const n = Number(m[1]);
  if (m[2].startsWith('week')) return n;
  if (m[2].startsWith('month')) return n * 4;
  return n * 52;
};

/* Track id from a slug in the QR link, e.g. ?goal=fullstack */
export const trackById = (id) => GOAL_TRACKS.find((t) => t.id === id) || null;
