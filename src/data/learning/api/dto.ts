/**
 * ─── Backend JSON shapes (DTOs) and mappers ──────────────────────────────────
 *
 * The `*DTO` interfaces describe the JSON the app EXPECTS from the backend
 * (the proposed contract in docs/BACKEND_INTEGRATION.md). The `to*` functions
 * convert that JSON into the app's own types in ../types.ts.
 *
 * If the backend's real responses differ (field names, nesting, `_id`
 * instead of `id`, etc.), adapt THIS FILE ONLY — screens and the rest of the
 * data layer stay untouched.
 *
 * The mappers are deliberately forgiving: optional fields get sensible
 * defaults so a partially-populated backend still renders.
 */

import { idOf } from '@/api/envelope';
import { hashString } from '@/utils/color';
import {
  ContentStatus,
  Course,
  ResourceKind,
  StudyResource,
  CourseWithTopics,
  MaterialSection,
  Question,
  QuizAttempt,
  QuizQuestion,
  SearchResult,
  Topic,
  TopicDetail,
} from '@/data/learning/types';

// ── DTOs ─────────────────────────────────────────────────────────────────────

type Id = string | number;

export interface MaterialSectionDTO {
  heading: string;
  body: string;
  keyPoints?: string[];
}

export interface TopicDTO {
  id?: Id;
  _id?: Id;
  courseId: Id;
  title: string;
  order?: number;
  summary?: string;
  readMinutes?: number;
  /** Preferred: structured sections. */
  material?: MaterialSectionDTO[];
  /** Fallback: one block of text if the CMS stores plain content. */
  content?: string;
  status?: ContentStatus;
}

export interface CourseDTO {
  id?: Id;
  _id?: Id;
  title: string;
  description?: string;
  /** Optional — derived from the title when missing. */
  code?: string;
  /** Optional hex colour — assigned from a palette when missing. */
  color?: string;
  status?: ContentStatus;
  /** True when the course matches the student's level / department / school. */
  forYou?: boolean;
  /** Included by GET /courses and GET /courses/:id. */
  topics?: TopicDTO[];
}

export interface TopicDetailDTO {
  topic: TopicDTO;
  course: CourseDTO;
  questionCount?: number;
}

export interface QuestionDTO {
  id?: Id;
  _id?: Id;
  topicId: Id;
  stem: string;
  /** Plain strings, or objects like `{ text: "..." }`. */
  options: (string | { text: string })[];
  /** Only present AFTER submission (attempt review). */
  answerIndex?: number;
  explanation?: string;
  status?: ContentStatus;
}

export interface AttemptAnswerDTO {
  questionId: Id;
  selectedIndex: number | null;
  correct: boolean;
}

export interface AttemptDTO {
  id?: Id;
  _id?: Id;
  topicId: Id;
  courseId: Id;
  topicTitle?: string;
  courseTitle?: string;
  /** Some backends embed these instead of the titles. */
  topic?: { title: string };
  course?: { title: string };
  startedAt: string;
  submittedAt: string;
  total: number;
  correctCount: number;
  answeredCount?: number;
  score?: number;
  answers: AttemptAnswerDTO[];
}

export interface AttemptReviewDTO extends AttemptDTO {
  /** Full questions WITH answerIndex + explanation. */
  questions: QuestionDTO[];
}

export interface SearchDTO {
  courses?: CourseDTO[];
  topics?: (TopicDTO & { course?: CourseDTO })[];
}

// ── Mappers ──────────────────────────────────────────────────────────────────

const PALETTE = ['#0A369D', '#0F766E', '#7C3AED', '#C2410C', '#BE123C', '#0369A1'];

const colourFor = (key: string) => PALETTE[hashString(key) % PALETTE.length];

const wordsIn = (text: string) => text.split(/\s+/).filter(Boolean).length;

export const toTopic = (dto: TopicDTO, index = 0): Topic => {
  const material: MaterialSection[] = dto.material?.length
    ? dto.material
    : dto.content
    ? [{ heading: 'Overview', body: dto.content }]
    : [];
  const words = material.reduce(
    (n, s) => n + wordsIn(s.body) + wordsIn((s.keyPoints ?? []).join(' ')),
    0,
  );
  return {
    id: idOf(dto),
    courseId: String(dto.courseId),
    title: dto.title,
    order: dto.order ?? index + 1,
    summary: dto.summary ?? '',
    // ~200 words per minute for dense study material.
    readMinutes: dto.readMinutes ?? Math.max(1, Math.round(words / 200)),
    material,
    status: dto.status ?? 'published',
  };
};

export const toCourse = (dto: CourseDTO): Course => {
  const id = idOf(dto);
  return {
    id,
    title: dto.title,
    description: dto.description ?? '',
    code: dto.code ?? dto.title.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase(),
    color: dto.color ?? colourFor(id || dto.title),
    status: dto.status ?? 'published',
    // Servers without audience rules treat every course as the student's own.
    forYou: dto.forYou ?? true,
  };
};

export const toCourseWithTopics = (dto: CourseDTO): CourseWithTopics => ({
  ...toCourse(dto),
  topics: (dto.topics ?? [])
    .map(toTopic)
    .filter(t => t.status === 'published')
    .sort((a, b) => a.order - b.order),
});

export const toTopicDetail = (dto: TopicDetailDTO): TopicDetail => ({
  topic: toTopic(dto.topic),
  course: toCourse(dto.course),
  questionCount: dto.questionCount ?? 0,
});

const optionText = (o: string | { text: string }) => (typeof o === 'string' ? o : o.text);

export const toQuizQuestion = (dto: QuestionDTO): QuizQuestion => ({
  id: idOf(dto),
  topicId: String(dto.topicId),
  stem: dto.stem,
  options: dto.options.map(optionText),
  status: dto.status ?? 'published',
});

export const toQuestion = (dto: QuestionDTO): Question => ({
  ...toQuizQuestion(dto),
  answerIndex: dto.answerIndex ?? -1,
  explanation: dto.explanation,
});

export const toAttempt = (dto: AttemptDTO): QuizAttempt => {
  const answeredCount =
    dto.answeredCount ?? dto.answers.filter(a => a.selectedIndex !== null).length;
  return {
    id: idOf(dto),
    topicId: String(dto.topicId),
    courseId: String(dto.courseId),
    topicTitle: dto.topicTitle ?? dto.topic?.title ?? 'Topic',
    courseTitle: dto.courseTitle ?? dto.course?.title ?? '',
    startedAt: dto.startedAt,
    submittedAt: dto.submittedAt,
    total: dto.total,
    correctCount: dto.correctCount,
    answeredCount,
    score: dto.score ?? (dto.total ? Math.round((dto.correctCount / dto.total) * 100) : 0),
    answers: dto.answers.map(a => ({
      questionId: String(a.questionId),
      selectedIndex: a.selectedIndex,
      correct: a.correct,
    })),
  };
};

export const toSearchResult = (dto: SearchDTO): SearchResult => ({
  courses: (dto.courses ?? []).map(toCourseWithTopics),
  topics: (dto.topics ?? [])
    .filter(t => t.course)
    .map(t => ({ topic: toTopic(t), course: toCourse(t.course!) })),
});

// ── Study materials ──────────────────────────────────────────────────────────

export interface ResourceDTO {
  id?: Id;
  _id?: Id;
  courseId: Id;
  topicId?: Id | null;
  kind: string;
  title: string;
  description?: string;
  institution?: string;
  source?: 'file' | 'youtube' | 'link';
  file?: { name: string; size: number; mimeType: string };
  link?: string;
  youTubeId?: string;
}

const RESOURCE_KINDS: ResourceKind[] = ['slides', 'video', 'textbook', 'notes'];

export const toResource = (dto: ResourceDTO): StudyResource => ({
  id: idOf(dto),
  courseId: String(dto.courseId),
  ...(dto.topicId ? { topicId: String(dto.topicId) } : {}),
  kind: RESOURCE_KINDS.includes(dto.kind as ResourceKind) ? (dto.kind as ResourceKind) : 'notes',
  title: dto.title,
  description: dto.description ?? '',
  ...(dto.institution ? { institution: dto.institution } : {}),
  source: dto.source ?? (dto.file ? 'file' : dto.youTubeId ? 'youtube' : 'link'),
  ...(dto.file ? { file: dto.file } : {}),
  ...(dto.link ? { link: dto.link } : {}),
  ...(dto.youTubeId ? { youTubeId: dto.youTubeId } : {}),
});
