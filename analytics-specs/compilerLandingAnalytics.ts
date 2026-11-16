import { trackEvent } from "@/lib/data-layer";

/**
 * CipherSchools Online Compiler Landing Page Analytics
 *
 * Product:
 *   CipherSchools / Free Online Compiler (with whiteboard)
 *
 * Route:
 *   /online-compiler   (/compiler redirects here)
 *
 * Page sections identified from the landing page:
 *   - hero                     (language pills, Open Compiler, Ctrl/Cmd + Enter, live editor mockup)
 *   - problem                  (setup, multi-file, save, share)
 *   - how_it_works
 *   - whiteboard_spotlight     ("Debug by drawing")
 *   - proof                    (stats + learner feedback marquee)
 *   - faq                      (incl. pricing card and objections: local / public)
 *   - floating_dock            (sticky Open Compiler + shortcut hint)
 *   - footer
 *
 * Tracking philosophy:
 *   - Track meaningful product discovery, engagement and compile intent.
 *   - Section reveal events should fire once per page/session.
 *   - CTA events include source section for attribution.
 *   - Language is the key dimension: carry it on every editor event.
 *
 * Replaces the ad-hoc events already on the page (src/utils/analytics):
 *   oc_hero_cta_click          → trackCompilerHeroOpenClicked
 *   oc_section_cta_click       → trackCompilerSectionCTAClicked
 *   oc_feature_whiteboard_view → trackCompilerWhiteboardSpotlightViewed
 *   oc_faq_open                → trackCompilerFaqToggled
 */


/* =========================================================
   PAGE VIEW
========================================================= */

export const trackCompilerLandingViewed = () => {
  trackEvent("cipherschools_compiler_landing_viewed", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    session_scope: true,
  });
};


/* =========================================================
   SECTION REVEALS
========================================================= */

export type CompilerSection =
  | "hero"
  | "problem"
  | "how_it_works"
  | "whiteboard_spotlight"
  | "proof"
  | "faq"
  | "floating_dock"
  | "footer";

export const trackCompilerSectionViewed = ({
  section,
}: {
  section: CompilerSection;
}) => {
  trackEvent("cipherschools_compiler_section_viewed", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section,
    session_scope: true,
  });
};


/* =========================================================
   EXPLICIT SECTION EVENTS
========================================================= */

export const trackCompilerHeroViewed = () => {
  trackEvent("cipherschools_compiler_hero_viewed", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "hero",
    session_scope: true,
  });
};

export const trackCompilerProblemViewed = () => {
  trackEvent("cipherschools_compiler_problem_viewed", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "problem",
    session_scope: true,
  });
};

export const trackCompilerHowItWorksViewed = () => {
  trackEvent("cipherschools_compiler_how_it_works_viewed", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "how_it_works",
    session_scope: true,
  });
};

export const trackCompilerWhiteboardSpotlightViewed = () => {
  trackEvent("cipherschools_compiler_whiteboard_spotlight_viewed", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "whiteboard_spotlight",
    session_scope: true,
  });
};

export const trackCompilerProofViewed = () => {
  trackEvent("cipherschools_compiler_proof_viewed", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "proof",
    session_scope: true,
  });
};

export const trackCompilerFaqViewed = () => {
  trackEvent("cipherschools_compiler_faq_viewed", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "faq",
    session_scope: true,
  });
};


/* =========================================================
   SCROLL DEPTH
========================================================= */

export type CompilerScrollDepth = 25 | 50 | 75 | 90 | 100;

export const trackCompilerScrollDepth = ({
  depth,
}: {
  depth: CompilerScrollDepth;
}) => {
  trackEvent("cipherschools_compiler_scroll_depth", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    depth,
  });
};


/* =========================================================
   GENERIC CTA
========================================================= */

export type CompilerCTASection =
  | "navbar"
  | "hero"
  | "problem"
  | "how_it_works"
  | "whiteboard_spotlight"
  | "proof"
  | "faq"
  | "floating_dock"
  | "footer";

export type CompilerCTA =
  | "open_compiler"
  | "open_whiteboard"
  | "keyboard_shortcut"
  | "other";

export const trackCompilerCTAClicked = ({
  cta,
  section,
  language,
  destination,
  source,
}: {
  cta: CompilerCTA;
  section: CompilerCTASection;
  language?: CompilerLanguage;
  destination?: string;
  source?: string;
}) => {
  trackEvent("cipherschools_compiler_cta_clicked", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    cta,
    section,
    language,
    destination,
    source,
  });
};

// "Open Compiler" buttons at the end of the problem and how-it-works sections
export const trackCompilerSectionCTAClicked = ({
  section,
  language,
}: {
  section: "problem" | "how_it_works";
  language: CompilerLanguage;
}) => {
  trackEvent("cipherschools_compiler_section_cta_clicked", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section,
    cta: "open_compiler",
    language,
    source: section,
  });
};


/* =========================================================
   HERO
========================================================= */

export type CompilerLanguage =
  | "c"
  | "cpp"
  | "java"
  | "python"
  | "javascript";

export const trackCompilerHeroOpenClicked = ({
  language,
}: {
  language: CompilerLanguage;
}) => {
  trackEvent("cipherschools_compiler_open_clicked", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "hero",
    cta: "open_compiler",
    language,
    source: "hero",
  });
};

export const trackCompilerLanguageSelected = ({
  language,
  previous,
  source,
}: {
  language: CompilerLanguage;
  previous: CompilerLanguage;
  source: "hero_pills" | "editor_tabs" | "whiteboard";
}) => {
  trackEvent("cipherschools_compiler_language_selected", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: source === "whiteboard" ? "whiteboard_spotlight" : "hero",
    language,
    previous,
    source,
  });
};

export const trackCompilerKeyboardShortcutUsed = ({
  language,
  section,
}: {
  language: CompilerLanguage;
  section?: CompilerSection;
}) => {
  trackEvent("cipherschools_compiler_keyboard_shortcut_used", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section,
    cta: "keyboard_shortcut",
    shortcut: "ctrl_cmd_enter",
    language,
  });
};

export const trackCompilerHeroInteraction = ({
  action,
}: {
  action:
    | "read"
    | "mockup_viewed"
    | "share_card_viewed"
    | "bug_animation"
    | "tilt"
    | "interaction";
}) => {
  trackEvent("cipherschools_compiler_hero_interaction", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "hero",
    action,
  });
};


/* =========================================================
   HERO: LIVE EDITOR MOCKUP
========================================================= */

export const trackCompilerEditorRunClicked = ({
  language,
  hasCustomInput,
}: {
  language: CompilerLanguage;
  hasCustomInput: boolean;
}) => {
  trackEvent("cipherschools_compiler_editor_run_clicked", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "hero",
    language,
    has_custom_input: hasCustomInput,
  });
};

export const trackCompilerEditorReplayClicked = ({
  language,
}: {
  language: CompilerLanguage;
}) => {
  trackEvent("cipherschools_compiler_editor_replay_clicked", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "hero",
    language,
  });
};

export const trackCompilerCustomInputFocused = ({
  language,
}: {
  language: CompilerLanguage;
}) => {
  trackEvent("cipherschools_compiler_custom_input_focused", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "hero",
    language,
  });
};

// The "Open Compiler" overlay that appears when hovering the editor mockup
export const trackCompilerEditorOverlayClicked = ({
  language,
}: {
  language: CompilerLanguage;
}) => {
  trackEvent("cipherschools_compiler_editor_overlay_clicked", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "hero",
    cta: "open_compiler",
    language,
    source: "editor_overlay",
  });
};


/* =========================================================
   PROBLEM
========================================================= */

export type CompilerProblemCard =
  | "setup"
  | "multifile"
  | "save"
  | "share"
  | "other";

export const trackCompilerProblemCardViewed = ({
  card,
  position,
}: {
  card: CompilerProblemCard;
  position: number;
}) => {
  trackEvent("cipherschools_compiler_problem_card_viewed", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "problem",
    card,
    position,
  });
};


/* =========================================================
   HOW IT WORKS
========================================================= */

export const trackCompilerStepViewed = ({
  step,
  position,
}: {
  step: string;
  position: number;
}) => {
  trackEvent("cipherschools_compiler_step_viewed", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "how_it_works",
    step,
    position,
  });
};


/* =========================================================
   WHITEBOARD SPOTLIGHT
========================================================= */

export const trackCompilerWhiteboardOpenClicked = () => {
  trackEvent("cipherschools_compiler_whiteboard_open_clicked", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "whiteboard_spotlight",
    cta: "open_whiteboard",
    language: "cpp",
    source: "whiteboard_overlay",
  });
};

export const trackCompilerWhiteboardReplayClicked = () => {
  trackEvent("cipherschools_compiler_whiteboard_replay_clicked", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "whiteboard_spotlight",
  });
};

export const trackCompilerWhiteboardInteraction = ({
  action,
}: {
  action:
    | "drawing_watched"
    | "hover"
    | "language_tab"
    | "interaction";
}) => {
  trackEvent("cipherschools_compiler_whiteboard_interaction", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "whiteboard_spotlight",
    action,
  });
};


/* =========================================================
   PROOF / FEEDBACK
========================================================= */

export const trackCompilerStatViewed = ({
  stat,
}: {
  stat: string;
}) => {
  trackEvent("cipherschools_compiler_stat_viewed", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "proof",
    stat,
  });
};

export const trackCompilerFeedbackInteracted = ({
  action,
  position,
}: {
  action: "hover_pause" | "click";
  position?: number;
}) => {
  trackEvent("cipherschools_compiler_feedback_interacted", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "proof",
    action,
    position,
  });
};


/* =========================================================
   FAQ / PRICING / OBJECTIONS
========================================================= */

export type CompilerFaqQuestion =
  | "free"
  | "languages"
  | "multifile"
  | "account"
  | "sharing"
  | "whiteboard"
  | "whiteboard-saved"
  | "stdin"
  | "libraries"
  | "limits"
  | "mobile"
  | "other";

export const trackCompilerFaqToggled = ({
  question,
  position,
  action,
}: {
  question: CompilerFaqQuestion;
  position: number;
  action: "open" | "close";
}) => {
  trackEvent("cipherschools_compiler_faq_toggled", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "faq",
    question,
    position,
    action,
  });
};

export const trackCompilerPricingCardViewed = () => {
  trackEvent("cipherschools_compiler_pricing_card_viewed", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "faq",
    session_scope: true,
  });
};

export const trackCompilerObjectionViewed = ({
  objection,
}: {
  objection: "local" | "public" | "other";
}) => {
  trackEvent("cipherschools_compiler_objection_viewed", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "faq",
    objection,
  });
};


/* =========================================================
   FLOATING DOCK
========================================================= */

export const trackCompilerDockShown = () => {
  trackEvent("cipherschools_compiler_dock_shown", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "floating_dock",
    session_scope: true,
  });
};

export const trackCompilerDockClicked = ({
  language,
}: {
  language: CompilerLanguage;
}) => {
  trackEvent("cipherschools_compiler_dock_clicked", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "floating_dock",
    cta: "open_compiler",
    language,
    source: "floating_dock",
  });
};


/* =========================================================
   OPEN-COMPILER FUNNEL (LANDING → LIVE COMPILER)
========================================================= */

export type CompilerOpenSource =
  | "hero"
  | "editor_overlay"
  | "problem"
  | "how_it_works"
  | "whiteboard_overlay"
  | "faq"
  | "floating_dock"
  | "keyboard_shortcut"
  | "navbar"
  | "other";

export const trackCompilerOpened = ({
  source,
  language,
  destination,
}: {
  source: CompilerOpenSource;
  language: CompilerLanguage;
  destination?: string;
}) => {
  trackEvent("cipherschools_compiler_opened", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    source,
    language,
    destination,
  });
};

export const trackCompilerOpenIntentAbandoned = ({
  source,
  stage,
}: {
  source: CompilerOpenSource;
  stage:
    | "language_selected"
    | "mockup_run"
    | "cta_click"
    | "login_prompt";
}) => {
  trackEvent("cipherschools_compiler_open_intent_abandoned", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    source,
    stage,
  });
};


/* =========================================================
   FOOTER
========================================================= */

export type CompilerFooterLink =
  | "home"
  | "premium"
  | "resume_builder"
  | "ats_checker"
  | "practice"
  | "contact"
  | "privacy_policy"
  | "terms_of_service"
  | "linkedin"
  | "instagram"
  | "youtube"
  | "other";

export const trackCompilerFooterLinkClicked = ({
  link,
}: {
  link: CompilerFooterLink;
}) => {
  trackEvent("cipherschools_compiler_footer_link_clicked", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section: "footer",
    link,
  });
};


/* =========================================================
   OUTBOUND / NAVIGATION
========================================================= */

export const trackCompilerNavigation = ({
  from,
  to,
  source,
}: {
  from: string;
  to: string;
  source?: string;
}) => {
  trackEvent("cipherschools_compiler_navigation", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    from,
    to,
    source,
  });
};


/* =========================================================
   ENGAGEMENT
========================================================= */

export const trackCompilerEngagement = ({
  action,
  section,
  target,
}: {
  action:
    | "hover"
    | "click"
    | "expand"
    | "interaction";
  section: CompilerSection;
  target?: string;
}) => {
  trackEvent("cipherschools_compiler_engagement", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    action,
    section,
    target,
  });
};


/* =========================================================
   EXIT / ABANDONMENT
========================================================= */

export const trackCompilerLandingExit = ({
  section,
  destination,
}: {
  section?: CompilerSection;
  destination?: string;
}) => {
  trackEvent("cipherschools_compiler_landing_exit", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section,
    destination,
  });
};


/* =========================================================
   ERRORS
========================================================= */

export const trackCompilerError = ({
  section,
  error,
  code,
}: {
  section: string;
  error: string;
  code?: string | number;
}) => {
  trackEvent("cipherschools_compiler_error", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    section,
    error,
    code,
  });
};


/* =========================================================
   PERFORMANCE
========================================================= */

export const trackCompilerPageLoadPerformance = ({
  loadTime,
}: {
  loadTime: number;
}) => {
  trackEvent("cipherschools_compiler_page_load_performance", {
    page: "cipherschools_compiler",
    product: "online_compiler",
    load_time_ms: loadTime,
  });
};
