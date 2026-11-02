import { isRetryable } from '@/api/errors';
import { STORAGE_KEYS } from '@/storage/keys';
import { newId, readList, writeList } from '@/storage/scopedStorage';
import { NewFeedback, NewQuestionReport } from './types';

/**
 * Offline outbox for fire-and-forget submissions (question reports, feedback).
 *
 * If sending fails because the phone is offline or the server is waking up,
 * the item is saved here and retried later (app start / coming back to the
 * app), so a student's report is never silently lost.
 */

const OUTBOX_KEY = STORAGE_KEYS.outbox;
const MAX_TRIES = 10;

export type OutboxItem =
  | { id: string; kind: 'report'; payload: NewQuestionReport; tries: number }
  | { id: string; kind: 'feedback'; payload: NewFeedback; tries: number };

type Sender = (item: OutboxItem) => Promise<void>;


export const enqueue = async (item: Omit<OutboxItem, 'id' | 'tries'>) => {
  const list = await readList<OutboxItem>(OUTBOX_KEY);
  await writeList(OUTBOX_KEY, [...list, { ...item, id: newId(), tries: 0 } as OutboxItem]);
};

let flushing = false;

/** Try to send everything waiting in the outbox. Safe to call often. */
export const flushOutbox = async (send: Sender) => {
  if (flushing) return;
  flushing = true;
  try {
    const pending = await readList<OutboxItem>(OUTBOX_KEY);
    if (!pending.length) return;
    const remaining: OutboxItem[] = [];
    for (const item of pending) {
      try {
        await send(item);
      } catch (error) {
        if (isRetryable(error) && item.tries + 1 < MAX_TRIES) {
          remaining.push({ ...item, tries: item.tries + 1 });
        }
      }
    }
    await writeList(OUTBOX_KEY, remaining);
  } finally {
    flushing = false;
  }
};
