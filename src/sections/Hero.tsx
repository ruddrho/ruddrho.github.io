import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiArrowDown,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiChevronDown,
  FiFileText,
  FiGlobe,
} from 'react-icons/fi'

import { portfolio } from '../data/portfolio'
import { RobotScene } from '../components/RobotScene'

export function Hero() {
  const [cvOpen, setCvOpen] = useState(false)
  const cvMenuRef = useRef<HTMLDivElement>(null)

  // Close CV dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        cvMenuRef.current &&
        !cvMenuRef.current.contains(event.target as Node)
      ) {
        setCvOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <div className="orb orb-cyan left-[-10rem] top-[10%]" />
      <div className="orb orb-purple right-[-8rem] top-[18%]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.08fr_.92fr] lg:px-8">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          {/* Research badge */}
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/[.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[.24em] text-cyan-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee]" />

            Robotics & Control Systems // 2026
          </div>

          <p className="mb-3 font-mono text-sm tracking-[.18em] text-slate-400">
            HELLO, I&apos;M
          </p>

          <h1 className="text-5xl font-semibold leading-[.95] tracking-[-.05em] text-white sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
            {portfolio.name}
          </h1>

          <h2 className="mt-6 max-w-3xl bg-gradient-to-r from-cyan-200 via-white to-purple-300 bg-clip-text text-xl font-medium leading-8 text-transparent sm:text-2xl">
            {portfolio.title}
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            {portfolio.subtitle}
          </p>

          {/* BUTTONS */}
          <div className="mt-9 flex flex-wrap items-start gap-3">

            {/* =========================
                CV DROPDOWN
            ========================== */}
            <div
              ref={cvMenuRef}
              className="relative z-50"
            >

              {/* CV BUTTON */}
              <button
                type="button"
                onClick={() => setCvOpen((open) => !open)}
                aria-expanded={cvOpen}
                aria-haspopup="menu"
                className="btn-primary"
              >
                <FiDownload />

                CV

                <FiChevronDown
                  className={`transition-transform duration-300 ${
                    cvOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* DROPDOWN */}
              {cvOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.18,
                  }}
                  className="absolute left-0 top-[calc(100%+12px)] z-[100] w-[310px] overflow-hidden rounded-2xl border border-cyan-300/15 bg-[#080d1a]/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,.55)] backdrop-blur-xl"
                  role="menu"
                >

                  {/* Dropdown header */}
                  <div className="px-4 pb-2 pt-3 font-mono text-[9px] uppercase tracking-[.2em] text-slate-600">
                    Select CV Format
                  </div>

                  {/* EUROPASS */}
                  <button
                    type="button"
                    disabled
                    className="group flex w-full cursor-default items-center gap-4 rounded-xl p-4 text-left transition hover:bg-cyan-300/[.05]"
                  >

                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/[.05] text-lg text-cyan-300">
                      <FiFileText />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="text-sm font-medium text-white">
                        Europass CV
                      </div>

                      <div className="mt-1 font-mono text-[9px] uppercase tracking-[.14em] text-slate-500">
                        European Format
                      </div>

                    </div>

                    <span className="rounded-md border border-cyan-300/10 bg-cyan-300/[.04] px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-cyan-300/60">
                      Coming Soon
                    </span>

                  </button>

                  {/* Divider */}
                  <div className="mx-3 h-px bg-white/[.06]" />

                  {/* INTERNATIONAL */}
                  <button
                    type="button"
                    disabled
                    className="group flex w-full cursor-default items-center gap-4 rounded-xl p-4 text-left transition hover:bg-purple-400/[.05]"
                  >

                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-purple-400/20 bg-purple-400/[.05] text-lg text-purple-300">
                      <FiGlobe />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="text-sm font-medium text-white">
                        International CV
                      </div>

                      <div className="mt-1 font-mono text-[9px] uppercase tracking-[.14em] text-slate-500">
                        Worldwide Format
                      </div>

                    </div>

                    <span className="rounded-md border border-purple-400/10 bg-purple-400/[.04] px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-purple-300/60">
                      Coming Soon
                    </span>

                  </button>

                </motion.div>
              )}

            </div>

            {/* GITHUB */}
            <a
              className="btn-secondary"
              href={portfolio.github}
              target="_blank"
              rel="noreferrer"
            >
              <FiGithub />
              GitHub
            </a>

            {/* LINKEDIN */}
            <a
              className="btn-secondary"
              href={portfolio.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <FiLinkedin />
              LinkedIn
            </a>

            {/* CONTACT */}
            <a
              className="btn-secondary"
              href="#contact"
            >
              <FiMail />
              Contact
            </a>

          </div>

          {/* FOCUS / DOMAIN / METHOD */}
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-white/[.07] pt-6 font-mono text-[10px] uppercase tracking-[.16em] text-slate-500">

            <span>
              Focus
              <br />
              <b className="mt-1 block text-slate-300">
                Robotics
              </b>
            </span>

            <span>
              Domain
              <br />
              <b className="mt-1 block text-slate-300">
                Autonomy
              </b>
            </span>

            <span>
              Method
              <br />
              <b className="mt-1 block text-slate-300">
                Model → Test
              </b>
            </span>

          </div>

        </motion.div>

        {/* RIGHT ROBOT VISUAL */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.94,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1,
            delay: 0.15,
          }}
        >
          <RobotScene />
        </motion.div>

      </div>

      {/* SCROLL */}
      <a
        href="#about"
        className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2 animate-bounce text-slate-500"
        aria-label="Scroll to about"
      >
        <FiArrowDown />
      </a>

    </section>
  )
}
