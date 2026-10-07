import { useEffect, useState } from 'react'
import {
  motion,
  useReducedMotion,
} from 'framer-motion'
import {
  FiCpu,
  FiCode,
  FiActivity,
  FiBox,
  FiEye,
} from 'react-icons/fi'
import { SectionTitle } from '../components/SectionTitle'
import { skillGroups } from '../data/portfolio'

const icons = [
  FiCpu,
  FiActivity,
  FiCode,
  FiBox,
  FiEye,
]

export function Skills() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const reduceMotion = useReducedMotion()

  /*
    Automatic sequential animation:
    01 → 02 → 03 → 04 → 05 → repeat
  */
  useEffect(() => {
    if (reduceMotion || hoveredIndex !== null) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        if (skillGroups.length === 0) return 0
        return (current + 1) % skillGroups.length
      })
    }, 2400)

    return () => {
      window.clearInterval(interval)
    }
  }, [hoveredIndex, reduceMotion])

  return (
    <section id="skills" className="section-wrap">
      <SectionTitle
        eyebrow="02 // Technical Stack"
        title="Systems thinking across the robotics pipeline."
        text="Core areas are organized around the full sense–plan–control–act loop."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, i) => {
          const Icon = icons[i] ?? FiCpu

          const isActive =
            hoveredIndex !== null
              ? hoveredIndex === i
              : activeIndex === i

          return (
            <motion.div
              key={g.title}
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
                amount: 0.2,
              }}
              transition={{
                delay: i * 0.06,
                duration: 0.55,
              }}
              onMouseEnter={() => {
                setHoveredIndex(i)
              }}
              onMouseLeave={() => {
                setHoveredIndex(null)
                setActiveIndex(i)
              }}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: isActive ? -7 : 0,
                      scale: isActive ? 1.018 : 1,
                    }
              }
              className="relative rounded-2xl"
              style={{
                zIndex: isActive ? 10 : 1,
              }}
            >
              {/* ==========================================
                  MULTI-COLOR ROTATING BORDER
                  Cyan → Purple → Pink → Green
              =========================================== */}

              <motion.div
                className="pointer-events-none absolute -inset-[2px] overflow-hidden rounded-2xl"
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: isActive ? 1 : 0.12,
                      }
                }
                transition={{
                  duration: 0.45,
                }}
              >
                <motion.div
                  className="absolute left-1/2 top-1/2 h-[180%] w-[180%] -translate-x-1/2 -translate-y-1/2"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 0deg, #22d3ee 35deg, #22d3ee 55deg, transparent 90deg, transparent 100deg, #a855f7 135deg, #a855f7 155deg, transparent 190deg, transparent 200deg, #ec4899 235deg, #ec4899 255deg, transparent 290deg, transparent 300deg, #34d399 335deg, #34d399 355deg, transparent 360deg)',
                  }}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          rotate: 360,
                        }
                  }
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.div>

              {/* ==========================================
                  ACTIVE CARD OUTER GLOW
              =========================================== */}

              <motion.div
                className="pointer-events-none absolute -inset-3 rounded-[22px]"
                animate={{
                  opacity: isActive ? 1 : 0,
                }}
                transition={{
                  duration: 0.5,
                }}
                style={{
                  background:
                    'radial-gradient(circle at 20% 0%, rgba(34,211,238,.16), transparent 38%), radial-gradient(circle at 100% 25%, rgba(168,85,247,.13), transparent 40%), radial-gradient(circle at 75% 100%, rgba(236,72,153,.10), transparent 38%), radial-gradient(circle at 0% 85%, rgba(52,211,153,.10), transparent 40%)',
                  filter: 'blur(16px)',
                }}
              />

              {/* ==========================================
                  MAIN CARD
              =========================================== */}

              <div
                className={`glass-card relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-500 ${
                  isActive
                    ? 'border-white/[.16] bg-white/[.045]'
                    : ''
                }`}
              >
                {/* Moving background glow */}

                <motion.div
                  className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl"
                  animate={{
                    opacity: isActive ? 1 : 0.25,
                    scale: isActive ? 1.25 : 1,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(34,211,238,.18), rgba(168,85,247,.14), rgba(236,72,153,.12), rgba(52,211,153,.12))',
                  }}
                />

                {/* Bottom glow */}

                <motion.div
                  className="pointer-events-none absolute -bottom-16 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-full blur-3xl"
                  animate={{
                    opacity: isActive ? 0.7 : 0,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  style={{
                    background:
                      'linear-gradient(90deg, #22d3ee, #a855f7, #ec4899, #34d399)',
                  }}
                />

                {/* ==========================================
                    ICON + CODE
                =========================================== */}

                <div className="relative z-10 flex items-center justify-between">
                  <motion.div
                    className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/[.05] text-xl text-cyan-300"
                    animate={
                      reduceMotion
                        ? undefined
                        : {
                            scale: isActive ? 1.08 : 1,
                            boxShadow: isActive
                              ? '0 0 22px rgba(34,211,238,.20)'
                              : '0 0 0 rgba(34,211,238,0)',
                          }
                    }
                    transition={{
                      duration: 0.45,
                    }}
                  >
                    <Icon />
                  </motion.div>

                  <motion.span
                    className="font-mono text-[10px] tracking-[.2em] text-slate-600"
                    animate={{
                      color: isActive
                        ? 'rgb(103 232 249)'
                        : 'rgb(71 85 105)',
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                  >
                    {g.code}
                  </motion.span>
                </div>

                {/* ==========================================
                    TITLE
                =========================================== */}

                <motion.h3
                  className="relative z-10 mt-5 text-xl font-medium text-white"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          x: isActive ? 3 : 0,
                      }
                  }
                  transition={{
                    duration: 0.4,
                  }}
                >
                  {g.title}
                </motion.h3>

                {/* ==========================================
                    SKILL TAGS
                =========================================== */}

                <div className="relative z-10 mt-5 flex flex-wrap gap-2">
                  {g.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      className="tech-chip"
                      animate={
                        reduceMotion
                          ? undefined
                          : isActive
                            ? {
                                y: [0, -2, 0],
                                borderColor: [
                                  'rgba(255,255,255,.08)',
                                  'rgba(34,211,238,.28)',
                                  'rgba(168,85,247,.22)',
                                  'rgba(236,72,153,.20)',
                                  'rgba(52,211,153,.20)',
                                  'rgba(255,255,255,.08)',
                                ],
                              }
                            : {
                                y: 0,
                              }
                      }
                      transition={
                        isActive
                          ? {
                              duration: 1.6,
                              delay: skillIndex * 0.07,
                              ease: 'easeInOut',
                            }
                          : {
                              duration: 0.3,
                            }
                      }
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>

                {/* ==========================================
                    ACTIVE BOTTOM LIGHT
                =========================================== */}

                <motion.div
                  className="pointer-events-none absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full"
                  animate={{
                    width: isActive ? '72%' : '0%',
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.65,
                    ease: 'easeOut',
                  }}
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, #22d3ee, #a855f7, #ec4899, #34d399, transparent)',
                    boxShadow:
                      '0 0 14px rgba(34,211,238,.55), 0 0 22px rgba(168,85,247,.25)',
                  }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
