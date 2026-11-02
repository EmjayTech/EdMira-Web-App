import { BookOpen, Flame, Home, LineChart, Play, Search, Target, User, CheckCircle2 } from 'lucide-react';
import { CourseBadge } from '@/components/ui/CourseBadge';

/**
 * A static, illustrative rendering of the EdMira dashboard for the hero —
 * crisp at any size, and always in step with the real app's look.
 * Uses titles from the sample catalog; the numbers are illustrative.
 */
export function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[640px]" aria-hidden>
      {/* Glow */}
      <div className="absolute -inset-10 -z-10 rounded-full bg-brand-500/30 blur-3xl" />

      {/* Browser window */}
      <div className="overflow-hidden rounded-[22px] border border-white/15 bg-[#0f1115] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/5">
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#161920] px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex-1 truncate rounded-md bg-white/5 px-3 py-1 text-[11px] text-white/50">edmira.org/app</div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-14 shrink-0 flex-col items-center gap-3 border-r border-white/5 bg-[#12151b] py-4 sm:flex">
            {[Home, BookOpen, LineChart, User].map((Icon, i) => (
              <div key={i} className={`grid size-9 place-items-center rounded-xl ${i === 0 ? 'bg-[#1c2748] text-[#8aa8ff]' : 'text-white/40'}`}>
                <Icon className="size-4.5" />
              </div>
            ))}
          </div>

          <div className="min-w-0 flex-1 p-4 text-left sm:p-5">
            {/* Hero card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1e4bb8] to-[#1a3478] p-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full border-2 border-white/40 bg-white/10 text-sm font-bold text-white">AO</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">Welcome back Ada,</p>
                  <p className="text-xs text-mint">300 level, Medicine &amp; Surgery</p>
                </div>
                <div className="flex items-center gap-1 rounded-xl bg-white/10 px-2.5 py-1.5 text-sm font-bold text-white">
                  <Flame className="size-4 text-orange-400" /> 5
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs text-white/60">
                <Search className="size-3.5" /> Search for topics, courses, etc.
              </div>
            </div>

            {/* Continue learning */}
            <p className="mb-2 mt-4 text-xs font-bold text-white">Continue learning</p>
            <div className="flex items-center gap-3 rounded-2xl bg-[#1a1d24] p-3">
              <CourseBadge code="PHY" color="#0F766E" size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-white">Renal Physiology</p>
                <p className="truncate text-[11px] text-white/50">Physiology</p>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[72%] rounded-full bg-[#8aa8ff]" />
                </div>
              </div>
              <div className="grid size-8 place-items-center rounded-full bg-[#8aa8ff] text-[#0a1a44]">
                <Play className="size-3.5 fill-current" />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ['12', 'Quizzes'],
                ['74%', 'Average'],
                ['8', 'Topics'],
              ].map(([n, l]) => (
                <div key={l} className="rounded-xl bg-[#1a1d24] px-2 py-2.5 text-center">
                  <p className="text-base font-extrabold text-[#8aa8ff]">{n}</p>
                  <p className="text-[10px] text-white/50">{l}</p>
                </div>
              ))}
            </div>

            {/* Focus */}
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[#3a2c0b] p-3">
              <div className="grid size-8 place-items-center rounded-xl bg-black/20 text-[#fbbf24]">
                <Target className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">1 topic needs attention</p>
                <p className="text-[11px] text-[#fde68a]/80">Averaging under 60% in practice.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating: answer card */}
      <div className="absolute -left-6 bottom-10 hidden w-64 animate-float rounded-2xl border border-black/5 bg-white p-4 text-left shadow-2xl sm:block lg:-left-14">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Question 3 of 8</p>
        <p className="mt-1 text-sm font-semibold text-[#111827]">Where is the SA node located?</p>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#15803d]/30 bg-[#dcfce7] px-3 py-2 text-sm font-medium text-[#15803d]">
          <CheckCircle2 className="size-4" /> Right atrium
        </div>
      </div>

      {/* Floating: score */}
      <div className="absolute -right-4 -top-6 hidden animate-float rounded-2xl border border-black/5 bg-white px-4 py-3 text-left shadow-2xl [animation-delay:-3s] sm:block lg:-right-10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Your score</p>
        <p className="font-display text-2xl font-extrabold text-[#0a369d]">
          88% <span className="text-sm font-semibold text-[#15803d]">Excellent!</span>
        </p>
      </div>
    </div>
  );
}
