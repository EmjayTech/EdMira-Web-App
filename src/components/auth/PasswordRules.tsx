'use client';

import { Check, Circle } from 'lucide-react';
import { useTranslation } from '@/localization/useTranslation';
import { PASSWORD_RULES } from '@/utils/validation';
import { cn } from '@/utils/cn';

/** Live checklist of the EdMira password rules (shared with mobile). */
export function PasswordRules({ password }: { password: string }) {
  const { t } = useTranslation();
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px]">
      {PASSWORD_RULES.map(rule => {
        const ok = rule.test(password);
        return (
          <li key={rule.key} className={cn('flex items-center gap-1.5', ok ? 'text-success' : 'text-text-muted')}>
            {ok ? <Check className="size-3.5" /> : <Circle className="size-3" />}
            {t.passwordRules[rule.key]}
          </li>
        );
      })}
    </ul>
  );
}
