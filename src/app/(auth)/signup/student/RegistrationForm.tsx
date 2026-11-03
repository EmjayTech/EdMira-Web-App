'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { formError } from '@/api/errors';
import { signup } from '@/data/auth/authService';
import {
  COUNTRIES,
  DEFAULT_ACADEMIC_OPTIONS,
  DEFAULT_COUNTRY,
  getAcademicOptions,
} from '@/data/reference/referenceService';
import type { AcademicOptions, ProgrammeType } from '@/data/reference/types';
import { fmt, fmtParts, useTranslation } from '@/localization/useTranslation';
import type { TranslationKeys } from '@/types/localization';
import { isValidEmail, PHONE_PATTERN } from '@/utils/validation';
import { useLevelLabel } from '@/hooks/useLevelLabel';
import { AuthHeader, AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordRules } from '@/components/auth/PasswordRules';
import { Button } from '@/components/ui/Button';
import { Checkbox, PasswordField, TextField } from '@/components/ui/Field';
import { SelectField } from '@/components/ui/SelectField';
import { Chip } from '@/components/ui/Chip';
import { ErrorBanner } from '@/components/ui/States';
import { cn } from '@/utils/cn';

// Same three steps and rules as the mobile RegistrationScreen.
const STEPS = ['personal', 'academic', 'security'] as const;

type ErrorKey = keyof TranslationKeys['registration']['errors'];

interface FormValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  countryCode: string;
  institution: string;
  faculty: string;
  department: string;
  levelType: ProgrammeType | '';
  level: string;
  referralCode: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

type Errors = Partial<Record<keyof FormValues, ErrorKey>>;

const validateStep = (step: number, v: FormValues): Errors => {
  const e: Errors = {};
  if (step === 0) {
    if (!v.firstName.trim()) e.firstName = 'firstNameRequired';
    if (!v.lastName.trim()) e.lastName = 'lastNameRequired';
    if (!v.username.trim()) e.username = 'usernameRequired';
    if (!v.email.trim()) e.email = 'emailRequired';
    else if (!isValidEmail(v.email)) e.email = 'emailInvalid';
    if (!v.phone) e.phone = 'phoneRequired';
    else if (!PHONE_PATTERN.test(v.phone)) e.phone = 'phoneInvalid';
  }
  if (step === 1) {
    if (!v.institution) e.institution = 'institutionRequired';
    if (!v.faculty) e.faculty = 'facultyRequired';
    if (!v.department) e.department = 'departmentRequired';
    if (!v.levelType) e.levelType = 'programmeRequired';
    if (!v.level) e.level = 'levelRequired';
  }
  if (step === 2) {
    const p = v.password;
    if (!p) e.password = 'passwordRequired';
    else if (p.length < 8) e.password = 'passwordMin';
    else if (!/[A-Z]/.test(p)) e.password = 'passwordUppercase';
    else if (!/[a-z]/.test(p)) e.password = 'passwordLowercase';
    else if (!/[0-9]/.test(p)) e.password = 'passwordNumber';
    else if (!/[^A-Za-z0-9]/.test(p)) e.password = 'passwordSpecial';
    if (!v.confirmPassword) e.confirmPassword = 'confirmRequired';
    else if (v.confirmPassword !== p) e.confirmPassword = 'passwordsMismatch';
    if (!v.agreedToTerms) e.agreedToTerms = 'termsRequired';
  }
  return e;
};

export function RegistrationForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const levelLabel = useLevelLabel();
  const [step, setStep] = useState(0);
  const [options, setOptions] = useState<AcademicOptions>(DEFAULT_ACADEMIC_OPTIONS);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [v, setValues] = useState<FormValues>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    countryCode: DEFAULT_COUNTRY.dialCode,
    institution: '',
    faculty: '',
    department: '',
    levelType: '',
    level: '',
    referralCode: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  useEffect(() => {
    getAcademicOptions().then(setOptions);
  }, []);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const err = (key: keyof FormValues) => (errors[key] ? t.registration.errors[errors[key]!] : undefined);

  const groupLabel = {
    federal: t.registration.federalUniversities,
    state: t.registration.stateUniversities,
    private: t.registration.privateUniversities,
  };

  const institutionOptions = useMemo(
    () =>
      (['federal', 'state', 'private'] as const).flatMap(category =>
        options.institutions
          .filter(i => i.category === category)
          .map(i => ({ value: i.name, label: i.name, group: groupLabel[category] })),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options, t],
  );

  const levels = options.programmes.find(p => p.type === v.levelType)?.levels ?? [];

  const goNext = async (e: FormEvent) => {
    e.preventDefault();
    const stepErrors = validateStep(step, v);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length) return;
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const referralCode = v.referralCode.trim();
      const email = v.email.trim();
      await signup({
        firstName: v.firstName.trim(),
        lastName: v.lastName.trim(),
        username: v.username.trim(),
        email,
        password: v.password,
        userType: 'STUDENT',
        countryCode: v.countryCode,
        phoneNumber: v.phone,
        studentProfile: {
          institution: v.institution,
          faculty: v.faculty,
          department: v.department,
          levelType: v.levelType,
          level: v.level,
        },
        ...(referralCode ? { referralCode } : {}),
      });
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setSubmitError(formError(error, t.registration.failed));
      setSubmitting(false);
    }
  };

  const stepCopy = t.registration.steps[STEPS[step]];

  return (
    <AuthLayout>
      {/* Stepper */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="inline-flex items-center gap-1 font-semibold text-link">
              <ArrowLeft className="size-4" /> {t.common.back}
            </button>
          ) : (
            <Link href="/signup" className="inline-flex items-center gap-1 font-semibold text-link">
              <ArrowLeft className="size-4" /> {t.common.back}
            </Link>
          )}
          <span className="font-medium text-text-muted">
            {fmt(t.registration.stepOf, { step: step + 1, total: STEPS.length })}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className={cn('h-1.5 rounded-full transition-colors', i <= step ? 'bg-action' : 'bg-surface-muted')} />
          ))}
        </div>
      </div>

      <AuthHeader title={stepCopy.title} subtitle={stepCopy.subtitle} />

      <form onSubmit={goNext} noValidate className="flex flex-col gap-5">
        <ErrorBanner message={submitError} />

        {step === 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label={t.editProfile.firstName}
                autoComplete="given-name"
                placeholder={t.registration.firstNamePlaceholder}
                value={v.firstName}
                onChange={e => set('firstName', e.target.value)}
                error={err('firstName')}
              />
              <TextField
                label={t.editProfile.lastName}
                autoComplete="family-name"
                placeholder={t.registration.lastNamePlaceholder}
                value={v.lastName}
                onChange={e => set('lastName', e.target.value)}
                error={err('lastName')}
              />
            </div>
            <TextField
              label={t.registration.username}
              autoComplete="username"
              placeholder={t.registration.usernamePlaceholder}
              value={v.username}
              onChange={e => set('username', e.target.value.replace(/\s/g, ''))}
              error={err('username')}
              hint={t.registration.usernameHelper}
            />
            <TextField
              label={t.registration.emailAddress}
              type="email"
              autoComplete="email"
              placeholder={t.auth.emailPlaceholder}
              value={v.email}
              onChange={e => set('email', e.target.value)}
              error={err('email')}
            />
            <div className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)]">
              <SelectField
                label={t.registration.selectCountry}
                placeholder={t.registration.selectCountry}
                value={v.countryCode}
                onChange={value => set('countryCode', value)}
                searchPlaceholder={t.registration.search}
                options={COUNTRIES.map(c => ({ value: c.dialCode, label: `${c.flag} ${c.dialCode}  ${c.name}` }))}
              />
              <TextField
                label={t.registration.phone}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="8012345678"
                value={v.phone}
                onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                error={err('phone')}
              />
            </div>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <SelectField
              label={t.registration.institution}
              placeholder={t.registration.selectInstitution}
              value={v.institution}
              onChange={value => set('institution', value)}
              options={institutionOptions}
              searchPlaceholder={t.registration.search}
              error={err('institution')}
            />
            <SelectField
              label={t.registration.faculty}
              placeholder={t.registration.selectFaculty}
              value={v.faculty}
              onChange={value => set('faculty', value)}
              options={options.faculties.map(f => ({ value: f, label: f }))}
              searchPlaceholder={t.registration.search}
              error={err('faculty')}
            />
            <SelectField
              label={t.editProfile.department}
              placeholder={t.registration.selectDepartment}
              value={v.department}
              onChange={value => set('department', value)}
              options={options.departments.map(d => ({ value: d, label: d }))}
              searchPlaceholder={t.registration.search}
              error={err('department')}
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-text-body">{t.registration.programme}</span>
              <div className="flex gap-2">
                {options.programmes.map(p => (
                  <Chip
                    key={p.type}
                    selected={v.levelType === p.type}
                    onClick={() => {
                      set('levelType', p.type);
                      set('level', '');
                    }}>
                    {p.type === 'Undergraduate' ? t.registration.undergraduate : t.registration.postgraduate}
                  </Chip>
                ))}
              </div>
              {err('levelType') ? <p className="text-[13px] text-error">{err('levelType')}</p> : null}
            </div>
            <SelectField
              label={t.editProfile.level}
              placeholder={v.levelType ? t.registration.selectLevel : t.registration.chooseProgrammeFirst}
              value={v.level}
              disabled={!v.levelType}
              onChange={value => set('level', value)}
              options={levels.map(l => ({ value: l, label: levelLabel(l) }))}
              error={err('level')}
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className="flex flex-col gap-3">
              <PasswordField
                label={t.registration.createPassword}
                autoComplete="new-password"
                placeholder={t.forgot.enterNewPassword}
                value={v.password}
                onChange={e => set('password', e.target.value)}
                error={err('password')}
                showLabel={t.registration.showPassword}
                hideLabel={t.registration.hidePassword}
              />
              <PasswordRules password={v.password} />
            </div>
            <PasswordField
              label={t.registration.confirmPassword}
              autoComplete="new-password"
              placeholder={t.registration.reenterPassword}
              value={v.confirmPassword}
              onChange={e => set('confirmPassword', e.target.value)}
              error={err('confirmPassword')}
              showLabel={t.registration.showPassword}
              hideLabel={t.registration.hidePassword}
            />
            <TextField
              label={t.registration.referralCode}
              optional={t.common.optional}
              placeholder={t.registration.referralPlaceholder}
              value={v.referralCode}
              onChange={e => set('referralCode', e.target.value)}
              hint={t.registration.referralHelper}
            />
            <Checkbox checked={v.agreedToTerms} onChange={c => set('agreedToTerms', c)} error={err('agreedToTerms')}>
              {fmtParts(t.registration.agree, {
                terms: (
                  <Link key="terms" href="/terms" target="_blank" className="font-semibold text-link hover:underline">
                    {t.registration.terms}
                  </Link>
                ),
                privacy: (
                  <Link key="privacy" href="/privacy" target="_blank" className="font-semibold text-link hover:underline">
                    {t.registration.privacy}
                  </Link>
                ),
              })}
            </Checkbox>
          </>
        ) : null}

        <Button type="submit" size="lg" block loading={submitting} className="mt-2">
          {step < STEPS.length - 1 ? (
            <>
              {t.common.next} <ArrowRight className="size-4" />
            </>
          ) : (
            t.createAccount.title
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-[15px] text-text-muted">
        {t.createAccount.haveAccount}{' '}
        <Link href="/login" className="font-semibold text-link hover:underline">
          {t.auth.login.submit}
        </Link>
      </p>
    </AuthLayout>
  );
}
