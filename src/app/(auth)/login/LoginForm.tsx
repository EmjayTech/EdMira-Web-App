'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { formError } from '@/api/errors';
import { login } from '@/data/auth/authService';
import { useTranslation } from '@/localization/useTranslation';
import { useSession } from '@/session/SessionProvider';
import { STORAGE_KEYS } from '@/storage/keys';
import { webStorage } from '@/storage/webStorage';
import { isValidEmail } from '@/utils/validation';
import { AuthHeader, AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Checkbox, PasswordField, TextField } from '@/components/ui/Field';
import { ErrorBanner } from '@/components/ui/States';

/** Only same-site paths inside the app, so ?next= can't redirect elsewhere. */
const safeNext = (next: string | null) => (next && /^\/app(\/|$)/.test(next) ? next : '/app');

export function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const { setUser } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([webStorage.getItem(STORAGE_KEYS.rememberEmail), webStorage.getItem(STORAGE_KEYS.savedEmail)]).then(
      ([on, saved]) => {
        if (on === 'true' && saved) {
          setRemember(true);
          setEmail(saved);
        }
      },
    );
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!email.trim()) next.email = t.validation.emailRequired;
    else if (!isValidEmail(email)) next.email = t.validation.emailInvalid;
    if (!password) next.password = t.validation.passwordRequired;
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setSubmitError(null);
    try {
      const user = await login({ email: email.trim(), password });
      await webStorage.setItem(STORAGE_KEYS.rememberEmail, String(remember));
      await webStorage.setItem(STORAGE_KEYS.savedEmail, remember ? email.trim() : '');
      setUser(user);
      router.replace(safeNext(params.get('next')));
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      setSubmitError(
        formError(error, status === 401 ? t.auth.login.wrongCredentials : t.auth.login.failed),
      );
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader title={t.auth.login.title} subtitle={t.auth.login.subtitle} />
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <ErrorBanner message={submitError} />
        <TextField
          label={t.auth.email}
          type="email"
          autoComplete="email"
          placeholder={t.auth.emailPlaceholder}
          leading={<Mail className="size-4.5" />}
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={errors.email}
        />
        <PasswordField
          label={t.auth.password}
          autoComplete="current-password"
          placeholder={t.auth.login.passwordPlaceholder}
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={errors.password}
          showLabel={t.registration.showPassword}
          hideLabel={t.registration.hidePassword}
        />
        <div className="flex items-center justify-between gap-4">
          <Checkbox checked={remember} onChange={setRemember}>
            {t.auth.login.rememberEmail}
          </Checkbox>
          <Link href="/forgot-password" className="text-sm font-semibold text-link hover:underline">
            {t.auth.login.forgotPassword}
          </Link>
        </div>
        <Button type="submit" size="lg" block loading={loading}>
          {t.auth.login.submit}
        </Button>
      </form>
      <p className="mt-8 text-center text-[15px] text-text-muted">
        {t.auth.login.noAccount}{' '}
        <Link href="/signup" className="font-semibold text-link hover:underline">
          {t.auth.login.createAccount}
        </Link>
      </p>
    </AuthLayout>
  );
}
