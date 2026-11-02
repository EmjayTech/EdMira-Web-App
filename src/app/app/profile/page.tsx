'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, Flag, Info, LogOut, MessageSquareHeart, PenLine, ShieldAlert, Smartphone } from 'lucide-react';
import { useTranslation } from '@/localization/useTranslation';
import { useSession } from '@/session/SessionProvider';
import { SITE } from '@/config/site';
import { useLevelLabel } from '@/hooks/useLevelLabel';
import { Avatar } from '@/components/app/Avatar';
import { LanguageMenu } from '@/components/app/LanguageMenu';
import { ThemeToggle } from '@/components/app/ThemeToggle';
import { MedicalDisclaimerModal } from '@/components/app/MedicalDisclaimerModal';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

/** The web version of the mobile ProfileScreen. */
export default function ProfilePage() {
  const { t, w } = useTranslation();
  const { user, signOut } = useSession();
  const levelLabel = useLevelLabel();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const profile = user?.studentProfile;

  return (
    <div className="mx-auto max-w-3xl">
      <section className="relative overflow-hidden rounded-3xl bg-hero p-6 text-on-hero sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(60%_120%_at_100%_0%,rgba(126,223,178,0.2),transparent_60%)]" />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Avatar user={user} className="size-20 border-2 border-white/40 bg-white/10 text-2xl text-white" />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-white/75">{user?.email}</p>
            {profile ? (
              <p className="mt-2 text-sm font-medium text-accent">
                {[levelLabel(profile.level), profile.department, profile.institution].filter(Boolean).join(' · ')}
              </p>
            ) : null}
          </div>
          <Link
            href="/app/profile/edit"
            className="inline-flex items-center gap-2 rounded-xl border border-hero-control-border bg-hero-control px-4 py-2.5 text-sm font-semibold hover:brightness-110">
            <PenLine className="size-4" /> {t.common.edit}
          </Link>
        </div>
      </section>

      <Section title={t.profile.sections.account}>
        <Row href="/app/profile/edit" icon={<PenLine />} label={t.profile.editProfile} />
      </Section>

      <Section title={w.app.preferences}>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <span className="font-medium">{t.language.title}</span>
          <LanguageMenu />
        </div>
        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium">{t.appearance.title}</span>
          <ThemeToggle withLabels />
        </div>
      </Section>

      <Section title={t.profile.sections.help}>
        <Row href="/app/feedback" icon={<MessageSquareHeart />} label={t.profile.sendFeedback} />
        <Row href="/app/feedback" icon={<Flag />} label={t.profile.reportProblem} />
      </Section>

      <Section title={t.profile.sections.about}>
        <Row onClick={() => setShowDisclaimer(true)} icon={<ShieldAlert />} label={t.profile.medicalDisclaimer} />
        <Row onClick={() => setShowAbout(true)} icon={<Info />} label={t.profile.aboutApp} />
        <Row href={SITE.playStoreUrl} external icon={<Smartphone />} label={w.nav.getApp} />
      </Section>

      <Button variant="secondary" block size="lg" className="mt-8 text-danger" icon={<LogOut className="size-4" />} onClick={() => setConfirmLogout(true)}>
        {t.profile.logout}
      </Button>

      <Modal
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        size="sm"
        title={t.profile.logoutTitle}
        description={t.profile.logoutMessage}
        closeLabel={t.common.close}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmLogout(false)}>
              {t.common.cancel}
            </Button>
            <Button
              variant="danger"
              loading={loggingOut}
              onClick={async () => {
                setLoggingOut(true);
                await signOut(null);
              }}>
              {t.profile.logoutConfirm}
            </Button>
          </>
        }
      />
      {showDisclaimer ? <MedicalDisclaimerModal forceOpen onClose={() => setShowDisclaimer(false)} /> : null}
      <Modal open={showAbout} onClose={() => setShowAbout(false)} size="sm" title={t.profile.aboutApp} closeLabel={t.common.close}>
        <p className="text-text-body">{t.profile.aboutBody}</p>
      </Modal>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.14em] text-text-faint">{title}</h2>
      <div className="divide-y divide-divider overflow-hidden rounded-2xl border border-border bg-surface">{children}</div>
    </section>
  );
}

function Row({
  href,
  onClick,
  icon,
  label,
  external,
}: {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary [&_svg]:size-4.5">{icon}</span>
      <span className="flex-1 text-left font-medium">{label}</span>
      <ChevronRight className="size-5 text-text-faint" />
    </>
  );
  const cls = 'flex w-full items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-muted';
  if (href && external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {content}
      </a>
    );
  if (href)
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  return (
    <button onClick={onClick} className={cls}>
      {content}
    </button>
  );
}
