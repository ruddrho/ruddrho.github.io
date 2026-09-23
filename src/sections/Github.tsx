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

export function Github() {
  const { profile, loading } = useGithub(portfolio.githubUsername)

  return (
    <section id="github" className="section-wrap">

      {/* SECTION HEADER */}
      <SectionTitle
        eyebrow="06 // GitHub"
        title="Engineering in public."
        text="My GitHub profile documents ongoing work in robotics, control systems, autonomous navigation and intelligent systems."
      />

      {/* LOADING */}
      {loading && !profile && (
        <div className="glass-card p-8 font-mono text-sm text-cyan-300">
          SYNCING GITHUB PROFILE...
        </div>
      )}

      {/* PROFILE */}
      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card relative overflow-hidden p-6 sm:p-8"
        >

          {/* BACKGROUND GLOW */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-300/[.05] blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">

            {/* =========================
                LEFT — PROFILE
            ========================== */}
            <div className="flex min-w-0 flex-1 flex-col gap-6 sm:flex-row sm:items-center">

              {/* AVATAR */}
              <div className="relative shrink-0">

                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-300/30 to-purple-500/20 blur-md" />

                <img
                  src={profile.avatar_url}
                  alt={profile.name || portfolio.name}
                  className="relative h-24 w-24 rounded-2xl border border-cyan-300/20 object-cover"
                />

                {/* GitHub badge */}
                <span className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-lg border border-cyan-300/20 bg-[#080d1a] text-cyan-300">
                  <FiGithub />
                </span>

              </div>

              {/* PROFILE INFO */}
              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-3">

                  <h3 className="text-2xl font-medium text-white">
                    {profile.name || portfolio.name}
                  </h3>

                  <span className="font-mono text-xs text-cyan-300">
                    @{portfolio.githubUsername}
                  </span>

                </div>

                {/* BIO */}
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                  {profile.bio ||
                    'Robotics, control systems and autonomous systems development.'}
                </p>

                {/* ACTIONS */}
                <div className="mt-5 flex flex-wrap gap-3">

                  {/* GitHub Profile */}
                  <a
                    href={profile.html_url || portfolio.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/[.05] px-4 py-2.5 font-mono text-xs uppercase tracking-[.12em] text-cyan-300 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-300/[.09]"
                  >
                    <FiGithub />

                    GitHub Profile

                    <FiArrowUpRight />
                  </a>

                  {/* Status */}
                  <div className="inline-flex items-center gap-2 rounded-lg border border-white/[.06] bg-white/[.02] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[.12em] text-slate-500">

                    <FiActivity className="text-cyan-300" />

                    Active Development

                  </div>

                </div>

              </div>
            </div>

            {/* =========================
                RIGHT — LIVE STATS
            ========================== */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:min-w-[330px]">

              {/* REPOSITORIES — CLICKABLE */}
              <a
                href="https://github.com/ruddrho?tab=repositories"
                target="_blank"
                rel="noreferrer"
                aria-label="View all GitHub repositories"
                className="group rounded-xl border border-white/[.06] bg-white/[.02] px-3 py-5 text-center transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-cyan-300/[.04] hover:shadow-[0_0_30px_rgba(34,211,238,.08)]"
              >

                <FiFolder className="mx-auto text-lg text-cyan-300 transition-transform duration-300 group-hover:scale-110" />

                <b className="mt-2 block text-2xl text-white">
                  {profile.public_repos}
                </b>

                <span className="font-mono text-[9px] uppercase tracking-[.16em] text-slate-500 transition-colors group-hover:text-cyan-300">
                  Repositories
                </span>

                <span className="mt-2 block font-mono text-[8px] uppercase tracking-[.14em] text-cyan-300/0 transition-colors group-hover:text-cyan-300/70">
                  View All ↗
                </span>

              </a>

              {/* FOLLOWERS */}
              <div className="rounded-xl border border-white/[.06] bg-white/[.02] px-3 py-5 text-center">

                <FiUsers className="mx-auto text-lg text-cyan-300" />

                <b className="mt-2 block text-2xl text-white">
                  {profile.followers}
                </b>

                <span className="font-mono text-[9px] uppercase tracking-[.16em] text-slate-500">
                  Followers
                </span>

              </div>

              {/* FOLLOWING */}
              <div className="rounded-xl border border-white/[.06] bg-white/[.02] px-3 py-5 text-center">

                <FiUsers className="mx-auto text-lg text-purple-300" />

                <b className="mt-2 block text-2xl text-white">
                  {profile.following}
                </b>

                <span className="font-mono text-[9px] uppercase tracking-[.16em] text-slate-500">
                  Following
                </span>

              </div>

            </div>

          </div>

        </motion.div>
      )}

    </section>
  )
}
