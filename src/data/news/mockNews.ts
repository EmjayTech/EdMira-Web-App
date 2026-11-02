import { NewsArticle } from './types';

/**
 * Placeholder stories for the Home news carousel until the backend feed is
 * live. They are general guidance, not real announcements, and are flagged
 * `isSample` so the UI labels them.
 */

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    category: 'admissions',
    institution: 'All universities',
    title: 'Post-UTME season: what aspiring medical students should prepare',
    summary:
      'Screening windows open at different times for each school. Here is a checklist so you are ready when yours does.',
    body: [
      'Each university sets its own post-UTME or screening timetable, and medicine is usually one of the most competitive courses. Check your chosen school’s official admissions portal regularly rather than relying on forwarded messages.',
      'Have these ready: your UTME result slip, O’level results (with the right subject combination for medicine), passport photographs, and a working email address and phone number.',
      'Only pay fees through the official portal, and keep every receipt and printout until admission is confirmed.',
    ],
    source: 'EdMira',
    publishedAt: hoursAgo(3),
    isSample: true,
  },
  {
    id: 'news-2',
    category: 'scholarships',
    institution: 'Federal & state universities',
    title: 'Scholarship season: how to find awards open to medical students',
    summary:
      'Government, state, corporate and alumni scholarships all accept medical students. Deadlines are tight, so start early.',
    body: [
      'Many scholarships for Nigerian undergraduates open once a year, and several give extra weight to students in medicine and other health sciences.',
      'Look at four places: your state scholarship board, corporate foundations, your faculty’s alumni association, and notices from your school’s student affairs office.',
      'Keep a scanned copy of your admission letter, latest results and a reference letter so you can apply within a day of a call going out.',
    ],
    source: 'EdMira',
    publishedAt: hoursAgo(20),
    isSample: true,
  },
  {
    id: 'news-3',
    category: 'clinical',
    institution: 'Teaching hospitals',
    title: 'Starting clinical postings? A first-week checklist',
    summary:
      'Moving from the lecture hall to the wards is a big step. These habits help you settle in quickly.',
    body: [
      'Arrive early for your first ward round, introduce yourself to the resident doctors, and find out how clerking is shared among your group.',
      'Carry a small notebook for cases you see. Reviewing them against your textbook the same evening is one of the fastest ways to learn.',
      'Keep practising topic questions on EdMira alongside your postings so the theory keeps pace with what you see on the ward.',
    ],
    source: 'EdMira',
    publishedAt: hoursAgo(46),
    isSample: true,
  },
  {
    id: 'news-4',
    category: 'exams',
    institution: 'Medical schools',
    title: 'Professional exams: building a revision plan that works',
    summary:
      'Spread revision across every course, practise past-question styles, and track your weak topics week by week.',
    body: [
      'Start by listing every course in your coming professional exam and how confident you feel in each one.',
      'Spend more time on your weakest topics, but touch every course each week so nothing goes cold.',
      'Use the Progress tab to see which topics are averaging under 60% and revisit them first.',
    ],
    source: 'EdMira',
    publishedAt: hoursAgo(72),
    isSample: true,
  },
  {
    id: 'news-5',
    category: 'calendar',
    institution: 'All universities',
    title: 'Semester resumption: where to find your school’s official calendar',
    summary:
      'Resumption and exam dates change often. Here is how to avoid acting on outdated or fake notices.',
    body: [
      'Rely on your university’s official website, registrar’s notices and your faculty’s verified class channels for resumption and exam dates.',
      'Be wary of screenshots with no date or source. If in doubt, confirm with your class representative or faculty office.',
    ],
    source: 'EdMira',
    publishedAt: hoursAgo(120),
    isSample: true,
  },
];
