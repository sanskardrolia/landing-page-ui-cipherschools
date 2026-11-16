import { trackEvent } from "@/lib/data-layer";

/**
 * CipherSchools ATS Checker Landing Page Analytics
 *
 * Product:
 *   CipherSchools / Free Online ATS Checker
 *
 * Route:
 *   /resume/ats-checker   (scan page: /resume/ats-checker/scan?mode=resume|jd)
 *
 * Page sections identified from the landing page:
 *   - hero                     (mode toggle + resume upload + job description step)
 *   - why_check                ("Make every application count")
 *   - how_it_works             (upload, add job description, get score)
 *   - check_modes              (Resume only vs Resume + job description cards)
 *   - sample_report            ("We show yours for FREE")
 *   - report_breakdown         ("What is inside your ATS report")
 *   - faq
 *   - floating_dock            (sticky Resume Only / Upload Resume + JD bar)
 *   - footer
 *
 * Tracking philosophy:
 *   - Track meaningful product discovery, engagement and scan intent.
 *   - Section reveal events should fire once per page/session.
 *   - CTA events include source section for attribution.
 *   - The upload is the conversion: every step from mode pick to
 *     scan start is tracked, including validation failures.
 */


/* =========================================================
   PAGE VIEW
========================================================= */

export const trackAtsCheckerLandingViewed = () => {
  trackEvent("cipherschools_ats_checker_landing_viewed", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    session_scope: true,
  });
};


/* =========================================================
   SECTION REVEALS
========================================================= */

export type AtsCheckerSection =
  | "hero"
  | "why_check"
  | "how_it_works"
  | "check_modes"
  | "sample_report"
  | "report_breakdown"
  | "faq"
  | "floating_dock"
  | "footer";

export const trackAtsCheckerSectionViewed = ({
  section,
}: {
  section: AtsCheckerSection;
}) => {
  trackEvent("cipherschools_ats_checker_section_viewed", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section,
    session_scope: true,
  });
};


/* =========================================================
   EXPLICIT SECTION EVENTS
========================================================= */

export const trackAtsCheckerHeroViewed = () => {
  trackEvent("cipherschools_ats_checker_hero_viewed", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "hero",
    session_scope: true,
  });
};

export const trackAtsCheckerWhyCheckViewed = () => {
  trackEvent("cipherschools_ats_checker_why_check_viewed", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "why_check",
    session_scope: true,
  });
};

export const trackAtsCheckerHowItWorksViewed = () => {
  trackEvent("cipherschools_ats_checker_how_it_works_viewed", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "how_it_works",
    session_scope: true,
  });
};

export const trackAtsCheckerModesViewed = () => {
  trackEvent("cipherschools_ats_checker_modes_viewed", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "check_modes",
    session_scope: true,
  });
};

export const trackAtsCheckerSampleReportViewed = () => {
  trackEvent("cipherschools_ats_checker_sample_report_viewed", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "sample_report",
    session_scope: true,
  });
};

export const trackAtsCheckerReportBreakdownViewed = () => {
  trackEvent("cipherschools_ats_checker_report_breakdown_viewed", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "report_breakdown",
    session_scope: true,
  });
};

export const trackAtsCheckerFaqViewed = () => {
  trackEvent("cipherschools_ats_checker_faq_viewed", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "faq",
    session_scope: true,
  });
};


/* =========================================================
   SCROLL DEPTH
========================================================= */

export type AtsCheckerScrollDepth = 25 | 50 | 75 | 90 | 100;

export const trackAtsCheckerScrollDepth = ({
  depth,
}: {
  depth: AtsCheckerScrollDepth;
}) => {
  trackEvent("cipherschools_ats_checker_scroll_depth", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    depth,
  });
};


/* =========================================================
   GENERIC CTA
========================================================= */

export type AtsCheckerCTASection =
  | "navbar"
  | "hero"
  | "how_it_works"
  | "check_modes"
  | "sample_report"
  | "faq"
  | "floating_dock"
  | "footer";

export type AtsCheckerCTA =
  | "upload_now"
  | "check_match"
  | "resume_only"
  | "resume_with_jd"
  | "other";

export const trackAtsCheckerCTAClicked = ({
  cta,
  section,
  destination,
  source,
}: {
  cta: AtsCheckerCTA;
  section: AtsCheckerCTASection;
  destination?: string;
  source?: string;
}) => {
  trackEvent("cipherschools_ats_checker_cta_clicked", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    cta,
    section,
    destination,
    source,
  });
};


/* =========================================================
   HERO: CHECK MODE
========================================================= */

export type AtsCheckMode = "resume" | "jd";

export const trackAtsCheckerModeSelected = ({
  mode,
  source,
}: {
  mode: AtsCheckMode;
  source: "hero_toggle" | "check_modes" | "floating_dock";
}) => {
  trackEvent("cipherschools_ats_checker_mode_selected", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: source === "hero_toggle" ? "hero" : source,
    mode,
    source,
  });
};

export const trackAtsCheckerHeroInteraction = ({
  action,
}: {
  action:
    | "read"
    | "report_preview_viewed"
    | "animation"
    | "interaction";
}) => {
  trackEvent("cipherschools_ats_checker_hero_interaction", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "hero",
    action,
  });
};


/* =========================================================
   HERO: RESUME UPLOAD
========================================================= */

export type AtsUploadMethod = "drag_drop" | "browse";

export const trackAtsCheckerUploadStarted = ({
  mode,
  method,
}: {
  mode: AtsCheckMode;
  method: AtsUploadMethod;
}) => {
  trackEvent("cipherschools_ats_checker_upload_started", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "hero",
    cta: "upload_now",
    mode,
    method,
  });
};

export const trackAtsCheckerDragOver = () => {
  trackEvent("cipherschools_ats_checker_drag_over", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "hero",
    session_scope: true,
  });
};

export const trackAtsCheckerFileAccepted = ({
  mode,
  method,
  fileSizeKb,
}: {
  mode: AtsCheckMode;
  method: AtsUploadMethod;
  fileSizeKb: number;
}) => {
  trackEvent("cipherschools_ats_checker_file_accepted", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "hero",
    mode,
    method,
    file_size_kb: fileSizeKb,
  });
};

export const trackAtsCheckerFileRejected = ({
  mode,
  reason,
}: {
  mode: AtsCheckMode;
  reason: "not_pdf" | "too_large" | "empty" | "other";
}) => {
  trackEvent("cipherschools_ats_checker_file_rejected", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "hero",
    mode,
    reason,
  });
};

export const trackAtsCheckerFileChanged = () => {
  trackEvent("cipherschools_ats_checker_file_changed", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "hero",
    mode: "jd",
  });
};


/* =========================================================
   HERO: JOB DESCRIPTION STEP (mode = jd)
========================================================= */

export const trackAtsCheckerJdStepShown = () => {
  trackEvent("cipherschools_ats_checker_jd_step_shown", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "hero",
    mode: "jd",
  });
};

export const trackAtsCheckerJdInputStarted = () => {
  trackEvent("cipherschools_ats_checker_jd_input_started", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "hero",
    mode: "jd",
  });
};

export const trackAtsCheckerJdSubmitted = ({
  jdLength,
}: {
  jdLength: number;
}) => {
  trackEvent("cipherschools_ats_checker_jd_submitted", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "hero",
    cta: "check_match",
    mode: "jd",
    jd_length: jdLength,
  });
};

export const trackAtsCheckerJdRejected = ({
  jdLength,
  minLength,
}: {
  jdLength: number;
  minLength: number;
}) => {
  trackEvent("cipherschools_ats_checker_jd_rejected", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "hero",
    mode: "jd",
    reason: "too_short",
    jd_length: jdLength,
    min_length: minLength,
  });
};


/* =========================================================
   WHY CHECK
========================================================= */

export type AtsWhyCheckCard =
  | "filter"
  | "issues"
  | "match"
  | "improve"
  | "confidence"
  | "other";

export const trackAtsCheckerWhyCardViewed = ({
  card,
  position,
}: {
  card: AtsWhyCheckCard;
  position: number;
}) => {
  trackEvent("cipherschools_ats_checker_why_card_viewed", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "why_check",
    card,
    position,
  });
};


/* =========================================================
   HOW IT WORKS
========================================================= */

export type AtsCheckerStep =
  | "upload"
  | "job"
  | "score";

export const trackAtsCheckerStepViewed = ({
  step,
  position,
}: {
  step: AtsCheckerStep;
  position: number;
}) => {
  trackEvent("cipherschools_ats_checker_step_viewed", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "how_it_works",
    step,
    position,
  });
};

// "Upload now" here scrolls back to the hero upload box
export const trackAtsCheckerHowItWorksUploadClicked = () => {
  trackEvent("cipherschools_ats_checker_how_it_works_upload_clicked", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "how_it_works",
    cta: "upload_now",
    destination: "hero",
    source: "how_it_works",
  });
};


/* =========================================================
   CHECK MODES
========================================================= */

export const trackAtsCheckerModeCardClicked = ({
  mode,
}: {
  mode: AtsCheckMode;
}) => {
  trackEvent("cipherschools_ats_checker_mode_card_clicked", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "check_modes",
    cta: mode === "jd" ? "resume_with_jd" : "resume_only",
    mode,
    destination: `/resume/ats-checker/scan?mode=${mode}`,
    source: "check_modes",
  });
};


/* =========================================================
   SAMPLE REPORT
========================================================= */

export type AtsSampleReportArea =
  | "overall_score"
  | "issue_severity"
  | "score_cards"
  | "section_scores"
  | "missing_keywords"
  | "other";

export const trackAtsCheckerSampleReportInteracted = ({
  area,
  action,
}: {
  area: AtsSampleReportArea;
  action: "hover" | "click" | "expand";
}) => {
  trackEvent("cipherschools_ats_checker_sample_report_interacted", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "sample_report",
    area,
    action,
  });
};


/* =========================================================
   REPORT BREAKDOWN
========================================================= */

export const trackAtsCheckerReportFeatureViewed = ({
  feature,
  position,
}: {
  feature: string;
  position: number;
}) => {
  trackEvent("cipherschools_ats_checker_report_feature_viewed", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "report_breakdown",
    feature,
    position,
  });
};


/* =========================================================
   FAQ
========================================================= */

export const trackAtsCheckerFaqToggled = ({
  question,
  position,
  action,
}: {
  question: string;
  position: number;
  action: "open" | "close";
}) => {
  trackEvent("cipherschools_ats_checker_faq_toggled", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "faq",
    question,
    position,
    action,
  });
};


/* =========================================================
   FLOATING DOCK
========================================================= */

export const trackAtsCheckerDockShown = () => {
  trackEvent("cipherschools_ats_checker_dock_shown", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "floating_dock",
    session_scope: true,
  });
};

export const trackAtsCheckerDockClicked = ({
  mode,
}: {
  mode: AtsCheckMode;
}) => {
  trackEvent("cipherschools_ats_checker_dock_clicked", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "floating_dock",
    cta: mode === "jd" ? "resume_with_jd" : "resume_only",
    mode,
    destination: `/resume/ats-checker/scan?mode=${mode}`,
    source: "floating_dock",
  });
};


/* =========================================================
   SCAN FUNNEL (LANDING → SCAN PAGE)
========================================================= */

export type AtsScanSource =
  | "hero"
  | "how_it_works"
  | "check_modes"
  | "floating_dock"
  | "resume_builder"
  | "navbar"
  | "other";

export const trackAtsCheckerScanStarted = ({
  mode,
  source,
}: {
  mode: AtsCheckMode;
  source: AtsScanSource;
}) => {
  trackEvent("cipherschools_ats_checker_scan_started", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    mode,
    source,
    destination: `/resume/ats-checker/scan?mode=${mode}`,
  });
};

export const trackAtsCheckerScanIntentAbandoned = ({
  mode,
  source,
  stage,
}: {
  mode: AtsCheckMode;
  source: AtsScanSource;
  stage:
    | "mode_selected"
    | "file_rejected"
    | "file_accepted"
    | "jd_started"
    | "jd_rejected";
}) => {
  trackEvent("cipherschools_ats_checker_scan_intent_abandoned", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    mode,
    source,
    stage,
  });
};


/* =========================================================
   FOOTER
========================================================= */

export type AtsCheckerFooterLink =
  | "home"
  | "premium"
  | "resume_builder"
  | "compiler"
  | "contact"
  | "privacy_policy"
  | "terms_of_service"
  | "linkedin"
  | "instagram"
  | "youtube"
  | "other";

export const trackAtsCheckerFooterLinkClicked = ({
  link,
}: {
  link: AtsCheckerFooterLink;
}) => {
  trackEvent("cipherschools_ats_checker_footer_link_clicked", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section: "footer",
    link,
  });
};


/* =========================================================
   OUTBOUND / NAVIGATION
========================================================= */

export const trackAtsCheckerNavigation = ({
  from,
  to,
  source,
}: {
  from: string;
  to: string;
  source?: string;
}) => {
  trackEvent("cipherschools_ats_checker_navigation", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    from,
    to,
    source,
  });
};


/* =========================================================
   ENGAGEMENT
========================================================= */

export const trackAtsCheckerEngagement = ({
  action,
  section,
  target,
}: {
  action:
    | "hover"
    | "click"
    | "expand"
    | "interaction";
  section: AtsCheckerSection;
  target?: string;
}) => {
  trackEvent("cipherschools_ats_checker_engagement", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    action,
    section,
    target,
  });
};


/* =========================================================
   EXIT / ABANDONMENT
========================================================= */

export const trackAtsCheckerLandingExit = ({
  section,
  destination,
}: {
  section?: AtsCheckerSection;
  destination?: string;
}) => {
  trackEvent("cipherschools_ats_checker_landing_exit", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section,
    destination,
  });
};


/* =========================================================
   ERRORS
========================================================= */

export const trackAtsCheckerError = ({
  section,
  error,
  code,
}: {
  section: string;
  error: string;
  code?: string | number;
}) => {
  trackEvent("cipherschools_ats_checker_error", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    section,
    error,
    code,
  });
};


/* =========================================================
   PERFORMANCE
========================================================= */

export const trackAtsCheckerPageLoadPerformance = ({
  loadTime,
}: {
  loadTime: number;
}) => {
  trackEvent("cipherschools_ats_checker_page_load_performance", {
    page: "cipherschools_ats_checker",
    product: "ats_checker",
    load_time_ms: loadTime,
  });
};
