/**
 * Strings that only the web app needs (the rest come from the shared
 * en / ha / yo files copied from the mobile app).
 *
 * Only English exists so far: Hausa and Yorùbá fall back to it. When adding
 * translations, give `ha` and `yo` the same keys as `en`.
 */
export const webEn = {
  nav: {
    news: 'Campus news',
    feedback: 'Send feedback',
    getApp: 'Get the Android app',
    getAppBody: 'Practise on the go — your progress follows you.',
    backToSite: 'EdMira website',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    account: 'Account',
    skipToContent: 'Skip to content',
  },
  auth: {
    loginAside: 'Notes, practice questions and explained answers for every topic.',
    signupAside: 'Join Nigerian medical students studying smarter with EdMira.',
    signupCta: 'Sign up',
    socialSoon: 'Google sign-in is coming soon.',
    stepBack: 'Back',
    verifyCodeLabel: 'Verification code',
  },
  app: {
    sampleContent: 'Sample content — not medically reviewed. Live, reviewed content appears once connected to the EdMira server.',
    viewAll: 'View all',
    allNews: 'All campus news',
    studyThenPractise: 'Study the notes, then test yourself.',
    openMaterial: 'Open',
    keyboardHint: 'Tip: press 1–5 or A–E to choose, ← → to move between questions.',
    profileDetails: 'Profile details',
    preferences: 'Preferences',
  },
};

export type WebStrings = typeof webEn;
