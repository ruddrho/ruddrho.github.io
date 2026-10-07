import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiCpu,
  FiCode,
  FiActivity,
  FiBox,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'

import { SectionTitle } from '../components/SectionTitle'
import { skillGroups } from '../data/portfolio'

const icons = [FiCpu, FiActivity, FiCode, FiBox, FiEye]

export function Skills() {
  const [activeIndex, setActiveIndex] = useState(0)

  const total = skillGroups.length

  // =========================================================
  // AUTO ROTATION
  // =========================================================

  useEffect(() => {
    if (total <= 1) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total)
    }, 4500)

    return () => {
      window.clearInterval(interval)
    }
  }, [total])

  // =========================================================
  // NAVIGATION
  // =========================================================

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % total)
  }

  const previousSlide = () => {
    setActiveIndex((current) => (current - 1 + total) % total)
  }

  // =========================================================
  // CIRCULAR POSITION
  // =========================================================

  const getOffset = (index: number) => {
    let offset = index - activeIndex

    if (offset > total / 2) {
      offset -= total
    }

    if (offset < -total / 2) {
      offset += total
    }

    return offset
  }

  // =========================================================
  // CARD POSITION
  // Active card remains EXACTLY in the center.
  // Other cards move around the center card.
  // =========================================================

  const getCardAnimation = (offset: number) => {
    // CENTER
    if (offset === 0) {
      return {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        rotateY: 0,
      }
    }

    // LEFT
    if (offset === -1) {
      return {
        x: -440,
        y: 50,
        scale: 0.8,
        opacity: 0.32,
        rotateY: 10,
      }
    }

    // RIGHT
    if (offset === 1) {
      return {
        x: 440,
        y: 50,
        scale: 0.8,
        opacity: 0.32,
        rotateY: -10,
      }
    }

    // FAR LEFT
    if (offset <= -2) {
      return {
        x: -700,
        y: 110,
        scale: 0.62,
        opacity: 0.06,
        rotateY: 18,
      }
    }

    // FAR RIGHT
    return {
      x: 700,
      y: 110,
      scale: 0.62,
      opacity: 0.06,
      rotateY: -18,
    }
  }

  if (total === 0) {
    return null
  }

  return (
    <section
      id="skills"
      className="section-wrap relative overflow-hidden"
    >
      {/* =====================================================
          SECTION TITLE
      ====================================================== */}

      <SectionTitle
        eyebrow="02 // Technical Stack"
        title="Systems thinking across the robotics pipeline."
        text="Core areas are organized around the full sense–plan–control–act loop."
      />

      {/* =====================================================
          CAROUSEL
      ====================================================== */}

      <div className="relative mt-10">
        {/* ===================================================
            BACKGROUND GLOW
        ==================================================== */}

        <div className="pointer-events-none absolute left-1/2 top-[40%] h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.025] blur-[110px]" />

        <motion.div
          className="pointer-events-none absolute left-1/2 top-[40%] h-[350px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
          animate={{
            backgroundColor: [
              'rgba(34,211,238,0.07)',
              'rgba(168,85,247,0.07)',
              'rgba(236,72,153,0.07)',
              'rgba(34,197,94,0.07)',
              'rgba(34,211,238,0.07)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* =====================================================
            DESKTOP CAROUSEL
        ====================================================== */}

        <div
          className="relative hidden h-[440px] w-full md:block"
          style={{
            perspective: '1400px',
          }}
        >
          {skillGroups.map((group, index) => {
            const Icon = icons[index] || FiCpu

            const offset = getOffset(index)

            const position = getCardAnimation(offset)

            const isActive = offset === 0

            return (
              /*
                IMPORTANT:

                This wrapper is always full width.

                flex + justify-center keeps the active card
                mathematically centered on the page.

                Framer Motion only moves the INNER card.

                Therefore motion x cannot break centering.
              */

              <div
                key={group.title}
                className="pointer-events-none absolute inset-x-0 top-4 flex justify-center"
                style={{
                  zIndex: isActive
                    ? 50
                    : Math.abs(offset) === 1
                      ? 30
                      : 10,
                }}
              >
                <motion.div
                  className="pointer-events-auto w-[min(560px,52vw)]"
                  initial={false}
                  animate={position}
                  transition={{
                    type: 'spring',
                    stiffness: 115,
                    damping: 20,
                    mass: 0.85,
                  }}
                  onClick={() => {
                    if (!isActive) {
                      setActiveIndex(index)
                    }
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    cursor: isActive ? 'default' : 'pointer',
                  }}
                >
                  {/* ===========================================
                      ANIMATED BORDER WRAPPER
                  ============================================ */}

                  <div className="relative overflow-hidden rounded-[24px] p-[1px]">
                    {/* ACTIVE MULTICOLOR BORDER */}

                    {isActive && (
                      <motion.div
                        className="absolute -inset-[70%]"
                        style={{
                          background:
                            'conic-gradient(from 0deg, #22d3ee, #a855f7, #ec4899, #22c55e, #22d3ee)',
                        }}
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 4.5,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    )}

                    {/* INACTIVE BORDER */}

                    {!isActive && (
                      <div className="absolute inset-0 rounded-[24px] border border-white/[0.08]" />
                    )}

                    {/* ===========================================
                        MAIN CARD
                    ============================================ */}

                    <div
                      className={`relative min-h-[315px] overflow-hidden rounded-[23px] border border-white/[0.06] bg-[#101725]/95 p-8 backdrop-blur-xl ${
                        isActive
                          ? 'shadow-[0_25px_90px_rgba(0,0,0,.48)]'
                          : ''
                      }`}
                    >
                      {/* =========================================
                          ACTIVE MOVING COLOR GLOW
                      ========================================== */}

                      {isActive && (
                        <>
                          <motion.div
                            className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full blur-[80px]"
                            animate={{
                              backgroundColor: [
                                'rgba(34,211,238,.20)',
                                'rgba(168,85,247,.20)',
                                'rgba(236,72,153,.18)',
                                'rgba(34,197,94,.18)',
                                'rgba(34,211,238,.20)',
                              ],

                              x: [0, 300, 300, 0, 0],

                              y: [0, 0, 200, 200, 0],
                            }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                          />

                          <motion.div
                            className="pointer-events-none absolute -bottom-28 -right-20 h-56 w-56 rounded-full blur-[90px]"
                            animate={{
                              backgroundColor: [
                                'rgba(168,85,247,.16)',
                                'rgba(236,72,153,.16)',
                                'rgba(34,197,94,.16)',
                                'rgba(34,211,238,.16)',
                                'rgba(168,85,247,.16)',
                              ],
                            }}
                            transition={{
                              duration: 7,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                          />
                        </>
                      )}

                      {/* =========================================
                          HEADER
                      ========================================== */}

                      <div className="relative z-10 flex items-center justify-between">
                        <motion.div
                          className="grid h-14 w-14 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.05] text-2xl text-cyan-300"
                          animate={
                            isActive
                              ? {
                                  boxShadow: [
                                    '0 0 0px rgba(34,211,238,0)',
                                    '0 0 24px rgba(34,211,238,.18)',
                                    '0 0 0px rgba(34,211,238,0)',
                                  ],
                                }
                              : {}
                          }
                          transition={{
                            duration: 2.8,
                            repeat: Infinity,
                          }}
                        >
                          <Icon />
                        </motion.div>

                        <span
                          className={`font-mono text-[11px] font-semibold tracking-[.25em] ${
                            isActive
                              ? 'text-cyan-300'
                              : 'text-slate-600'
                          }`}
                        >
                          {group.code}
                        </span>
                      </div>

                      {/* =========================================
                          TITLE
                      ========================================== */}

                      <h3 className="relative z-10 mt-8 text-[25px] font-semibold text-white">
                        {group.title}
                      </h3>

                      {/* =========================================
                          SKILLS
                      ========================================== */}

                      <div className="relative z-10 mt-7 flex flex-wrap gap-2.5">
                        {group.skills.map((skill) => (
                          <span
                            key={skill}
                            className={`rounded-lg border px-3 py-2 font-mono text-[10px] uppercase tracking-[.16em] transition ${
                              isActive
                                ? 'border-cyan-300/20 bg-cyan-300/[0.035] text-slate-300'
                                : 'border-white/[0.07] bg-white/[0.025] text-slate-500'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* =========================================
                          MOVING BOTTOM LIGHT
                      ========================================== */}

                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 h-[2px] w-[35%]"
                          style={{
                            background:
                              'linear-gradient(90deg,#22d3ee,#a855f7,#ec4899,#22c55e)',
                          }}
                          animate={{
                            left: ['-35%', '100%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          })}

          {/* ===================================================
              LEFT ARROW
          ==================================================== */}

          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous skill"
            className="absolute left-[5%] top-[42%] z-[80] grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-cyan-300/20 bg-[#0b1422]/90 text-xl text-cyan-300 backdrop-blur-xl transition duration-300 hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:shadow-[0_0_25px_rgba(34,211,238,.15)]"
          >
            <FiChevronLeft />
          </button>

          {/* ===================================================
              RIGHT ARROW
          ==================================================== */}

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next skill"
            className="absolute right-[5%] top-[42%] z-[80] grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-cyan-300/20 bg-[#0b1422]/90 text-xl text-cyan-300 backdrop-blur-xl transition duration-300 hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:shadow-[0_0_25px_rgba(34,211,238,.15)]"
          >
            <FiChevronRight />
          </button>
        </div>

        {/* =====================================================
            MOBILE CAROUSEL
        ====================================================== */}

        <div className="relative md:hidden">
          <AnimatePresence mode="wait">
            {skillGroups.map((group, index) => {
              if (index !== activeIndex) {
                return null
              }

              const Icon = icons[index] || FiCpu

              return (
                <motion.div
                  key={group.title}
                  initial={{
                    opacity: 0,
                    x: 40,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    x: -40,
                    scale: 0.96,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                  className="relative overflow-hidden rounded-[22px] p-[1px]"
                >
                  {/* MOBILE MULTICOLOR BORDER */}

                  <motion.div
                    className="absolute -inset-[70%]"
                    style={{
                      background:
                        'conic-gradient(from 0deg, #22d3ee, #a855f7, #ec4899, #22c55e, #22d3ee)',
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />

                  {/* MOBILE CARD */}

                  <div className="relative min-h-[290px] rounded-[21px] border border-white/[0.06] bg-[#101725]/95 p-6 backdrop-blur-xl">
                    {/* MOBILE GLOW */}

                    <motion.div
                      className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full blur-[75px]"
                      animate={{
                        backgroundColor: [
                          'rgba(34,211,238,.18)',
                          'rgba(168,85,247,.18)',
                          'rgba(236,72,153,.18)',
                          'rgba(34,197,94,.18)',
                          'rgba(34,211,238,.18)',
                        ],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />

                    {/* MOBILE HEADER */}

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="grid h-12 w-12 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.05] text-xl text-cyan-300">
                        <Icon />
                      </div>

                      <span className="font-mono text-[10px] font-semibold tracking-[.22em] text-cyan-300">
                        {group.code}
                      </span>
                    </div>

                    {/* MOBILE TITLE */}

                    <h3 className="relative z-10 mt-7 text-xl font-semibold text-white">
                      {group.title}
                    </h3>

                    {/* MOBILE SKILLS */}

                    <div className="relative z-10 mt-6 flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.035] px-3 py-2 font-mono text-[9px] uppercase tracking-[.14em] text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* MOBILE ARROWS */}

          <div className="mt-6 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous skill"
              className="grid h-11 w-11 place-items-center rounded-full border border-cyan-300/20 bg-[#0b1422]/90 text-cyan-300"
            >
              <FiChevronLeft />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next skill"
              className="grid h-11 w-11 place-items-center rounded-full border border-cyan-300/20 bg-[#0b1422]/90 text-cyan-300"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* =====================================================
            DOT NAVIGATION
        ====================================================== */}

        <div className="relative z-[90] mt-5 flex items-center justify-center gap-3">
          {skillGroups.map((group, index) => {
            const isActive = index === activeIndex

            return (
              <button
                key={group.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${group.title}`}
                className="relative grid h-5 w-5 place-items-center"
              >
                {isActive && (
                  <motion.span
                    layoutId="active-skill-dot"
                    className="absolute h-5 w-5 rounded-full bg-cyan-300/10 blur-[5px]"
                  />
                )}

                <span
                  className={`relative block rounded-full transition-all duration-300 ${
                    isActive
                      ? 'h-3 w-3 bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,.85)]'
                      : 'h-2 w-2 bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              </button>
            )
          })}
        </div>

        {/* =====================================================
            CURRENT SKILL INFORMATION
        ====================================================== */}

        <div className="mt-2 text-center font-mono text-[10px] uppercase tracking-[.28em] text-slate-600">
          <span className="text-cyan-300">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>

          <span className="mx-3">/</span>

          <span>
            {String(total).padStart(2, '0')}
          </span>

          <span className="mx-3">·</span>

          <span>
            {skillGroups[activeIndex]?.title}
          </span>
        </div>
      </div>
    </section>
  )
}
