import { track } from './analytics';

/**
 * Goal advisor (home page) — analytics.
 *
 * Product: CipherSchools home · "Describe your goal" search pill + roadmap advisor.
 * Sections: goal_pill, goal_advisor (search, roadmap, recommendations, no_match).
 *
 * Tracking philosophy: capture learner intent (what they search for, in their own
 * words) to shape the catalog, and the funnel from search → roadmap → plan. The
 * raw query is included so the team can read real demand; it's also kept in a
 * small on-device log (see logGoalSearch) for the demo, since there's no backend.
 */

const PAGE = 'home';

/* ===== GOAL PILL ===== */
export const trackHomeGoalPillViewed = () => {
  track('cipherschools_home_goal_pill_viewed', { page: PAGE, section: 'goal_pill', session_scope: true });
};
export const trackHomeGoalAdvisorOpened = ({ source }) => {
  track('cipherschools_home_goal_advisor_opened', { page: PAGE, section: 'goal_pill', source });
};

/* ===== SEARCH ===== */
export const trackHomeGoalSearchSubmitted = ({ query, source, matchedTrack, matchCount }) => {
  track('cipherschools_home_goal_search_submitted', {
    page: PAGE, section: 'goal_advisor', query, source, matched_track: matchedTrack || 'none', match_count: matchCount
  });
};
export const trackHomeGoalSearchNoMatch = ({ query }) => {
  track('cipherschools_home_goal_search_no_match', { page: PAGE, section: 'goal_advisor', query });
};
export const trackHomeGoalSuggestionClicked = ({ suggestion, context }) => {
  track('cipherschools_home_goal_suggestion_clicked', { page: PAGE, section: 'goal_advisor', suggestion, context });
};

/* ===== ROADMAP & RECOMMENDATIONS ===== */
export const trackHomeGoalRoadmapDownloaded = ({ trackId }) => {
  track('cipherschools_home_goal_roadmap_downloaded', { page: PAGE, section: 'goal_advisor', track_id: trackId });
};
export const trackHomeGoalTrackSwitched = ({ trackId }) => {
  track('cipherschools_home_goal_track_switched', { page: PAGE, section: 'goal_advisor', track_id: trackId });
};
export const trackHomeGoalCtaClicked = ({ cta, trackId, destination }) => {
  track('cipherschools_home_goal_cta_clicked', { page: PAGE, section: 'goal_advisor', cta, track_id: trackId, destination });
};

/* ===== EXIT ===== */
export const trackHomeGoalAdvisorClosed = ({ stage }) => {
  track('cipherschools_home_goal_advisor_closed', { page: PAGE, section: 'goal_advisor', stage });
};

/* On-device log of searches (most recent 50) — stands in for a backend until one exists */
const LOG_KEY = 'cs_goal_searches';
export const logGoalSearch = (entry) => {
  try {
    const list = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    list.unshift({ ...entry, at: new Date().toISOString() });
    localStorage.setItem(LOG_KEY, JSON.stringify(list.slice(0, 50)));
  } catch { /* storage unavailable */ }
};
