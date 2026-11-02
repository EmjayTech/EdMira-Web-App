/** Campus news shown in the Home carousel. */

export type NewsCategory =
  | 'admissions'
  | 'exams'
  | 'scholarships'
  | 'calendar'
  | 'clinical'
  | 'general';

export interface NewsArticle {
  id: string;
  title: string;
  /** One or two sentences, shown on the card and at the top of the article. */
  summary: string;
  /** Full text as paragraphs. Empty when the story only links out. */
  body: string[];
  category: NewsCategory;
  /** e.g. "University of Ibadan" or "All medical schools". */
  institution?: string;
  /** Publisher name, e.g. "EdMira" or the outlet the story came from. */
  source: string;
  /** Original story, opened with "Read full story". */
  sourceUrl?: string;
  /** Cover photo. Cards fall back to a branded gradient without one. */
  imageUrl?: string;
  /** ISO 8601. */
  publishedAt: string;
  /** True for local placeholder content, so the UI can label it. */
  isSample?: boolean;
}
