import { useState } from 'react'
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

/* =========================================================
   GITHUB CONTRIBUTION REPORTS
========================================================= */

const contributionHeatmapUrl =
  'https://raw.githubusercontent.com/ruddrho/ruddrho/main/assets/contribution-heatmap.svg'

const detailedReportUrls = {
  profile:
    'https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=ruddrho&theme=github_dark&animation=stagger&title_color=ff0055&text_color=00d9ff&bg_color=121020&border_color=121020&icon_color=fff000&chart_color=00f5c8',

  repos:
    'https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=ruddrho&theme=github_dark&animation=load&title_color=ff0055&text_color=00d9ff&bg_color=121020&border_color=121020&icon_color=fff000&chart_color=00f5c8',

  commits:
    'https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=ruddrho&theme=github_dark&animation=load&title_color=ff0055&text_color=00d9ff&bg_color=121020&border_color=121020&icon_color=fff000&chart_color=00f5c8',

  stats:
    'https://github-profile-summary-cards.vercel.app/api/cards/stats?username=ruddrho&theme=github_dark&animation=stagger&title_color=ff0055&text_color=00d9ff&bg_color=121020&border_color=121020&icon_color=fff000&chart_color=00f5c8',

  productive:
    'https://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=ruddrho&theme=github_dark&utcOffset=8&animation=load&title_color=ff0055&text_color=00d9ff&bg_color=121020&border_color=121020&icon_color=fff000&chart_color=00f5c8',
}

/* =========================================================
   GITHUB SECTION
========================================================= */

export function Github() {
  const { profile, loading } = useGithub(portfolio.githubUsername)

  const [reportOpen, setReportOpen] = useState(false)

  return (
    <>
      <section
        id="github"
        className="section-wrap relative"
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="relative">

          <SectionTitle
            eyebrow="06 // GitHub"
            title="Engineering in public."
            text="My GitHub profile documents ongoing work in robotics, control systems, autonomous navigation and intelligent systems."
          />

          {/* =================================================
              CLICKABLE DECORATIVE GITHUB ORB
          ================================================= */}

          <a
            href={portfolio.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Open Ruddrho Mollik GitHub profile"
            title="Open GitHub Profile"
            className="absolute right-8 top-[-35px] hidden lg:block"
          >

            <div className="group relative grid h-36 w-36 place-items-center">

              {/* Outer glow */}
              <div className="pointer-events-none absolute inset-0 rounded-full bg-cyan-300/10 blur-3xl transition duration-500 group-hover:bg-cyan-300/20" />

              {/* Outer circle */}
              <div className="pointer-events-none absolute inset-4 rounded-full border border-cyan-300/10 transition duration-500 group-hover:border-cyan-300/30" />

              {/* Inner circle */}
              <div className="pointer-events-none absolute inset-7 rounded-full border border-purple-400/10 transition duration-500 group-hover:border-purple-400/30" />

              {/* GitHub button */}
              <div className="relative grid h-20 w-20 place-items-center rounded-full border border-cyan-300/30 bg-[#07101e]/80 shadow-[0_0_45px_rgba(34,211,238,.15)] backdrop-blur-xl transition duration-300 group-hover:scale-110 group-hover:border-cyan-300/70 group-hover:shadow-[0_0_60px_rgba(34,211,238,.30)]">

                <FiGithub className="text-4xl text-cyan-300 transition duration-300 group-hover:text-white" />

              </div>

            </div>

          </a>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && !profile && (
          <div className="glass-card p-8 font-mono text-sm text-cyan-300">
            SYNCING GITHUB PROFILE...
          </div>
        )}

        {/* =================================================
            PROFILE
        ================================================= */}

        {profile && (
          <>

            {/* =================================================
                MAIN PROFILE PANEL
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.55,
              }}
              className="glass-card relative overflow-hidden p-7 sm:p-9"
            >

              {/* Neon glow */}
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-300/[.04] blur-3xl" />

              <div className="pointer-events-none absolute -bottom-32 right-20 h-72 w-72 rounded-full bg-purple-500/[.05] blur-3xl" />

              <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center">

                {/* =================================================
                    LEFT PROFILE
                ================================================= */}

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

                  {/* =================================================
                      PROFILE INFORMATION
                  ================================================= */}

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
                        'Mechanical Engineering student interested in robotics, autonomous navigation, SLAM, ROS 2, and intelligent systems.'}

                    </p>

                    {/* =================================================
                        RESEARCH TAGS
                    ================================================= */}

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

                    {/* =================================================
                        BUTTONS
                    ================================================= */}

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

                      {/* =================================================
                          ACTIVE DEVELOPMENT BUTTON
                      ================================================= */}

                      <button
                        type="button"
                        onClick={() => setReportOpen(true)}
                        className="group inline-flex items-center gap-2 rounded-lg border border-white/[.08] bg-white/[.025] px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-slate-400 transition duration-300 hover:-translate-y-0.5 hover:border-purple-400/30 hover:bg-purple-400/[.05] hover:text-purple-200 hover:shadow-[0_0_25px_rgba(192,132,252,.08)]"
                      >

                        <FiActivity className="text-cyan-300 transition duration-300 group-hover:text-purple-300" />

                        Active Development

                      </button>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    LIVE STATS
                ================================================= */}

                <div className="grid grid-cols-3 gap-3 sm:gap-5 lg:min-w-[420px]">

                  {/* =================================================
                      REPOSITORIES
                  ================================================= */}

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

                  {/* =================================================
                      FOLLOWERS
                  ================================================= */}

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

                  {/* =================================================
                      FOLLOWING
                  ================================================= */}

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

            {/* =================================================
                BOTTOM STATUS LINE
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.2,
              }}
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

      {/* =========================================================
          ACTIVE DEVELOPMENT MODAL
      ========================================================= */}

      <AnimatePresence>

        {reportOpen && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#02050b]/90 p-3 backdrop-blur-md sm:p-5"
            onMouseDown={(event) => {

              if (event.target === event.currentTarget) {
                setReportOpen(false)
              }

            }}
          >

            {/* =================================================
                MODAL WINDOW
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.98,
              }}
              transition={{
                duration: 0.28,
              }}
              className="flex max-h-[94vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[24px] border border-cyan-300/20 bg-[#070b14] shadow-[0_0_100px_rgba(34,211,238,.10)]"
            >

              {/* =================================================
                  MODAL HEADER
              ================================================= */}

              <div className="flex shrink-0 items-center justify-between border-b border-white/[.07] px-5 py-4 sm:px-7">

                <div className="flex items-center gap-4">

                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/[.05]">

                    <FiActivity className="text-xl text-cyan-300" />

                  </div>

                  <div>

                    <div className="font-mono text-[10px] uppercase tracking-[.22em] text-cyan-300">
                      Active Development
                    </div>

                    <div className="mt-1 text-sm text-slate-400">
                      GitHub Contribution Report
                    </div>

                  </div>

                </div>

                {/* CLOSE BUTTON */}

                <button
                  type="button"
                  onClick={() => setReportOpen(false)}
                  aria-label="Close GitHub contribution report"
                  className="grid h-12 w-12 place-items-center rounded-xl border border-white/[.08] bg-white/[.025] text-xl text-slate-400 transition duration-300 hover:border-cyan-300/30 hover:bg-cyan-300/[.05] hover:text-white"
                >

                  <FiX />

                </button>

              </div>

              {/* =================================================
                  SCROLLABLE REPORT AREA
              ================================================= */}

              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#0d1117]">

                <div className="mx-auto w-full max-w-[1450px] space-y-8 p-4 sm:p-6 lg:p-8">

                  {/* =================================================
                      01 — CONTRIBUTION HEATMAP
                  ================================================= */}

                  <div className="overflow-hidden rounded-2xl border border-white/[.06] bg-[#10131d]">

                    <div className="flex items-center justify-between border-b border-white/[.05] px-5 py-4">

                      <div className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan-300">
                        Contribution Activity
                      </div>

                      <span className="font-mono text-[9px] uppercase tracking-[.16em] text-slate-600">
                        Auto Refresh // Daily
                      </span>

                    </div>

                    <img
                      src={contributionHeatmapUrl}
                      alt="Ruddrho Mollik GitHub contribution heatmap"
                      className="block h-auto w-full"
                    />

                  </div>

                  {/* =================================================
                      SECTION DIVIDER
                  ================================================= */}

                  <div className="flex items-center gap-4">

                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-300/20" />

                    <div className="font-mono text-[9px] uppercase tracking-[.22em] text-slate-600">
                      Detailed Analytics
                    </div>

                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-400/20" />

                  </div>

                  {/* =================================================
                      02 — DETAILED CONTRIBUTION REPORT
                  ================================================= */}

                  <div className="overflow-hidden rounded-2xl border border-white/[.06] bg-[#0d1117]">

                    {/* Terminal heading */}

                    <div className="border-b border-white/[.07] px-5 py-5 sm:px-7">

                      <div className="flex items-center gap-3 font-mono text-lg font-semibold text-slate-200 sm:text-xl">

                        <span className="text-cyan-300">
                          ❯
                        </span>

                        <span className="rounded-md bg-white/[.06] px-2 py-1">
                          contribution-report --detailed
                        </span>

                      </div>

                    </div>

                    {/* =================================================
                        REPORT CARDS
                    ================================================= */}

                    <div className="space-y-4 p-3 sm:p-5">

                      {/* PROFILE DETAILS */}

                      <div className="overflow-hidden rounded-xl">

                        <img
                          src={detailedReportUrls.profile}
                          alt="Ruddrho Mollik detailed GitHub contribution report"
                          className="block h-auto w-full"
                        />

                      </div>

                      {/* =================================================
                          LANGUAGE REPORTS
                      ================================================= */}

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                        <div className="overflow-hidden rounded-xl">

                          <img
                            src={detailedReportUrls.repos}
                            alt="Top languages by repository"
                            className="block h-auto w-full"
                          />

                        </div>

                        <div className="overflow-hidden rounded-xl">

                          <img
                            src={detailedReportUrls.commits}
                            alt="Top languages by commit"
                            className="block h-auto w-full"
                          />

                        </div>

                      </div>

                      {/* =================================================
                          STATS + PRODUCTIVE TIME
                      ================================================= */}

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                        <div className="overflow-hidden rounded-xl">

                          <img
                            src={detailedReportUrls.stats}
                            alt="GitHub statistics"
                            className="block h-auto w-full"
                          />

                        </div>

                        <div className="overflow-hidden rounded-xl">

                          <img
                            src={detailedReportUrls.productive}
                            alt="GitHub commit productive time UTC plus 8"
                            className="block h-auto w-full"
                          />

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  MODAL FOOTER
              ================================================= */}

              <div className="flex shrink-0 items-center justify-between border-t border-white/[.07] bg-[#070b14] px-5 py-4 sm:px-7">

                <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[.18em] text-slate-600 sm:text-[9px]">

                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />

                  Auto-updated via GitHub Actions

                </div>

                <a
                  href={portfolio.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.18em] text-slate-500 transition hover:text-cyan-300"
                >

                  View GitHub

                  <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

                </a>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </>
  )
}
