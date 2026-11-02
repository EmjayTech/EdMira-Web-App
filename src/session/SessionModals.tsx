'use client';

import { Clock, LogOut } from 'lucide-react';
import { useTranslation, fmt } from '@/localization/useTranslation';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { ExpiredReason } from './SessionProvider';

export function SessionWarningModal({
  visible,
  secondsLeft,
  loggingOut,
  onStay,
  onLogout,
}: {
  visible: boolean;
  secondsLeft: number;
  loggingOut: boolean;
  onStay: () => void;
  onLogout: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Modal open={visible} onClose={onStay} dismissible={false} size="sm">
      <div className="flex flex-col items-center pt-2 text-center">
        <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-warning-soft text-warning">
          <Clock className="size-7" />
        </div>
        <h2 className="text-xl font-bold">{t.session.stillThereTitle}</h2>
        <p className="mt-2 text-sm text-text-muted">{t.session.stillThereBody}</p>
        <p
          className="my-4 font-display text-5xl font-extrabold tabular-nums text-primary"
          aria-label={fmt(t.session.secondsA11y, { count: secondsLeft })}
          aria-live="polite">
          {secondsLeft}s
        </p>
        <div className="flex w-full flex-col gap-2">
          <Button block onClick={onStay}>
            {t.session.stay}
          </Button>
          <Button block variant="ghost" onClick={onLogout} loading={loggingOut} icon={<LogOut className="size-4" />}>
            {t.profile.logout}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function SessionExpiredModal({
  reason,
  onDismiss,
}: {
  reason: ExpiredReason | null;
  onDismiss: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Modal
      open={!!reason}
      onClose={onDismiss}
      size="sm"
      title={t.session.expiredTitle}
      closeLabel={t.common.close}
      footer={<Button onClick={onDismiss}>{t.common.ok}</Button>}>
      <p className="text-sm text-text-muted">
        {reason === 'idle' ? t.session.expiredIdle : t.session.expiredMax}
      </p>
    </Modal>
  );
}
