import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

import {
  FiGithub,
  FiFolder,
  FiUsers,
  FiArrowUpRight,
  FiActivity,
  FiX,
} from 'react-icons/fi'

import { SectionTitle } from '../components/SectionTitle'
import { portfolio } from '../data/portfolio'
import { useGithub } from '../hooks/useGithub'

const researchAreas = [
  'Robotics',
  'Control Systems',
  'Autonomous Navigation',
  'SLAM',
  'ROS 2',
]

export function Github() {
  const { profile, loading } = useGithub(portfolio.githubUsername)

  const [reportOpen, setReportOpen] = useState(false)

  /* =========================
     MODAL CONTROLS
  ========================== */

  useEffect(() => {
    if (!reportOpen) return

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setReportOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [reportOpen])

  return (
    <>
      <section id="github" className="section-wrap relative">

        {/* =========================
            HEADER
        ========================== */}

        <div className="relative">

          <SectionTitle
            eyebrow="06 // GitHub"
            title="Engineering in public."
            text="My GitHub profile documents ongoing work in robotics, control systems, autonomous navigation and intelligent systems."
          />

          {/* =========================
              CLICKABLE GITHUB ORB
          ========================== */}

          <a
            href="https://github.com/ruddrho"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Ruddrho Mollik GitHub profile"
            className="absolute right-8 top-[-35px] hidden lg:block"
          >
            <div className="group relative grid h-36 w-36 place-items-center">

              <div className="pointer-events-none absolute inset-0 rounded-full bg-cyan-300/10 blur-3xl transition duration-500 group-hover:bg-cyan-300/20" />

              <div className="pointer-events-none absolute inset-4 rounded-full border border-cyan-300/10 transition duration-500 group-hover:border-cyan-300/25" />

              <div className="pointer-events-none absolute inset-7 rounded-full border border-purple-400/10 transition duration-500 group-hover:border-purple-400/25" />

              <div className="relative grid h-20 w-20 place-items-center rounded-full border border-cyan-300/30 bg-[#07101e]/80 shadow-[0_0_45px_rgba(34,211,238,.15)] backdrop-blur-xl transition duration-300 group-hover:scale-110 group-hover:border-cyan-300/60 group-hover:shadow-[0_0_60px_rgba(34,211,238,.25)]">

                <FiGithub className="text-4xl text-cyan-300" />

              </div>

            </div>
          </a>

        </div>

        {/* =========================
            LOADING
        ========================== */}

        {loading && !profile && (
          <div className="glass-card p-8 font-mono text-sm text-cyan-300">
            SYNCING GITHUB PROFILE...
          </div>
        )}

        {profile && (
          <>
            {/* =========================
                MAIN PROFILE PANEL
            ========================== */}

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="glass-card relative overflow-hidden p-7 sm:p-9"
            >

              {/* Neon glows */}

              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-300/[.04] blur-3xl" />

              <div className="pointer-events-none absolute -bottom-32 right-20 h-72 w-72 rounded-full bg-purple-500/[.05] blur-3xl" />

              <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center">

                {/* =========================
                    LEFT PROFILE
                ========================== */}

                <div className="flex min-w-0 flex-1 flex-col gap-7 sm:flex-row sm:items-center">

                  {/* Avatar */}

                  <div className="relative shrink-0">

                    <div className="absolute -inset-[2px] rounded-[22px] bg-gradient-to-br from-cyan-300 via-cyan-300/30 to-purple-500 opacity-80 blur-[1px]" />

                    <img
                      src={profile.avatar_url}
                      alt={profile.name || portfolio.name}
                      className="relative h-32 w-32 rounded-[20px] border border-[#050816] object-cover sm:h-36 sm:w-36"
                    />

                    {/* Online indicator */}

                    <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#080d1a] bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />

                  </div>

                  {/* =========================
                      INFORMATION
                  ========================== */}

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                      <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                        {profile.name || portfolio.name}
                      </h3>

                      <span className="font-mono text-xs text-cyan-300">
                        @{portfolio.githubUsername}
                      </span>

                    </div>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                      {profile.bio ||
                        'Robotics, control systems and autonomous systems development.'}
                    </p>

                    {/* Research tags */}

                    <div className="mt-5 flex flex-wrap gap-2">

                      {researchAreas.map((area) => (
                        <span
                          key={area}
                          className="rounded-full border border-cyan-300/20 bg-cyan-300/[.035] px-3 py-1 font-mono text-[10px] tracking-wide text-slate-300"
                        >
                          {area}
                        </span>
                      ))}

                    </div>

                    {/* =========================
                        BUTTONS
                    ========================== */}

                    <div className="mt-6 flex flex-wrap gap-3">

                      {/* VIEW GITHUB PROFILE */}

                      <a
                        href={profile.html_url || portfolio.github}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 rounded-lg border border-cyan-300/40 bg-cyan-300/[.06] px-5 py-3 font-mono text-xs uppercase tracking-[.12em] text-cyan-300 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/70 hover:bg-cyan-300/[.1] hover:shadow-[0_0_25px_rgba(34,211,238,.12)]"
                      >

                        <FiGithub className="text-base" />

                        View GitHub Profile

                        <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

                      </a>

                      {/* =========================
                          ACTIVE DEVELOPMENT
                      ========================== */}

                      <button
                        type="button"
                        onClick={() => setReportOpen(true)}
                        className="group inline-flex items-center gap-2 rounded-lg border border-white/[.08] bg-white/[.025] px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-slate-400 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-cyan-300/[.04] hover:text-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,.08)]"
                      >

                        <FiActivity className="text-cyan-300" />

                        Active Development

                      </button>

                    </div>

                  </div>

                </div>

                {/* =========================
                    LIVE STATS
                ========================== */}

                <div className="grid grid-cols-3 gap-3 sm:gap-5 lg:min-w-[420px]">

                  {/* REPOSITORIES */}

                  <a
                    href="https://github.com/ruddrho?tab=repositories"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="View all GitHub repositories"
                    className="group relative overflow-hidden rounded-2xl border border-white/[.08] bg-white/[.025] px-3 py-7 text-center transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-cyan-300/[.04] hover:shadow-[0_0_35px_rgba(34,211,238,.08)]"
                  >

                    <FiFolder className="mx-auto text-2xl text-cyan-300 transition-transform group-hover:scale-110" />

                    <b className="mt-4 block text-3xl font-semibold text-white">
                      {profile.public_repos}
                    </b>

                    <span className="mt-2 block font-mono text-[9px] uppercase tracking-[.15em] text-slate-400">
                      Repositories
                    </span>

                    <div className="mx-auto mt-5 h-[2px] w-10 bg-cyan-300/80" />

                  </a>

                  {/* FOLLOWERS */}

                  <div className="relative overflow-hidden rounded-2xl border border-white/[.08] bg-white/[.025] px-3 py-7 text-center">

                    <FiUsers className="mx-auto text-2xl text-cyan-300" />

                    <b className="mt-4 block text-3xl font-semibold text-white">
                      {profile.followers}
                    </b>

                    <span className="mt-2 block font-mono text-[9px] uppercase tracking-[.15em] text-slate-400">
                      Followers
                    </span>

                    <div className="mx-auto mt-5 h-[2px] w-10 bg-purple-400/80" />

                  </div>

                  {/* FOLLOWING */}

                  <div className="relative overflow-hidden rounded-2xl border border-white/[.08] bg-white/[.025] px-3 py-7 text-center">

                    <FiUsers className="mx-auto text-2xl text-purple-300" />

                    <b className="mt-4 block text-3xl font-semibold text-white">
                      {profile.following}
                    </b>

                    <span className="mt-2 block font-mono text-[9px] uppercase tracking-[.15em] text-slate-400">
                      Following
                    </span>

                    <div className="mx-auto mt-5 h-[2px] w-10 bg-cyan-300/80" />

                  </div>

                </div>

              </div>

            </motion.div>

            {/* =========================
                BOTTOM STATUS LINE
            ========================== */}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-7 flex flex-col gap-4 border-t border-cyan-300/10 pt-6 font-mono text-[10px] uppercase tracking-[.18em] text-slate-500 sm:flex-row sm:items-center sm:justify-between"
            >

              <span>
                Open Source // Real Problems // Meaningful Solutions
              </span>

              <a
                href="https://github.com/ruddrho"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 transition hover:text-cyan-300"
              >

                github.com/ruddrho

                <FiArrowUpRight className="text-cyan-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

              </a>

            </motion.div>

          </>
        )}

      </section>

      {/* =====================================================
          ACTIVE DEVELOPMENT MODAL
          PORTALED DIRECTLY TO DOCUMENT.BODY
      ====================================================== */}

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>

            {reportOpen && (
              <motion.div
                key="github-report-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#02050b]/90 p-3 backdrop-blur-md sm:p-4"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    setReportOpen(false)
                  }
                }}
              >

                {/* =========================
                    MODAL WINDOW
                ========================== */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 24,
                    scale: 0.985,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 24,
                    scale: 0.985,
                  }}
                  transition={{
                    duration: 0.25,
                    ease: 'easeOut',
                  }}
                  className="flex h-[calc(100dvh-24px)] w-full max-w-[1700px] flex-col overflow-hidden rounded-[22px] border border-cyan-300/20 bg-[#070b14] shadow-[0_0_100px_rgba(34,211,238,.12)] sm:h-[calc(100dvh-32px)]"
                >

                  {/* =========================
                      MODAL HEADER
                  ========================== */}

                  <div className="flex shrink-0 items-center justify-between border-b border-white/[.07] bg-[#070b14]/95 px-5 py-4 backdrop-blur-xl sm:px-8 sm:py-5">

                    <div className="flex items-center gap-4">

                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/[.05] text-cyan-300">

                        <FiActivity className="text-xl" />

                      </div>

                      <div>

                        <div className="font-mono text-[10px] font-semibold uppercase tracking-[.22em] text-cyan-300 sm:text-xs">
                          Active Development
                        </div>

                        <div className="mt-1 text-sm text-slate-400 sm:text-base">
                          GitHub Contribution Report
                        </div>

                      </div>

                    </div>

                    {/* CLOSE */}

                    <button
                      type="button"
                      onClick={() => setReportOpen(false)}
                      aria-label="Close GitHub contribution report"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/[.08] bg-white/[.025] text-xl text-slate-400 transition duration-300 hover:border-cyan-300/30 hover:bg-cyan-300/[.05] hover:text-cyan-300"
                    >

                      <FiX />

                    </button>

                  </div>

                  {/* =========================
                      SCROLLABLE CONTENT
                  ========================== */}

                  <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">

                    <div className="mx-auto w-full max-w-[1600px] px-3 py-5 sm:px-6 sm:py-7 lg:px-8">

                      {/* =========================
                          CONTRIBUTION ACTIVITY
                      ========================== */}

                      <div className="overflow-hidden rounded-2xl border border-white/[.07] bg-[#0b0f18]">

                        {/* Small heading */}

                        <div className="flex items-center justify-between border-b border-white/[.06] px-5 py-4">

                          <span className="font-mono text-[9px] font-semibold uppercase tracking-[.22em] text-cyan-300 sm:text-[10px]">
                            Contribution Activity
                          </span>

                          <span className="hidden font-mono text-[8px] uppercase tracking-[.22em] text-slate-600 sm:block">
                            Auto Refresh // Daily
                          </span>

                        </div>

                        {/* HEATMAP IMAGE */}

                        <div className="bg-[#11111b] p-2 sm:p-4">

                          <img
                            src="https://raw.githubusercontent.com/ruddrho/ruddrho/main/assets/contribution-heatmap.svg"
                            alt="Ruddrho Mollik GitHub contribution activity"
                            className="block h-auto w-full"
                          />

                        </div>

                      </div>

                      {/* =========================
                          DETAILED ANALYTICS DIVIDER
                      ========================== */}

                      <div className="my-8 flex items-center gap-4">

                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-300/25 to-cyan-300/10" />

                        <span className="font-mono text-[8px] uppercase tracking-[.28em] text-slate-600 sm:text-[9px]">
                          Detailed Analytics
                        </span>

                        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-purple-400/25 to-purple-400/10" />

                      </div>

                      {/* =================================================
                          DETAILED CONTRIBUTION REPORT
                      ================================================= */}

                      <div className="overflow-hidden rounded-2xl border border-white/[.07] bg-[#0d1117]">

                        {/* TERMINAL TITLE */}

                        <div className="flex items-center gap-3 border-b border-white/[.07] px-5 py-5 sm:px-7">

                          <span className="font-mono text-2xl font-semibold text-cyan-300">
                            ❯
                          </span>

                          <code className="rounded-md bg-white/[.07] px-2 py-1 font-mono text-sm font-semibold text-slate-200 sm:text-xl">
                            contribution-report --detailed
                          </code>

                        </div>

                        {/* =========================
                            PROFILE DETAILS
                        ========================== */}

                        <div className="p-3 sm:p-5">

                          <img
                            src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=ruddrho&theme=tokyonight"
                            alt="Ruddrho Mollik detailed GitHub profile statistics"
                            className="block h-auto w-full rounded-xl"
                          />

                        </div>

                        {/* =========================
                            LANGUAGE CARDS
                        ========================== */}

                        <div className="grid grid-cols-1 gap-3 px-3 pb-3 sm:gap-4 sm:px-5 sm:pb-4 lg:grid-cols-2">

                          <img
                            src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=ruddrho&theme=tokyonight"
                            alt="Top GitHub languages by repository"
                            className="block h-auto w-full rounded-xl"
                          />

                          <img
                            src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=ruddrho&theme=tokyonight"
                            alt="Top GitHub languages by commit"
                            className="block h-auto w-full rounded-xl"
                          />

                        </div>

                        {/* =========================
                            STATS + PRODUCTIVE TIME
                        ========================== */}

                        <div className="grid grid-cols-1 gap-3 px-3 pb-5 sm:gap-4 sm:px-5 lg:grid-cols-2">

                          <img
                            src="https://github-profile-summary-cards.vercel.app/api/cards/stats?username=ruddrho&theme=tokyonight"
                            alt="Ruddrho Mollik GitHub statistics"
                            className="block h-auto w-full rounded-xl"
                          />

                          <img
                            src="https://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=ruddrho&theme=tokyonight&utcOffset=8"
                            alt="Ruddrho Mollik GitHub productive commit time"
                            className="block h-auto w-full rounded-xl"
                          />

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* =========================
                      MODAL FOOTER
                  ========================== */}

                  <div className="flex shrink-0 items-center justify-between border-t border-white/[.07] bg-[#070b14]/95 px-5 py-3 font-mono text-[8px] uppercase tracking-[.18em] text-slate-600 sm:px-8 sm:text-[9px]">

                    <span className="inline-flex items-center gap-2">

                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />

                      Auto-updated via GitHub Actions

                    </span>

                    <a
                      href="https://github.com/ruddrho"
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 transition hover:text-cyan-300"
                    >

                      View GitHub

                      <FiArrowUpRight className="text-cyan-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

                    </a>

                  </div>

                </motion.div>

              </motion.div>
            )}

          </AnimatePresence>,
          document.body
        )}

    </>
  )
}
