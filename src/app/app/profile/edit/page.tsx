'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { formError } from '@/api/errors';
import { updateProfile } from '@/data/auth/authService';
import { DEFAULT_ACADEMIC_OPTIONS, getAcademicOptions } from '@/data/reference/referenceService';
import type { AcademicOptions } from '@/data/reference/types';
import { useTranslation } from '@/localization/useTranslation';
import { useSession } from '@/session/SessionProvider';
import { levelNumber } from '@/utils/format';
import { useLevelLabel } from '@/hooks/useLevelLabel';
import { BackLink } from '@/components/app/BackLink';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { TextField } from '@/components/ui/Field';
import { SelectField } from '@/components/ui/SelectField';
import { ErrorBanner } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';

/** Edit name and academic info (mobile EditProfileScreen, US-03 / US-04). */
export default function EditProfilePage() {
  const { t, w } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const levelLabel = useLevelLabel();
  const { user, setUser } = useSession();
  const [options, setOptions] = useState<AcademicOptions>(DEFAULT_ACADEMIC_OPTIONS);
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [institution, setInstitution] = useState(user?.studentProfile?.institution ?? '');
  const [department, setDepartment] = useState(user?.studentProfile?.department ?? '');
  const [level, setLevel] = useState(user?.studentProfile?.level ?? '');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAcademicOptions().then(setOptions);
  }, []);

  // The student's programme decides which levels are offered.
  const isPostgrad = user?.studentProfile?.levelType === 'Postgraduate' || (!!level && !levelNumber(level));
  const levels = options.programmes.find(p => p.type === (isPostgrad ? 'Postgraduate' : 'Undergraduate'))?.levels ?? [];
  const sameLevel = (a: string, b: string) => (levelNumber(a) ?? a) === (levelNumber(b) ?? b);

  const institutionOptions = useMemo(
    () => options.institutions.map(i => ({ value: i.name, label: i.name })),
    [options],
  );

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!firstName.trim()) next.firstName = t.editProfile.firstNameRequired;
    if (!lastName.trim()) next.lastName = t.editProfile.lastNameRequired;
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        studentProfile: {
          ...(institution ? { institution } : {}),
          ...(department ? { department } : {}),
          ...(level ? { level } : {}),
        },
      });
      setUser(updated);
      toast(t.editProfile.save);
      router.push('/app/profile');
    } catch (err) {
      setError(formError(err, t.editProfile.saveFailed));
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/app/profile">{t.tabs.Profile}</BackLink>
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{t.editProfile.title}</h1>

      <form onSubmit={save} noValidate className="mt-8 flex flex-col gap-8">
        <ErrorBanner message={error} />

        <fieldset className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <legend className="sr-only">{w.app.profileDetails}</legend>
          <p className="text-xs font-bold tracking-[0.14em] text-text-faint">{t.editProfile.personal}</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <TextField label={t.editProfile.firstName} value={firstName} onChange={e => setFirstName(e.target.value)} error={errors.firstName} autoComplete="given-name" />
            <TextField label={t.editProfile.lastName} value={lastName} onChange={e => setLastName(e.target.value)} error={errors.lastName} autoComplete="family-name" />
          </div>
          <div className="mt-5">
            <TextField label={t.auth.email} value={user?.email ?? ''} readOnly disabled hint={t.editProfile.emailHint} />
          </div>
        </fieldset>

        <fieldset className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <p className="text-xs font-bold tracking-[0.14em] text-text-faint">{t.editProfile.academic}</p>
          <p className="mt-2 text-sm text-text-muted">{t.editProfile.academicHint}</p>
          <div className="mt-5 flex flex-col gap-5">
            <SelectField
              label={t.editProfile.university}
              placeholder={t.editProfile.universityPlaceholder}
              value={institution}
              onChange={setInstitution}
              options={institutionOptions}
              searchPlaceholder={t.registration.search}
            />
            <SelectField
              label={t.editProfile.department}
              placeholder={t.editProfile.departmentPlaceholder}
              value={department}
              onChange={setDepartment}
              options={options.departments.map(d => ({ value: d, label: d }))}
              searchPlaceholder={t.registration.search}
            />
            <div>
              <p className="mb-2 text-sm font-medium text-text-body">{t.editProfile.level}</p>
              <div className="flex flex-wrap gap-2">
                {levels.map(l => (
                  <Chip key={l} selected={sameLevel(level, l)} onClick={() => setLevel(l)}>
                    {levelNumber(l) ? levelLabel(l, t.editProfile.levelChip) : l}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </fieldset>

        <Button type="submit" size="lg" loading={saving}>
          {t.editProfile.save}
        </Button>
      </form>
    </div>
  );
}
