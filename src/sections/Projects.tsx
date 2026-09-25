import { useEffect, useState } from 'react'
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

  /*
   * Disable background scrolling while the archive is open.
   * ESC also closes the archive.
   */
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
    <section id="projects" className="section-wrap">
      <SectionTitle
        eyebrow="05 // Selected Work"
        title="Robotics & control engineering projects."
        text="Selected projects exploring autonomous navigation, robotic perception, SLAM, intelligent control and dynamic systems."
      />

      {/* =========================================================
          MAIN PROJECT GRID
      ========================================================== */}

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

                {/* Subtle Overlay */}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[.04]" />

                {/* Simulation Label */}
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

        {/* =========================================================
            CLICKABLE MORE PROJECTS CARD
        ========================================================== */}

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
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.05),transparent_65%)] transition duration-500 group-hover:bg-[radial-gradient(circle_at_center,rgba(34,211,238,.09),transparent_65%)]" />

          {/* Plus Icon */}
          <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-dashed border-cyan-300/30 bg-cyan-300/[.04] text-2xl text-cyan-300 transition duration-300 group-hover:scale-110 group-hover:border-cyan-300/60 group-hover:bg-cyan-300/[.08] group-hover:shadow-[0_0_30px_rgba(34,211,238,.12)]">
            <FiPlus />
          </div>

          <div className="relative mt-5 font-mono text-[10px] uppercase tracking-[.22em] text-cyan-300">
            Project Archive
          </div>

          <h3 className="relative mt-3 text-xl font-medium text-white">
            More Projects
          </h3>

          <p className="relative mt-3 max-w-[260px] text-sm leading-6 text-slate-500">
            Explore upcoming robotics, control systems and autonomous systems
            projects.
          </p>

          <div className="relative mt-6 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.18em] text-slate-500 transition group-hover:text-cyan-300">
            Open Archive
            <FiArrowUpRight />
          </div>
        </motion.button>
      </div>

      {/* =========================================================
          PROJECT ARCHIVE MODAL
      ========================================================== */}

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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#02050d]/90 p-3 backdrop-blur-md sm:p-6"
          >
            {/* =====================================================
                ARCHIVE WINDOW
            ====================================================== */}

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

              {/* =================================================
                  ARCHIVE HEADER
              ================================================== */}

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

                {/* =============================================
                    TOP-RIGHT CLOSE BUTTON
                ============================================== */}

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

              {/* =================================================
                  SCROLLABLE PROJECT ARCHIVE
              ================================================== */}

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

                      {/* Project Number */}
                      <div className="relative flex items-start justify-between">
                        <div className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-300/15 bg-cyan-300/[.04] text-xl text-cyan-300/70">
                          <FiCpu />
                        </div>

                        <span className="font-mono text-[10px] uppercase tracking-[.2em] text-slate-600">
                          Project // {project.number}
                        </span>
                      </div>

                      {/* Coming Soon Content */}
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

              {/* =================================================
                  ARCHIVE FOOTER
              ================================================== */}

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
      </AnimatePresence>
    </section>
  )
}
