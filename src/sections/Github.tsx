import { motion } from 'framer-motion'
import {
  FiGithub,
  FiFolder,
  FiUsers,
  FiArrowUpRight,
  FiActivity,
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

  return (
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

        {/* Decorative GitHub orb */}
        <div className="pointer-events-none absolute right-8 top-[-35px] hidden lg:block">

          <div className="relative grid h-36 w-36 place-items-center">

            <div className="absolute inset-0 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="absolute inset-4 rounded-full border border-cyan-300/10" />

            <div className="absolute inset-7 rounded-full border border-purple-400/10" />

            <div className="relative grid h-20 w-20 place-items-center rounded-full border border-cyan-300/30 bg-[#07101e]/80 shadow-[0_0_45px_rgba(34,211,238,.15)] backdrop-blur-xl">

              <FiGithub className="text-4xl text-cyan-300" />

            </div>

          </div>

        </div>

      </div>

      {/* Loading */}
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

                {/* Information */}
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

                  {/* Buttons */}
                  <div className="mt-6 flex flex-wrap gap-3">

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

                    <div className="inline-flex items-center gap-2 rounded-lg border border-white/[.08] bg-white/[.025] px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-slate-400">

                      <FiActivity className="text-cyan-300" />

                      Active Development

                    </div>

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
  )
}
