'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { CheckCircle2, MailCheck } from 'lucide-react';
import { formError } from '@/api/errors';
import { resendVerificationCode, verifyEmail } from '@/data/auth/authService';
import { fmt, fmtParts, useTranslation } from '@/localization/useTranslation';
import { useSession } from '@/session/SessionProvider';
import { formatDuration } from '@/utils/format';
import { useCountdown } from '@/hooks/useCountdown';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { CodeInput } from '@/components/auth/CodeInput';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';

// Same timings as the mobile VerifyEmailScreen (and the backend).
const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;
const CODE_EXPIRY = 10 * 60;

export function VerifyEmailForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const email = useSearchParams().get('email') ?? '';
  const { setUser } = useSession();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const expiry = useCountdown(CODE_EXPIRY);
  const resend = useCountdown(RESEND_COOLDOWN);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (code.length < OTP_LENGTH) {
      setError(fmt(t.forgot.enterAllDigits, { count: OTP_LENGTH }));
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      const user = await verifyEmail(email, code);
      setSuccess(true);
      if (user) {
        setUser(user);
        setTimeout(() => router.replace('/app'), 900);
      } else {
        setTimeout(() => router.replace('/login'), 900);
      }
    } catch (err) {
      setError(formError(err, t.verifyEmail.invalidCode));
      setVerifying(false);
    }
  };

  const resendCode = async () => {
    setResending(true);
    setError(null);
    try {
      await resendVerificationCode(email);
      resend.restart(RESEND_COOLDOWN);
      expiry.restart(CODE_EXPIRY);
      setCode('');
      toast(t.forgot.newCodeSent);
    } catch (err) {
      setError(formError(err, t.verifyEmail.resendFailed));
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <AuthLayout allowSignedIn>
        <div className="flex flex-col items-center py-10 text-center">
          <div className="grid size-20 place-items-center rounded-full bg-success-soft text-success">
            <CheckCircle2 className="size-10" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-extrabold">{t.verifyEmail.successTitle}</h1>
          <p className="mt-2 text-text-muted">{t.verifyEmail.loggingIn}</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout allowSignedIn>
      <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <MailCheck className="size-7" />
      </div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">{t.verifyEmail.enterCodeTitle}</h1>
      <p className="mt-2.5 leading-relaxed text-text-muted">
        {fmtParts(t.verifyEmail.codeSent, {
          length: OTP_LENGTH,
          email: (
            <strong key="email" className="font-semibold text-text">
              {email}
            </strong>
          ),
        })}
      </p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
        <ErrorBanner message={error} />
        <CodeInput
          value={code}
          onChange={c => {
            setCode(c);
            setError(null);
          }}
          length={OTP_LENGTH}
          error={!!error}
          label={fmt(t.forgot.codeA11y, { count: OTP_LENGTH })}
        />
        <p className="text-center text-sm text-text-muted" aria-live="polite">
          {fmt(t.verifyEmail.expiresIn, { time: formatDuration(expiry.left) })}
        </p>
        <Button type="submit" size="lg" block loading={verifying} disabled={code.length < OTP_LENGTH}>
          {t.verifyEmail.verify}
        </Button>
      </form>

      <div className="mt-8 rounded-2xl bg-surface-muted p-5 text-center text-sm">
        <p className="text-text-muted">{t.verifyEmail.noCode}</p>
        <button
          onClick={resendCode}
          disabled={!resend.done || resending}
          className="mt-1 font-semibold text-link hover:underline disabled:text-text-faint disabled:no-underline">
          {resending
            ? t.forgot.sending
            : resend.done
            ? t.verifyEmail.resendLink
            : fmt(t.forgot.resendIn, { time: formatDuration(resend.left) })}
        </button>
        <p className="mt-3 text-xs text-text-faint">{t.verifyEmail.stillNoCode}</p>
      </div>
      <p className="mt-6 text-center text-sm">
        <Link href="/signup/student" className="font-semibold text-link hover:underline">
          {t.verifyEmail.changeEmail}
        </Link>
      </p>
    </AuthLayout>
  );
}
