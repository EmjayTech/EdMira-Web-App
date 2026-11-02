'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Briefcase, GraduationCap, Sparkles, Users } from 'lucide-react';
import { fmt, useTranslation } from '@/localization/useTranslation';
import { AuthHeader, AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/utils/cn';

type AccountType = 'student' | 'professional' | 'hybrid';

/** Same choices as the mobile Create account screen; only students can sign up today. */
export function AccountTypePicker() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selected, setSelected] = useState<AccountType>('student');
  const [soon, setSoon] = useState<Exclude<AccountType, 'student'> | null>(null);

  const types: { key: AccountType; icon: React.ReactNode; soon?: boolean }[] = [
    { key: 'student', icon: <GraduationCap /> },
    { key: 'professional', icon: <Briefcase />, soon: true },
    { key: 'hybrid', icon: <Users />, soon: true },
  ];

  const next = () => {
    if (selected === 'student') router.push('/signup/student');
    else setSoon(selected);
  };

  return (
    <AuthLayout>
      <AuthHeader title={t.createAccount.title} subtitle={t.createAccount.subtitle} />
      <div className="flex flex-col gap-3" role="radiogroup">
        {types.map(type => {
          const copy = t.createAccount.types[type.key];
          const active = selected === type.key;
          return (
            <button
              key={type.key}
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(type.key)}
              className={cn(
                'flex items-start gap-4 rounded-2xl border-2 p-4 text-left transition-[border,background]',
                active ? 'border-primary bg-primary-soft' : 'border-border bg-surface hover:border-primary/30',
              )}>
              <span
                className={cn(
                  'grid size-11 shrink-0 place-items-center rounded-xl [&_svg]:size-5',
                  active ? 'bg-action text-on-action' : 'bg-surface-muted text-text-muted',
                )}>
                {type.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 font-semibold text-text">
                  {copy.title}
                  {type.soon ? (
                    <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-semibold text-text-muted">
                      {t.common.comingSoon}
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 block text-sm text-text-muted">{copy.description}</span>
              </span>
              <span
                className={cn('mt-1 size-5 shrink-0 rounded-full border-2', active ? 'border-[6px] border-primary' : 'border-border')}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
      <Button size="lg" block className="mt-6" onClick={next}>
        {t.common.continue} <ArrowRight className="size-4" />
      </Button>
      <p className="mt-8 text-center text-[15px] text-text-muted">
        {t.createAccount.haveAccount}{' '}
        <Link href="/login" className="font-semibold text-link hover:underline">
          {t.auth.login.submit}
        </Link>
      </p>

      <Modal open={!!soon} onClose={() => setSoon(null)} size="sm" closeLabel={t.common.close}>
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Sparkles className="size-7" />
          </div>
          <h2 className="text-xl font-bold">{t.comingSoon.title}</h2>
          <p className="mt-2 text-sm text-text-muted">
            {fmt(t.comingSoon.body, { feature: soon ? t.comingSoon[soon] : t.comingSoon.generic })}
          </p>
          <p className="mt-3 text-xs font-medium text-text-faint">{t.comingSoon.eta}</p>
          <Button block className="mt-6" onClick={() => setSoon(null)}>
            {t.common.ok}
          </Button>
        </div>
      </Modal>
    </AuthLayout>
  );
}
