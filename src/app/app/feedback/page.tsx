'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { formError } from '@/api/errors';
import { sendFeedback } from '@/data/learning/learningService';
import type { FeedbackArea } from '@/data/learning/types';
import { fmt, useTranslation } from '@/localization/useTranslation';
import { BackLink } from '@/components/app/BackLink';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { TextArea } from '@/components/ui/Field';
import { ErrorBanner } from '@/components/ui/States';
import { cn } from '@/utils/cn';

const AREAS: FeedbackArea[] = ['courses', 'study_material', 'quizzes', 'progress', 'account', 'other'];
const RATINGS = ['veryPoor', 'poor', 'okay', 'good', 'great'] as const;
const MIN_LENGTH = 10;

/** Product feedback (mobile FeedbackScreen). Queued and retried if offline. */
export default function FeedbackPage() {
  const { t } = useTranslation();
  const [area, setArea] = useState<FeedbackArea>('other');
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSend = message.trim().length >= MIN_LENGTH;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    setSending(true);
    setError(null);
    try {
      await sendFeedback({ area, rating, message: message.trim() });
      setSent(true);
    } catch (err) {
      setError(formError(err, t.feedback.sendFailed));
    } finally {
      setSending(false);
    }
  };

  if (sent)
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
        <div className="grid size-20 place-items-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-10" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold">{t.feedback.thanksTitle}</h1>
        <p className="mt-2 text-text-muted">{t.feedback.thanksBody}</p>
        <Link href="/app" className="mt-8 font-semibold text-link hover:underline">
          ← {t.tabs.Home}
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/app/profile">{t.tabs.Profile}</BackLink>
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{t.profile.sendFeedback}</h1>
      <p className="mt-2 text-text-muted">{t.feedback.intro}</p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-7 rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <ErrorBanner message={error} />
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">{t.feedback.aboutLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {AREAS.map(a => (
              <Chip key={a} selected={area === a} onClick={() => setArea(a)}>
                {t.feedback.areas[a]}
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold">
            {t.feedback.ratingLabel} <span className="font-normal text-text-faint">({t.common.optional})</span>
          </legend>
          <div className="grid grid-cols-5 gap-2">
            {RATINGS.map((label, i) => {
              const value = i + 1;
              const selected = rating === value;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={selected}
                  aria-label={`${value}, ${t.feedback.ratings[label]}`}
                  onClick={() => setRating(selected ? null : value)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-2xl border-2 py-3 transition-colors',
                    selected ? 'border-action bg-action text-on-action' : 'border-border hover:border-primary/40',
                  )}>
                  <span className="font-display text-xl font-extrabold">{value}</span>
                  <span className={cn('hidden text-[11px] sm:block', selected ? 'text-on-action/80' : 'text-text-muted')}>
                    {t.feedback.ratings[label]}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-text-faint">{t.feedback.ratingScale}</p>
        </fieldset>

        <TextArea
          label={t.feedback.messageLabel}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder={t.feedback.messagePlaceholder}
          maxLength={2000}
          rows={6}
          hint={message.trim().length < MIN_LENGTH ? fmt(t.feedback.minChars, { min: MIN_LENGTH }) : `${message.trim().length}/2000`}
        />

        <Button type="submit" size="lg" disabled={!canSend} loading={sending}>
          {t.profile.sendFeedback}
        </Button>
      </form>
    </div>
  );
}
