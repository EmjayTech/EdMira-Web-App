'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { fmtParts, useTranslation } from '@/localization/useTranslation';
import { STORAGE_KEYS } from '@/storage/keys';
import { webStorage } from '@/storage/webStorage';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

/** Shown once per browser before the first dashboard visit, like the mobile app. */
export function MedicalDisclaimerModal({ forceOpen, onClose }: { forceOpen?: boolean; onClose?: () => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(!!forceOpen);

  useEffect(() => {
    if (forceOpen) return;
    webStorage.getItem(STORAGE_KEYS.medicalDisclaimerSeen).then(seen => !seen && setOpen(true));
  }, [forceOpen]);

  const close = () => {
    setOpen(false);
    webStorage.setItem(STORAGE_KEYS.medicalDisclaimerSeen, 'true');
    onClose?.();
  };

  return (
    <Modal open={open} onClose={close} dismissible={!!forceOpen} closeLabel={t.common.close}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-warning-soft text-warning">
          <ShieldAlert className="size-7" />
        </div>
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-text-muted">{t.disclaimer.title}</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-body">
          {/* {{app}} appears several times, so each copy gets its own key. */}
          {fmtParts(t.disclaimer.body, { app: 'EdMira' }).map((part, i) =>
            part === 'EdMira' ? (
              <strong key={i} className="font-bold text-primary">
                EdMira
              </strong>
            ) : (
              part
            ),
          )}
        </p>
        <Button block size="lg" className="mt-6" onClick={close}>
          {t.common.ok}
        </Button>
      </div>
    </Modal>
  );
}
