/* Feature switches for the learner dashboard.
   PLANNER_LIVE: while false, Planner shows "Coming soon" in the sidebar,
   /dashboard/planner redirects to Overview and its CipherCoins bonus is hidden. */
export const PLANNER_LIVE = false;

/* ADDITIONAL_TESTS: the module-wide "Additional Tests" (beside Module Tests in the Test tab).
   While false they are left out everywhere — the Test tab, progress, certificates,
   What's next and activity — so nothing waits on a test the learner can't see. */
export const ADDITIONAL_TESTS = false;
