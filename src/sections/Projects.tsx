import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiGithub,
  FiArrowUpRight,
  FiCpu,
  FiPlus,
  FiX,
  FiClock,
} from 'react-icons/fi'
import { SectionTitle } from '../components/SectionTitle'

const projects = [
  {
    number: '01',
    title: 'ROS 2 Vision-Guided Robot Arm Color Sorting',
    description:
      'Vision-guided robotic arm system for autonomous color detection, classification and pick-and-place sorting using ROS 2, OpenCV and Gazebo.',
    tags: ['ROS 2', 'OpenCV', 'Gazebo', 'C++', 'Robotics'],
    github:
      'https://github.com/ruddrho/ros2-vision-guided-robot-arm-color-sorting-robot',
  },

  {
    number: '02',
    title: 'MATLAB Multi-Algorithm Robot Navigation',
    description:
      'Autonomous robot navigation framework comparing multiple path-planning algorithms with obstacle avoidance, LiDAR simulation and SLAM.',
    tags: ['MATLAB', 'A*', 'RRT', 'PRM', 'DWA', 'SLAM'],
    github:
      'https://github.com/ruddrho/matlab-multi-algorithm-robot-navigation',
    image:
      'https://raw.githubusercontent.com/ruddrho/matlab-multi-algorithm-robot-navigation/main/matlab_multi_algorithm_robot_navigation%281%29.gif',
  },

  {
    number: '03',
    title: 'Advanced Mobile Robot Navigation',
    description:
      'Advanced autonomous mobile robot navigation using Theta*, artificial potential fields, Pure Pursuit, LiDAR simulation and occupancy mapping.',
    tags: ['MATLAB', 'Theta*', 'APF', 'LiDAR', 'SLAM'],
    github:
      'https://github.com/ruddrho/advanced-mobile-robot-navigation',
    image:
      'https://raw.githubusercontent.com/ruddrho/advanced-mobile-robot-navigation/main/advanced_mobile_robot_navigation.gif',
  },

  {
    number: '04',
    title: 'PID · LQR · Fuzzy Robot Trajectory Tracking',
    description:
      'Comparative implementation of PID, LQR and Fuzzy Logic control strategies for mobile robot trajectory tracking and control analysis.',
    tags: ['MATLAB', 'PID', 'LQR', 'Fuzzy', 'Control'],
    github:
      'https://github.com/ruddrho/pid-lqr-fuzzy-mobile-robot-trajectory-tracking',
    image:
      'https://raw.githubusercontent.com/ruddrho/pid-lqr-fuzzy-mobile-robot-trajectory-tracking/main/pid_lqr_fuzzy_controller_comparison.gif',
  },

  {
    number: '05',
    title: 'SLAM Live Occupancy Map',
    description:
      'Autonomous differential-drive robot navigation with path planning, dynamic obstacle avoidance, 360° LiDAR and live occupancy mapping.',
    tags: ['MATLAB', 'SLAM', 'LiDAR', 'A*', 'DWA'],
    github:
      'https://github.com/ruddrho/slam_live_occupancy_map',
  },

  {
    number: '06',
    title: 'Fuzzy Line-Following Robot',
    description:
      'MATLAB simulation of a fuzzy-logic line-following robot with autonomous path tracking, navigation behaviour and simulation visualization.',
    tags: ['MATLAB', 'Fuzzy Logic', 'Control', 'Robotics'],
    github:
      'https://github.com/ruddrho/Fuzzy-Line-Following-Robot-MATLAB',
    image:
      'https://raw.githubusercontent.com/ruddrho/Fuzzy-Line-Following-Robot-MATLAB/main/navigation_recording.gif',
  },

  {
    number: '07',
    title: 'Ball-on-Plate MATLAB Simulation',
    description:
      'Control-system simulation for ball stabilization and trajectory behaviour on a two-axis plate platform using MATLAB.',
    tags: ['MATLAB', 'Control Systems', 'Simulation', 'Dynamics'],
    github:
      'https://github.com/ruddrho/ball-on-plate-matlab-simulation',
  },

  {
    number: '08',
    title: 'Intelligent Drone Obstacle Avoidance',
    description:
      'Autonomous drone simulation featuring intelligent obstacle avoidance, live SLAM navigation, 3D visualization and real-time mission monitoring.',
    tags: [
      'MATLAB',
      'UAV',
      'SLAM',
      'Obstacle Avoidance',
      'Autonomous Navigation',
    ],
    github:
      'https://github.com/ruddrho/Intelligent-Drone-Obstacle-Avoidance-MATLAB',
    image:
      'https://raw.githubusercontent.com/ruddrho/Intelligent-Drone-Obstacle-Avoidance-MATLAB/main/drone_mission_simulation.gif',
  },
]

const archiveProjects = [
  { number: '09', title: 'Coming Soon' },
  { number: '10', title: 'Coming Soon' },
  { number: '11', title: 'Coming Soon' },
  { number: '12', title: 'Coming Soon' },
  { number: '13', title: 'Coming Soon' },
  { number: '14', title: 'Coming Soon' },
  { number: '15', title: 'Coming Soon' },
  { number: '16', title: 'Coming Soon' },
  { number: '17', title: 'Coming Soon' },
]

export function Projects() {
  const [archiveOpen, setArchiveOpen] = useState(false)

  useEffect(() => {
    if (!archiveOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setArchiveOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [archiveOpen])

  return (
    <>
      <section id="projects" className="section-wrap">
        <SectionTitle
          eyebrow="05 // Selected Work"
          title="Robotics & control engineering projects."
          text="Selected projects exploring autonomous navigation, robotic perception, SLAM, intelligent control and dynamic systems."
        />

        {/* =====================================================
            MAIN PROJECT GRID
        ====================================================== */}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.github}
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
                delay: index * 0.05,
              }}
              whileHover={{
                y: -5,
              }}
              className="group glass-card relative flex min-h-[340px] flex-col overflow-hidden p-6"
            >
              {/* Glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-300/[.04] blur-3xl transition duration-500 group-hover:bg-purple-400/[.08]" />

              {/* Top */}
              <div className="relative flex items-start justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/[.05] text-xl text-cyan-300">
                  <FiCpu />
                </div>

                <span className="font-mono text-[10px] uppercase tracking-[.2em] text-slate-600">
                  Project // {project.number}
                </span>
              </div>

              {/* Title */}
              <h3 className="relative mt-6 text-xl font-medium leading-snug text-white">
                {project.title}
              </h3>

              {/* Description */}
              <p className="relative mt-3 text-sm leading-6 text-slate-400">
                {project.description}
              </p>

              {/* Tags */}
              <div className="relative mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="tech-chip">
                    {tag}
                  </span>
                ))}
              </div>

              {/* =================================================
                  PROJECT GIF / IMAGE
              ================================================== */}

              {project.image && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="relative mt-5 block overflow-hidden rounded-xl border border-cyan-300/20 bg-[#050816] shadow-[0_0_25px_rgba(34,211,238,.05)]"
                >
                  <img
                    src={project.image}
                    alt={`${project.title} simulation demo`}
                    loading="lazy"
                    className="h-[200px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />

                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[.04]" />

                  <div className="absolute bottom-2 left-2 rounded-md border border-cyan-300/20 bg-[#050816]/90 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[.16em] text-cyan-300 backdrop-blur-md">
                    Simulation Demo
                  </div>
                </a>
              )}

              {/* GitHub */}
              <div className="relative mt-auto pt-7">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[.14em] text-cyan-300 transition hover:text-purple-300"
                >
                  <FiGithub className="text-base" />

                  View Repository

                  <FiArrowUpRight />
                </a>
              </div>
            </motion.article>
          ))}

                    {/* =====================================================
              MORE PROJECTS / ARCHIVE BUTTON
          ====================================================== */}

          <motion.button
            type="button"
            onClick={() => setArchiveOpen(true)}
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
              delay: 0.4,
            }}
            whileHover={{
              y: -5,
            }}
            whileTap={{
              scale: 0.99,
            }}
            className="group glass-card relative flex min-h-[340px] cursor-pointer flex-col items-center justify-center overflow-hidden border-dashed p-8 text-center"
          >
            {/* Background Glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.06),transparent_65%)] transition duration-500 group-hover:bg-[radial-gradient(circle_at_center,rgba(34,211,238,.10),transparent_65%)]" />

            {/* Background Grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(103,232,249,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,.7) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            {/* =========================
                ANIMATED ROBOT
            ========================== */}

            <motion.div
              animate={{
                y: [0, -7, 0],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative"
            >
              {/* Robot Glow */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[.08] blur-2xl transition duration-500 group-hover:bg-cyan-300/[.15]" />

              {/* Antenna */}
              <div className="relative mx-auto h-7 w-[2px] bg-gradient-to-t from-cyan-300/70 to-purple-400/80">
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.85, 1.15, 0.85],
                    boxShadow: [
                      '0 0 5px rgba(192,132,252,.4)',
                      '0 0 16px rgba(192,132,252,.9)',
                      '0 0 5px rgba(192,132,252,.4)',
                    ],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -left-[5px] -top-2 h-3 w-3 rounded-full border border-purple-300/60 bg-purple-400"
                />
              </div>

              {/* Robot Head */}
              <div className="relative">
                {/* Left Ear */}
                <div className="absolute -left-3 top-6 h-8 w-3 rounded-l-md border border-cyan-300/30 bg-[#0b1723]" />

                {/* Right Ear */}
                <div className="absolute -right-3 top-6 h-8 w-3 rounded-r-md border border-cyan-300/30 bg-[#0b1723]" />

                <div className="relative flex h-[82px] w-[108px] items-center justify-center rounded-[24px] border border-cyan-300/35 bg-[#091522]/95 shadow-[0_0_30px_rgba(34,211,238,.10)] transition duration-500 group-hover:border-cyan-300/60 group-hover:shadow-[0_0_40px_rgba(34,211,238,.18)]">

                  {/* Robot Face */}
                  <div className="relative flex h-[52px] w-[78px] items-center justify-center rounded-[17px] border border-cyan-300/15 bg-[#030914] shadow-inner">

                    {/* Eyes */}
                    <div className="flex items-center gap-5">

                      {/* Left Eye */}
                      <motion.div
                        animate={{
                          scaleY: [1, 1, 1, 0.08, 1, 1, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          times: [0, 0.42, 0.46, 0.48, 0.5, 0.54, 1],
                          ease: 'easeInOut',
                        }}
                        className="h-[11px] w-[11px] rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,.95)]"
                      />

                      {/* Right Eye */}
                      <motion.div
                        animate={{
                          scaleY: [1, 1, 1, 0.08, 1, 1, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          times: [0, 0.42, 0.46, 0.48, 0.5, 0.54, 1],
                          ease: 'easeInOut',
                        }}
                        className="h-[11px] w-[11px] rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,.95)]"
                      />

                    </div>

                    {/* Smile */}
                    <div className="absolute bottom-[9px] left-1/2 h-[5px] w-[20px] -translate-x-1/2 rounded-b-full border-b-2 border-cyan-300/50" />
                  </div>

                  {/* Head Details */}
                  <div className="absolute left-3 top-3 h-1.5 w-1.5 rounded-full bg-cyan-300/30" />

                  <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-cyan-300/30" />
                </div>
              </div>

              {/* Neck */}
              <div className="mx-auto h-3 w-7 border-x border-cyan-300/25 bg-[#091522]" />

              {/* Body */}
              <div className="relative mx-auto flex h-[44px] w-[72px] items-center justify-center rounded-b-[18px] rounded-t-lg border border-cyan-300/25 bg-[#091522]">

                {/* Status Light */}
                <motion.div
                  animate={{
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,.8)]"
                />

                <div className="absolute bottom-2 left-1/2 h-[1px] w-7 -translate-x-1/2 bg-cyan-300/20" />
              </div>

              {/* Floating Shadow */}
              <motion.div
                animate={{
                  scaleX: [1, 0.75, 1],
                  opacity: [0.25, 0.12, 0.25],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="mx-auto mt-4 h-2 w-20 rounded-full bg-cyan-300/20 blur-md"
              />
            </motion.div>

            {/* Project Archive */}
            <div className="relative mt-4 font-mono text-[10px] uppercase tracking-[.22em] text-cyan-300">
              Project Archive
            </div>

            {/* Title */}
            <h3 className="relative mt-3 text-xl font-medium text-white">
              More Projects
            </h3>

            {/* Description */}
            <p className="relative mt-3 max-w-[280px] text-sm leading-6 text-slate-500">
              Explore upcoming robotics, control systems and autonomous systems
              projects.
            </p>

            {/* Open Archive */}
            <div className="relative mt-6 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.18em] text-slate-500 transition duration-300 group-hover:text-cyan-300">
              Open Archive

              <motion.span
                animate={{
                  x: [0, 3, 0],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <FiArrowUpRight />
              </motion.span>
            </div>

            {/* Online Status */}
            <div className="absolute bottom-4 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[.16em] text-slate-700">
              <motion.span
                animate={{
                  opacity: [0.35, 1, 0.35],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="h-1.5 w-1.5 rounded-full bg-cyan-300"
              />

              Archive Online
            </div>
          </motion.button>

        </div>
      </section>

      {/* =========================================================
          PROJECT ARCHIVE
          Rendered directly inside document.body using Portal
      ========================================================== */}

      {createPortal(
        <AnimatePresence>
          {archiveOpen && (
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
              onClick={() => setArchiveOpen(false)}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#02050d]/90 p-3 backdrop-blur-md sm:p-6"
            >
              {/* =================================================
                  ARCHIVE WINDOW
              ================================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 35,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 25,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.25,
                }}
                onClick={(event) => event.stopPropagation()}
                className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#080d19]/95 shadow-[0_0_100px_rgba(34,211,238,.08)]"
              >
                {/* Decorative Glow */}
                <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-300/[.035] blur-3xl" />

                <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-purple-500/[.04] blur-3xl" />

                {/* =============================================
                    ARCHIVE HEADER
                ============================================== */}

                <div className="relative flex shrink-0 items-center border-b border-white/[.07] px-6 py-5 pr-20 sm:px-8 sm:py-6 sm:pr-24">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[.22em] text-cyan-300">
                      Project Archive
                    </div>

                    <h2 className="mt-2 text-xl font-medium text-white sm:text-2xl">
                      Upcoming Engineering Projects
                    </h2>

                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[.16em] text-slate-500">
                      Projects 09 — 17
                    </p>
                  </div>

                  {/* =========================================
                      CLOSE BUTTON
                  ========================================== */}

                  <button
                    type="button"
                    onClick={() => setArchiveOpen(false)}
                    aria-label="Close project archive"
                    title="Close"
                    className="absolute right-5 top-5 z-20 grid h-12 w-12 place-items-center rounded-xl border border-slate-700/40 bg-[#0b101c]/80 text-[22px] text-slate-400 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-cyan-300/30 hover:bg-cyan-300/[.06] hover:text-cyan-300 sm:right-6 sm:top-6"
                  >
                    <FiX />
                  </button>
                </div>

                {/* =============================================
                    SCROLLABLE ARCHIVE CONTENT
                ============================================== */}

                <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {archiveProjects.map((project, index) => (
                      <motion.article
                        key={project.number}
                        initial={{
                          opacity: 0,
                          y: 18,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.04,
                        }}
                        whileHover={{
                          y: -4,
                        }}
                        className="group relative flex min-h-[270px] flex-col overflow-hidden rounded-2xl border border-white/[.08] bg-white/[.025] p-6 transition duration-300 hover:border-cyan-300/20 hover:bg-cyan-300/[.025]"
                      >
                        {/* Card Glow */}
                        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-300/[.03] blur-3xl transition duration-500 group-hover:bg-purple-400/[.07]" />

                        {/* Top */}
                        <div className="relative flex items-start justify-between">
                          <div className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-300/15 bg-cyan-300/[.04] text-xl text-cyan-300/70">
                            <FiCpu />
                          </div>

                          <span className="font-mono text-[10px] uppercase tracking-[.2em] text-slate-600">
                            Project // {project.number}
                          </span>
                        </div>

                        {/* Coming Soon */}
                        <div className="relative mt-auto pt-8">
                          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/[.05] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.18em] text-purple-300">
                            <FiClock />
                            Coming Soon
                          </div>

                          <h3 className="mt-4 text-xl font-medium text-white">
                            {project.title}
                          </h3>

                          <p className="mt-3 text-sm leading-6 text-slate-500">
                            Project details, simulation results and repository
                            will be added as development progresses.
                          </p>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>

                {/* =============================================
                    ARCHIVE FOOTER
                ============================================== */}

                <div className="relative flex shrink-0 items-center justify-between border-t border-white/[.07] px-5 py-4 font-mono text-[9px] uppercase tracking-[.18em] text-slate-600 sm:px-8">
                  <span>
                    Projects 09 — 17
                  </span>

                  <span className="text-cyan-300/70">
                    Development Pipeline
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
