import { trackEvent } from "@/lib/data-layer";

/**
 * CipherSchools Resume Builder Landing Page Analytics
 *
 * Product:
 *   CipherSchools / Free Online Resume Builder
 *
 * Route:
 *   /resume
 *
 * Page sections identified from the landing page:
 *   - hero
 *   - why_cipherschools        (Other builders vs CipherSchools comparison)
 *   - how_it_works             (3 steps: pick template, type details, download)
 *   - ats_checker_banner
 *   - testimonials
 *   - faq
 *   - floating_dock            (sticky Build My Resume / Check My ATS Score bar)
 *   - footer
 *
 * Tracking philosophy:
 *   - Track meaningful product discovery, engagement and build intent.
 *   - Section reveal events should fire once per page/session.
 *   - CTA events include source section for attribution.
 *   - The page has two goals: start a resume (templates) and cross-sell
 *     the ATS Checker. Every CTA says which one it serves.
 */


/* =========================================================
   PAGE VIEW
========================================================= */

export const trackResumeBuilderLandingViewed = () => {
  trackEvent("cipherschools_resume_builder_landing_viewed", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    session_scope: true,
  });
};


/* =========================================================
   SECTION REVEALS
========================================================= */

export type ResumeBuilderSection =
  | "hero"
  | "why_cipherschools"
  | "how_it_works"
  | "ats_checker_banner"
  | "testimonials"
  | "faq"
  | "floating_dock"
  | "footer";

export const trackResumeBuilderSectionViewed = ({
  section,
}: {
  section: ResumeBuilderSection;
}) => {
  trackEvent("cipherschools_resume_builder_section_viewed", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section,
    session_scope: true,
  });
};


/* =========================================================
   EXPLICIT SECTION EVENTS
========================================================= */

export const trackResumeBuilderHeroViewed = () => {
  trackEvent("cipherschools_resume_builder_hero_viewed", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "hero",
    session_scope: true,
  });
};

export const trackResumeBuilderWhyCipherSchoolsViewed = () => {
  trackEvent("cipherschools_resume_builder_why_cipherschools_viewed", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "why_cipherschools",
    session_scope: true,
  });
};

export const trackResumeBuilderHowItWorksViewed = () => {
  trackEvent("cipherschools_resume_builder_how_it_works_viewed", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "how_it_works",
    session_scope: true,
  });
};

export const trackResumeBuilderAtsBannerViewed = () => {
  trackEvent("cipherschools_resume_builder_ats_banner_viewed", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "ats_checker_banner",
    session_scope: true,
  });
};

export const trackResumeBuilderTestimonialsViewed = () => {
  trackEvent("cipherschools_resume_builder_testimonials_viewed", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "testimonials",
    session_scope: true,
  });
};

export const trackResumeBuilderFaqViewed = () => {
  trackEvent("cipherschools_resume_builder_faq_viewed", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "faq",
    session_scope: true,
  });
};


/* =========================================================
   SCROLL DEPTH
========================================================= */

export type ResumeBuilderScrollDepth = 25 | 50 | 75 | 90 | 100;

export const trackResumeBuilderScrollDepth = ({
  depth,
}: {
  depth: ResumeBuilderScrollDepth;
}) => {
  trackEvent("cipherschools_resume_builder_scroll_depth", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    depth,
  });
};


/* =========================================================
   GENERIC CTA
========================================================= */

export type ResumeBuilderCTASection =
  | "navbar"
  | "hero"
  | "how_it_works"
  | "ats_checker_banner"
  | "faq"
  | "floating_dock"
  | "footer";

export type ResumeBuilderCTA =
  | "build_my_resume"
  | "start_with_template"
  | "check_my_ats_score"
  | "my_saved_resume"
  | "other";

export const trackResumeBuilderCTAClicked = ({
  cta,
  section,
  destination,
  source,
}: {
  cta: ResumeBuilderCTA;
  section: ResumeBuilderCTASection;
  destination?: string;
  source?: string;
}) => {
  trackEvent("cipherschools_resume_builder_cta_clicked", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    cta,
    section,
    destination,
    source,
  });
};


/* =========================================================
   HERO
========================================================= */

export const trackResumeBuilderHeroBuildClicked = () => {
  trackEvent("cipherschools_resume_builder_build_clicked", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "hero",
    cta: "build_my_resume",
    destination: "/resume/templates",
    source: "hero",
  });
};

export const trackResumeBuilderHeroAtsClicked = () => {
  trackEvent("cipherschools_resume_builder_ats_clicked", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "hero",
    cta: "check_my_ats_score",
    destination: "/resume/ats-checker",
    source: "hero",
  });
};

export const trackResumeBuilderSavedResumeClicked = () => {
  trackEvent("cipherschools_resume_builder_saved_resume_clicked", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "hero",
    cta: "my_saved_resume",
    destination: "/resume/saved",
  });
};

export const trackResumeBuilderHeroInteraction = ({
  action,
}: {
  action:
    | "read"
    | "sample_resume_viewed"
    | "animation"
    | "interaction";
}) => {
  trackEvent("cipherschools_resume_builder_hero_interaction", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "hero",
    action,
  });
};


/* =========================================================
   WHY CIPHERSCHOOLS (OTHER BUILDERS VS CIPHERSCHOOLS)
========================================================= */

export type ResumeBuilderComparisonTopic =
  | "formatting"
  | "writing"
  | "download"
  | "other";

export const trackResumeBuilderComparisonRowViewed = ({
  topic,
}: {
  topic: ResumeBuilderComparisonTopic;
}) => {
  trackEvent("cipherschools_resume_builder_comparison_row_viewed", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "why_cipherschools",
    topic,
  });
};


/* =========================================================
   HOW IT WORKS (3 STEPS)
========================================================= */

export type ResumeBuilderStep =
  | "pick"
  | "type"
  | "download";

export const trackResumeBuilderStepViewed = ({
  step,
  position,
}: {
  step: ResumeBuilderStep;
  position: number;
}) => {
  trackEvent("cipherschools_resume_builder_step_viewed", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "how_it_works",
    step,
    position,
  });
};

export const trackResumeBuilderStartWithTemplateClicked = () => {
  trackEvent("cipherschools_resume_builder_start_with_template_clicked", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "how_it_works",
    cta: "start_with_template",
    destination: "/resume/templates",
    source: "how_it_works",
  });
};


/* =========================================================
   ATS CHECKER BANNER (CROSS-SELL)
========================================================= */

export const trackResumeBuilderAtsBannerClicked = () => {
  trackEvent("cipherschools_resume_builder_ats_banner_clicked", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "ats_checker_banner",
    cta: "check_my_ats_score",
    destination: "/resume/ats-checker",
    source: "ats_checker_banner",
  });
};


/* =========================================================
   TESTIMONIALS
========================================================= */

export const trackResumeBuilderTestimonialViewed = ({
  position,
}: {
  position: number;
}) => {
  trackEvent("cipherschools_resume_builder_testimonial_viewed", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "testimonials",
    position,
  });
};

export const trackResumeBuilderTestimonialClicked = ({
  position,
  action,
}: {
  position: number;
  action: "open" | "next" | "previous" | "expand";
}) => {
  trackEvent("cipherschools_resume_builder_testimonial_clicked", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "testimonials",
    position,
    action,
  });
};


/* =========================================================
   FAQ
========================================================= */

export const trackResumeBuilderFaqToggled = ({
  question,
  position,
  action,
}: {
  question: string;
  position: number;
  action: "open" | "close";
}) => {
  trackEvent("cipherschools_resume_builder_faq_toggled", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "faq",
    question,
    position,
    action,
  });
};


/* =========================================================
   FLOATING DOCK
========================================================= */

export const trackResumeBuilderDockShown = () => {
  trackEvent("cipherschools_resume_builder_dock_shown", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "floating_dock",
    session_scope: true,
  });
};

export const trackResumeBuilderDockClicked = ({
  cta,
}: {
  cta: "build_my_resume" | "check_my_ats_score";
}) => {
  trackEvent("cipherschools_resume_builder_dock_clicked", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "floating_dock",
    cta,
    destination: cta === "build_my_resume" ? "/resume/templates" : "/resume/ats-checker",
    source: "floating_dock",
  });
};


/* =========================================================
   BUILD FUNNEL (LANDING → TEMPLATES → BUILDER)
========================================================= */

export type ResumeBuilderFunnelSource =
  | "hero"
  | "how_it_works"
  | "faq"
  | "floating_dock"
  | "navbar"
  | "other";

export const trackResumeBuilderTemplatesOpened = ({
  source,
}: {
  source: ResumeBuilderFunnelSource;
}) => {
  trackEvent("cipherschools_resume_builder_templates_opened", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    source,
  });
};

export const trackResumeBuilderLoginPromptShown = ({
  source,
}: {
  source: ResumeBuilderFunnelSource;
}) => {
  trackEvent("cipherschools_resume_builder_login_prompt_shown", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    source,
  });
};

export const trackResumeBuilderBuildIntentAbandoned = ({
  source,
  stage,
}: {
  source: ResumeBuilderFunnelSource;
  stage:
    | "cta_click"
    | "templates_opened"
    | "login_prompt"
    | "template_selected";
}) => {
  trackEvent("cipherschools_resume_builder_build_intent_abandoned", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    source,
    stage,
  });
};


/* =========================================================
   FOOTER
========================================================= */

export type ResumeBuilderFooterLink =
  | "home"
  | "premium"
  | "ats_checker"
  | "compiler"
  | "contact"
  | "privacy_policy"
  | "terms_of_service"
  | "linkedin"
  | "instagram"
  | "youtube"
  | "other";

export const trackResumeBuilderFooterLinkClicked = ({
  link,
}: {
  link: ResumeBuilderFooterLink;
}) => {
  trackEvent("cipherschools_resume_builder_footer_link_clicked", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section: "footer",
    link,
  });
};


/* =========================================================
   OUTBOUND / NAVIGATION
========================================================= */

export const trackResumeBuilderNavigation = ({
  from,
  to,
  source,
}: {
  from: string;
  to: string;
  source?: string;
}) => {
  trackEvent("cipherschools_resume_builder_navigation", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    from,
    to,
    source,
  });
};


/* =========================================================
   ENGAGEMENT
========================================================= */

export const trackResumeBuilderEngagement = ({
  action,
  section,
  target,
}: {
  action:
    | "hover"
    | "click"
    | "expand"
    | "interaction";
  section: ResumeBuilderSection;
  target?: string;
}) => {
  trackEvent("cipherschools_resume_builder_engagement", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    action,
    section,
    target,
  });
};


/* =========================================================
   EXIT / ABANDONMENT
========================================================= */

export const trackResumeBuilderLandingExit = ({
  section,
  destination,
}: {
  section?: ResumeBuilderSection;
  destination?: string;
}) => {
  trackEvent("cipherschools_resume_builder_landing_exit", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section,
    destination,
  });
};


/* =========================================================
   ERRORS
========================================================= */

export const trackResumeBuilderError = ({
  section,
  error,
  code,
}: {
  section: string;
  error: string;
  code?: string | number;
}) => {
  trackEvent("cipherschools_resume_builder_error", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    section,
    error,
    code,
  });
};


/* =========================================================
   PERFORMANCE
========================================================= */

export const trackResumeBuilderPageLoadPerformance = ({
  loadTime,
}: {
  loadTime: number;
}) => {
  trackEvent("cipherschools_resume_builder_page_load_performance", {
    page: "cipherschools_resume_builder",
    product: "resume_builder",
    load_time_ms: loadTime,
  });
};
