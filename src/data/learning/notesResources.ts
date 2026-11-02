import type { StudyResource } from './types';

/**
 * Downloadable notes: the server builds a PDF of a topic's notes (or all of a
 * course's) on request. They appear as the first study material so they get
 * the same download button and offline Downloads entry as uploaded files.
 * Their ids start with "notes:" so the download service knows which link to ask for.
 */
const PDF = 'application/pdf';

export const topicNotesResource = (
  topic: { id: string; title: string },
  courseId: string,
  title: string,
): StudyResource => ({
  id: `notes:topic:${topic.id}`,
  courseId,
  topicId: topic.id,
  kind: 'notes',
  title,
  description: '',
  source: 'file',
  file: { name: `${topic.title}.pdf`, size: 0, mimeType: PDF },
});

export const courseNotesResource = (course: { id: string; title: string }, title: string): StudyResource => ({
  id: `notes:course:${course.id}`,
  courseId: course.id,
  kind: 'notes',
  title,
  description: '',
  source: 'file',
  file: { name: `${course.title}.pdf`, size: 0, mimeType: PDF },
});

/** "notes:topic:<id>" → { scope: 'topic', id } */
export const notesTarget = (resourceId: string) => {
  const m = resourceId.match(/^notes:(topic|course):([0-9a-f]{24})$/i);
  return m ? { scope: m[1] as 'topic' | 'course', id: m[2] } : null;
};
