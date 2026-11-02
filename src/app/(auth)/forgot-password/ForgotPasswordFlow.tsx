'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowLeft, CheckCircle2, KeyRound, Mail, MailCheck } from 'lucide-react';
import { formError } from '@/api/errors';
import { requestPasswordReset, resetPassword } from '@/data/auth/authService';
import { fmt, fmtParts, useTranslation } from '@/localization/useTranslation';
import { formatDuration } from '@/utils/format';
import { isValidEmail, meetsPasswordRules } from '@/utils/validation';
import { useCountdown } from '@/hooks/useCountdown';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { CodeInput } from '@/components/auth/CodeInput';
import { PasswordRules } from '@/components/auth/PasswordRules';
import { Button, ButtonLink } from '@/components/ui/Button';
import { PasswordField, TextField } from '@/components/ui/Field';
import { ErrorBanner } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

type Step = 'email' | 'code' | 'password' | 'done';

/**
 * Email → code → new password → done, the same steps as the mobile
 * ForgotPassword screens. The backend checks the code with the new password.
 */
export function ForgotPasswordFlow() {
  const { t } = useTranslation();
  const toast = useToast();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const resend = useCountdown(RESEND_SECONDS);

  const sendCode = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!email.trim()) return setFieldError(t.validation.emailRequired);
    if (!isValidEmail(email)) return setFieldError(t.validation.emailInvalid);
    setFieldError(undefined);
    setLoading(true);
    setError(null);
    try {
      await requestPasswordReset(email.trim());
      resend.restart(RESEND_SECONDS);
      if (step === 'code') toast(t.forgot.newCodeSent);
      setStep('code');
    } catch (err) {
      setError(formError(err, step === 'code' ? t.forgot.resendFailed : t.verifyEmail.sendFailed));
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = (e: FormEvent) => {
    e.preventDefault();
    if (code.length < CODE_LENGTH) return setError(fmt(t.forgot.enterAllDigits, { count: CODE_LENGTH }));
    setError(null);
    setStep('password');
  };

  const reset = async (e: FormEvent) => {
    e.preventDefault();
    if (!meetsPasswordRules(password)) return setError(t.forgot.meetRequirements);
    if (password !== confirm) return setError(t.validation.passwordsMismatch);
    setLoading(true);
    setError(null);
    try {
      await resetPassword({ email: email.trim(), code, newPassword: password });
      setStep('done');
    } catch (err) {
      setError(formError(err, t.forgot.resetFailed));
      // A wrong or expired code is only found out here; let them fix it.
      if ((err as { response?: { status?: number } })?.response?.status === 400) setStep('code');
    } finally {
      setLoading(false);
    }
  };

  const icon = (node: React.ReactNode) => (
    <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary [&_svg]:size-7">{node}</div>
  );

  return (
    <AuthLayout>
      {step !== 'done' ? (
        <button
          onClick={() => (step === 'email' ? history.back() : setStep(step === 'password' ? 'code' : 'email'))}
          className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-link">
          <ArrowLeft className="size-4" /> {t.common.back}
        </button>
      ) : null}

      {step === 'email' ? (
        <form onSubmit={sendCode} noValidate className="flex flex-col gap-5">
          {icon(<KeyRound />)}
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">{t.auth.login.forgotPassword}</h1>
            <p className="mt-2.5 leading-relaxed text-text-muted">{t.forgot.emailSubtitle}</p>
          </div>
          <ErrorBanner message={error} />
          <TextField
            label={t.auth.email}
            type="email"
            autoComplete="email"
            autoFocus
            placeholder={t.auth.emailPlaceholder}
            leading={<Mail className="size-4.5" />}
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={fieldError}
          />
          <Button type="submit" size="lg" block loading={loading}>
            {t.forgot.sendCode}
          </Button>
          <p className="text-center text-[15px] text-text-muted">
            {t.forgot.rememberPassword}{' '}
            <Link href="/login" className="font-semibold text-link hover:underline">
              {t.auth.login.submit}
            </Link>
          </p>
        </form>
      ) : null}

      {step === 'code' ? (
        <form onSubmit={confirmCode} className="flex flex-col gap-5">
          {icon(<MailCheck />)}
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">{t.forgot.checkEmail}</h1>
            <p className="mt-2.5 leading-relaxed text-text-muted">
              {fmtParts(t.forgot.codeSentTo, {
                length: CODE_LENGTH,
                email: (
                  <strong key="e" className="font-semibold text-text">
                    {email}
                  </strong>
                ),
              })}
            </p>
          </div>
          <ErrorBanner message={error} />
          <CodeInput
            value={code}
            onChange={c => {
              setCode(c);
              setError(null);
            }}
            length={CODE_LENGTH}
            error={!!error}
            label={fmt(t.forgot.codeA11y, { count: CODE_LENGTH })}
          />
          <Button type="submit" size="lg" block disabled={code.length < CODE_LENGTH}>
            {t.common.continue}
          </Button>
          <p className="text-center text-sm text-text-muted">
            {t.forgot.didntGetCode}{' '}
            <button
              type="button"
              onClick={() => sendCode()}
              disabled={!resend.done || loading}
              className="font-semibold text-link hover:underline disabled:text-text-faint disabled:no-underline">
              {loading ? t.forgot.sending : resend.done ? t.forgot.resend : fmt(t.forgot.resendIn, { time: formatDuration(resend.left) })}
            </button>
          </p>
          <p className="text-center text-xs text-text-faint">
            {fmtParts(t.forgot.cantFind, {
              link: (
                <button key="l" type="button" onClick={() => setStep('email')} className="font-semibold text-link hover:underline">
                  {t.forgot.changeEmail}
                </button>
              ),
            })}
          </p>
        </form>
      ) : null}

      {step === 'password' ? (
        <form onSubmit={reset} noValidate className="flex flex-col gap-5">
          {icon(<KeyRound />)}
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">{t.forgot.newPasswordTitle}</h1>
            <p className="mt-2.5 leading-relaxed text-text-muted">{t.forgot.newPasswordSubtitle}</p>
          </div>
          <ErrorBanner message={error} />
          <div className="flex flex-col gap-3">
            <PasswordField
              label={t.forgot.newPassword}
              autoComplete="new-password"
              autoFocus
              placeholder={t.forgot.newPasswordPlaceholder}
              value={password}
              onChange={e => setPassword(e.target.value)}
              showLabel={t.registration.showPassword}
              hideLabel={t.registration.hidePassword}
            />
            <PasswordRules password={password} />
          </div>
          <PasswordField
            label={t.forgot.confirmNewPassword}
            autoComplete="new-password"
            placeholder={t.forgot.reenterNewPassword}
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            hint={confirm && confirm === password ? t.forgot.passwordsMatch : undefined}
            showLabel={t.registration.showPassword}
            hideLabel={t.registration.hidePassword}
          />
          <Button type="submit" size="lg" block loading={loading}>
            {t.forgot.resetPassword}
          </Button>
        </form>
      ) : null}

      {step === 'done' ? (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="grid size-20 place-items-center rounded-full bg-success-soft text-success">
            <CheckCircle2 className="size-10" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-extrabold">{t.forgot.successTitle}</h1>
          <p className="mt-2 text-text-muted">{t.forgot.successBody}</p>
          <ButtonLink href="/login" size="lg" block className="mt-8">
            {t.forgot.backToLogin}
          </ButtonLink>
        </div>
      ) : null}
    </AuthLayout>
  );
}
