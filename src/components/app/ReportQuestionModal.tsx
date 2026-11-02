'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { formError } from '@/api/errors';
import { reportQuestion } from '@/data/learning/learningService';
import type { ReportReason } from '@/data/learning/types';
import { useTranslation } from '@/localization/useTranslation';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { ErrorBanner } from '@/components/ui/States';
import { cn } from '@/utils/cn';

const REASONS: ReportReason[] = ['wrong_answer', 'unclear_question', 'explanation_issue', 'typo', 'other'];

/** Flag a question for the content team (mobile ReportQuestionSheet). Queued if offline. */
export function ReportQuestionModal({
  target,
  onClose,
}: {
  target: { questionId: string; topicId: string } | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    onClose();
    setTimeout(() => {
      setReason(null);
      setNote('');
      setSent(false);
      setError(null);
    }, 200);
  };

  const send = async () => {
    if (!target || !reason) return;
    setSending(true);
    setError(null);
    try {
      await reportQuestion({ ...target, reason, note: note.trim() });
      setSent(true);
    } catch (e) {
      setError(formError(e, t.report.sendFailed));
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      open={!!target}
      onClose={close}
      title={sent ? undefined : t.quiz.report}
      closeLabel={t.common.close}
      footer={
        sent ? (
          <Button onClick={close}>{t.common.done}</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={close}>
              {t.common.cancel}
            </Button>
            <Button onClick={send} disabled={!reason} loading={sending}>
              {t.report.send}
            </Button>
          </>
        )
      }>
      {sent ? (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="grid size-14 place-items-center rounded-full bg-success-soft text-success">
            <CheckCircle2 className="size-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold">{t.report.thanksTitle}</h2>
          <p className="mt-2 text-sm text-text-muted">{t.report.thanksBody}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <ErrorBanner message={error} />
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-text-body">{t.report.whatsWrong}</legend>
            <div className="flex flex-col gap-2">
              {REASONS.map(r => (
                <label
                  key={r}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-[15px] transition-colors',
                    reason === r ? 'border-primary bg-primary-soft font-medium text-primary' : 'border-border hover:bg-surface-muted',
                  )}>
                  <input
                    type="radio"
                    name="reason"
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="size-4 accent-[var(--action)]"
                  />
                  {t.report.reasons[r]}
                </label>
              ))}
            </div>
          </fieldset>
          <TextArea value={note} onChange={e => setNote(e.target.value)} placeholder={t.report.detailsPlaceholder} maxLength={1000} />
        </div>
      )}
    </Modal>
  );
}
