import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [paused, setPaused] = useState(false)

  const total = skillGroups.length

  /* ==========================================
     AUTO CIRCULAR ROTATION
  ========================================== */
  useEffect(() => {
    if (paused || total <= 1) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total)
    }, 2800)

    return () => window.clearInterval(timer)
  }, [paused, total])

  const previous = () => {
    setActiveIndex((current) => (current - 1 + total) % total)
  }

  const next = () => {
    setActiveIndex((current) => (current + 1) % total)
  }

  /*
    Converts every card into a circular position relative
    to the currently selected card.

    0  = center
    -1 = left
    +1 = right
    -2 = far left
    +2 = far right
  */
  const getRelativePosition = (index: number) => {
    let diff = index - activeIndex

    if (diff > total / 2) {
      diff -= total
    }

    if (diff < -total / 2) {
      diff += total
    }

    return diff
  }

  const getCardAnimation = (position: number) => {
    if (position === 0) {
      return {
        x: '0%',
        y: 0,
        scale: 1,
        opacity: 1,
        rotateY: 0,
        zIndex: 50,
        filter: 'blur(0px)',
      }
    }

    if (position === -1) {
      return {
        x: '-78%',
        y: 32,
        scale: 0.82,
        opacity: 0.58,
        rotateY: 15,
        zIndex: 30,
        filter: 'blur(0px)',
      }
    }

    if (position === 1) {
      return {
        x: '78%',
        y: 32,
        scale: 0.82,
        opacity: 0.58,
        rotateY: -15,
        zIndex: 30,
        filter: 'blur(0px)',
      }
    }

    if (position === -2) {
      return {
        x: '-125%',
        y: 65,
        scale: 0.66,
        opacity: 0.18,
        rotateY: 24,
        zIndex: 10,
        filter: 'blur(1px)',
      }
    }

    if (position === 2) {
      return {
        x: '125%',
        y: 65,
        scale: 0.66,
        opacity: 0.18,
        rotateY: -24,
        zIndex: 10,
        filter: 'blur(1px)',
      }
    }

    return {
      x: position < 0 ? '-145%' : '145%',
      y: 80,
      scale: 0.55,
      opacity: 0,
      rotateY: position < 0 ? 30 : -30,
      zIndex: 0,
      filter: 'blur(2px)',
    }
  }

  return (
    <section
      id="skills"
      className="section-wrap relative overflow-hidden"
    >
      <SectionTitle
        eyebrow="02 // Technical Stack"
        title="Systems thinking across the robotics pipeline."
        text="Core areas are organized around the full sense–plan–control–act loop."
      />

      {/* ==========================================
          CAROUSEL AREA
      ========================================== */}

      <div
        className="relative mt-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* background glow */}

        <motion.div
          className="pointer-events-none absolute left-1/2 top-[46%] h-[340px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.06] blur-[100px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="pointer-events-none absolute left-1/2 top-[55%] h-[260px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/[0.07] blur-[110px]"
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* ==========================================
            CARDS
        ========================================== */}

        <div
          className="relative mx-auto h-[430px] max-w-[1180px]"
          style={{
            perspective: '1500px',
          }}
        >
          <AnimatePresence initial={false}>
            {skillGroups.map((group, index) => {
              const Icon = icons[index] || FiCpu
              const position = getRelativePosition(index)
              const isActive = position === 0
              const animation = getCardAnimation(position)

              return (
                <motion.div
                  key={group.title}
                  className="absolute left-1/2 top-8 w-[88%] max-w-[520px] cursor-pointer"
                  style={{
                    marginLeft: '-44%',
                    transformStyle: 'preserve-3d',
                  }}
                  initial={false}
                  animate={animation}
                  transition={{
                    type: 'spring',
                    stiffness: 115,
                    damping: 19,
                    mass: 0.9,
                  }}
                  onClick={() => setActiveIndex(index)}
                >
                  {/* ==================================
                      ANIMATED BORDER
                  ================================== */}

                  <div
                    className={`relative overflow-hidden rounded-[24px] p-[1px] ${
                      isActive
                        ? 'shadow-[0_0_60px_rgba(34,211,238,0.14)]'
                        : ''
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute -inset-[150%]"
                        style={{
                          background:
                            'conic-gradient(from 0deg, transparent 0deg, #22d3ee 45deg, #a855f7 100deg, #ec4899 155deg, #22c55e 215deg, transparent 280deg, transparent 360deg)',
                        }}
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    )}

                    {!isActive && (
                      <div className="absolute inset-0 bg-white/[0.10]" />
                    )}

                    {/* ==================================
                        CARD CONTENT
                    ================================== */}

                    <div className="relative min-h-[300px] rounded-[23px] border border-white/[0.04] bg-[#101625]/[0.96] p-7 backdrop-blur-xl">
                      {/* active light sweep */}

                      {isActive && (
                        <motion.div
                          className="pointer-events-none absolute inset-y-0 w-[180px] bg-gradient-to-r from-transparent via-cyan-300/[0.08] to-transparent blur-xl"
                          animate={{
                            left: ['-40%', '120%'],
                          }}
                          transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                      )}

                      {/* top */}

                      <div className="relative z-10 flex items-center justify-between">
                        <motion.div
                          className="grid h-14 w-14 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.05] text-2xl text-cyan-300"
                          animate={
                            isActive
                              ? {
                                  boxShadow: [
                                    '0 0 0 rgba(34,211,238,0)',
                                    '0 0 25px rgba(34,211,238,.18)',
                                    '0 0 0 rgba(34,211,238,0)',
                                  ],
                                }
                              : {}
                          }
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          <Icon />
                        </motion.div>

                        <span
                          className={`font-mono text-[11px] tracking-[.25em] ${
                            isActive
                              ? 'text-cyan-300'
                              : 'text-slate-600'
                          }`}
                        >
                          {group.code}
                        </span>
                      </div>

                      {/* title */}

                      <h3 className="relative z-10 mt-7 text-2xl font-semibold text-white">
                        {group.title}
                      </h3>

                      {/* skills */}

                      <div className="relative z-10 mt-6 flex flex-wrap gap-2">
                        {group.skills.map((skill) => (
                          <span
                            key={skill}
                            className={`tech-chip transition-all duration-300 ${
                              isActive
                                ? 'border-cyan-300/20 bg-cyan-300/[0.03]'
                                : ''
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* bottom accent */}

                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-[12%] h-[2px] rounded-full"
                          style={{
                            background:
                              'linear-gradient(90deg,#22d3ee,#a855f7,#ec4899,#22c55e)',
                          }}
                          animate={{
                            width: ['20%', '76%', '20%'],
                            left: ['10%', '14%', '70%'],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* ==========================================
            LEFT / RIGHT CONTROLS
        ========================================== */}

        <button
          type="button"
          onClick={previous}
          aria-label="Previous skill group"
          className="absolute left-2 top-[42%] z-[70] grid h-12 w-12 place-items-center rounded-full border border-cyan-300/20 bg-[#0d1422]/90 text-xl text-cyan-300 backdrop-blur-md transition hover:border-cyan-300/50 hover:bg-cyan-300/10 md:left-8"
        >
          <FiChevronLeft />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next skill group"
          className="absolute right-2 top-[42%] z-[70] grid h-12 w-12 place-items-center rounded-full border border-cyan-300/20 bg-[#0d1422]/90 text-xl text-cyan-300 backdrop-blur-md transition hover:border-cyan-300/50 hover:bg-cyan-300/10 md:right-8"
        >
          <FiChevronRight />
        </button>

        {/* ==========================================
            NAVIGATION DOTS
        ========================================== */}

        <div className="relative z-[70] -mt-6 flex justify-center gap-3">
          {skillGroups.map((group, index) => (
            <button
              key={group.title}
              type="button"
              aria-label={`Show ${group.title}`}
              onClick={() => setActiveIndex(index)}
              className="relative h-3 w-3"
            >
              <motion.span
                className="absolute inset-0 rounded-full"
                animate={{
                  scale: index === activeIndex ? 1.35 : 1,
                  backgroundColor:
                    index === activeIndex
                      ? '#67e8f9'
                      : '#334155',
                  boxShadow:
                    index === activeIndex
                      ? '0 0 16px rgba(103,232,249,.7)'
                      : '0 0 0 rgba(0,0,0,0)',
                }}
              />
            </button>
          ))}
        </div>

        {/* current category */}

        <div className="mt-5 text-center font-mono text-[10px] uppercase tracking-[.28em] text-slate-500">
          <span className="text-cyan-300">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>

          <span className="mx-3">/</span>

          <span>{String(total).padStart(2, '0')}</span>

          <span className="mx-3 text-slate-700">•</span>

          <span>{skillGroups[activeIndex]?.title}</span>
        </div>
      </div>
    </section>
  )
}
