import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiPlus,
  FiMinus,
  FiExternalLink,
  FiCheckCircle,
  FiClock,
} from 'react-icons/fi'

import { SectionTitle } from '../components/SectionTitle'
import { activityPlaceholders } from '../data/portfolio'

export function Activities() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleSection = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <section id="activities" className="section-wrap">
      <SectionTitle
        eyebrow="04 // Academic Activity"
        title="Academic activity & technical contributions."
        text="Select a section to view verified contributions, projects, workshops, competitions, and laboratory experience."
      />

      <div className="space-y-3">
        {activityPlaceholders.map((activity, index) => {
          const isOpen = openIndex === index
          const isResearch = activity.label === 'Research Activities'

          return (
            <motion.div
              key={activity.label}
              initial={{
                opacity: 0,
                x: -18,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.05,
              }}
              className={`glass-card overflow-hidden transition-all duration-300 ${
                isOpen
                  ? 'border-cyan-300/20 bg-cyan-300/[.025]'
                  : ''
              }`}
            >
              {/* ================================
                  CLICKABLE HEADER
              ================================= */}
              <button
                type="button"
                onClick={() => toggleSection(index)}
                aria-expanded={isOpen}
                className="group flex w-full items-center gap-5 p-5 text-left"
              >
                {/* PLUS / MINUS ICON */}
                <motion.span
                  animate={{
                    rotate: isOpen ? 180 : 0,
                    scale: isOpen ? 1.05 : 1,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition-all duration-300 ${
                    isOpen
                      ? 'border-cyan-300/30 bg-cyan-300/[.08] text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,.10)]'
                      : 'border-purple-400/20 bg-purple-400/5 text-purple-300'
                  }`}
                >
                  {isOpen ? <FiMinus /> : <FiPlus />}
                </motion.span>

                {/* TITLE */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3
                      className={`font-medium transition-colors duration-300 ${
                        isOpen
                          ? 'text-cyan-100'
                          : 'text-slate-200'
                      }`}
                    >
                      {activity.label}
                    </h3>

                    {/* VERIFIED INDICATOR */}
                    {isResearch && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/15 bg-cyan-300/[.04] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[.16em] text-cyan-300/70">
                        <FiCheckCircle />
                        Public Attribution
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {isResearch
                      ? 'Technical contribution and publicly attributed robotics work.'
                      : activity.detail}
                  </p>
                </div>

                {/* STATUS */}
                <span className="hidden font-mono text-[9px] uppercase tracking-[.18em] text-slate-600 sm:block">
                  {isOpen ? 'Close' : 'View'}
                </span>
              </button>

              {/* ================================
                  EXPANDED CONTENT
              ================================= */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      height: {
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1],
                      },
                      opacity: {
                        duration: 0.22,
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/[.06] px-5 pb-6 pt-5 sm:pl-[84px] sm:pr-7">

                      {/* ============================
                          RESEARCH ACTIVITIES
                      ============================= */}
                      {isResearch ? (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: 0.08,
                            duration: 0.3,
                          }}
                        >
                          {/* META */}
                          <div className="mb-4 flex flex-wrap items-center gap-3">
                            <span className="font-mono text-[9px] uppercase tracking-[.22em] text-cyan-300">
                              Technical Contribution // RLSOK
                            </span>

                            <span className="h-1 w-1 rounded-full bg-slate-700" />

                            <span className="font-mono text-[9px] uppercase tracking-[.18em] text-slate-600">
                              Robotics
                            </span>
                          </div>

                          {/* PROJECT TITLE */}
                          <h4 className="max-w-3xl text-lg font-medium leading-7 text-slate-100 sm:text-xl">
                            A ROS 2 Vision-Guided Pick-and-Place Robotic Arm
                          </h4>

                          {/* DESCRIPTION */}
                          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-[15px]">
                            Provided architecture feedback involving camera
                            calibration, robot-camera transforms, workcell
                            setup, and object/bin mapping as
                            execution-relevant inputs for a ROS 2
                            vision-guided robotic manipulation workflow.
                          </p>

                          {/* CONTRIBUTION DETAILS */}
                          <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-white/[.06] bg-white/[.015] p-4">
                              <div className="font-mono text-[8px] uppercase tracking-[.2em] text-slate-600">
                                Contribution
                              </div>

                              <div className="mt-2 text-sm leading-6 text-slate-300">
                                Architecture Feedback
                              </div>
                            </div>

                            <div className="rounded-xl border border-white/[.06] bg-white/[.015] p-4">
                              <div className="font-mono text-[8px] uppercase tracking-[.2em] text-slate-600">
                                Technical Area
                              </div>

                              <div className="mt-2 text-sm leading-6 text-slate-300">
                                ROS 2 • Vision • Robotic Manipulation
                              </div>
                            </div>
                          </div>

                          {/* PUBLIC ATTRIBUTION BUTTON */}
                          <a
                            href={
                              'https:' +
                              '//rlsok.com/contributors#ruddrho-mollik'
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="group mt-6 inline-flex items-center gap-3 rounded-xl border border-cyan-300/20 bg-cyan-300/[.04] px-5 py-3 font-mono text-[10px] uppercase tracking-[.18em] text-cyan-200 transition-all duration-300 hover:border-cyan-300/40 hover:bg-cyan-300/[.08] hover:shadow-[0_0_25px_rgba(34,211,238,.10)]"
                          >
                            View Public Attribution

                            <FiExternalLink className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </a>
                        </motion.div>
                      ) : (
                        /* ============================
                            COMING SOON
                        ============================= */
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: 0.06,
                            duration: 0.3,
                          }}
                          className="flex items-start gap-4"
                        >
                          <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-purple-400/15 bg-purple-400/[.04] text-purple-300">
                            <FiClock />
                          </span>

                          <div>
                            <div className="font-mono text-[9px] uppercase tracking-[.2em] text-purple-300/70">
                              Coming Soon
                            </div>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                              Verified information will be added here as this
                              academic record develops.
                            </p>
                          </div>
                        </motion.div>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
