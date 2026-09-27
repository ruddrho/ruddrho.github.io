import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiGithub,
  FiArrowUpRight,
  FiCpu,
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
  image:
    'https://raw.githubusercontent.com/ruddrho/slam_live_occupancy_map/main/combined_astar_navigation.gif',
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
  image:
    'https://raw.githubusercontent.com/ruddrho/ball-on-plate-matlab-simulation/main/ball_on_plate_research_grade.gif',
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
  {
  number: '09',
  title: 'PID-Controlled Quadcopter Simulation',
  description:
    'MATLAB-based quadcopter simulation using PID control for stable flight, attitude control and autonomous trajectory behaviour.',
  tags: ['MATLAB', 'PID', 'Quadcopter', 'Control Systems', 'Simulation'],
  github:
    'https://github.com/ruddrho/PID-Controlled-Quadcopter-Simulation',
  image:
    'https://raw.githubusercontent.com/ruddrho/PID-Controlled-Quadcopter-Simulation/main/quadcopter_simulation.gif',
},
  { number: '10', title: 'Coming Soon' },
  { number: '11', title: 'Coming Soon' },
  { number: '12', title: 'Coming Soon' },
  { number: '13', title: 'Coming Soon' },
  { number: '14', title: 'Coming Soon' },
  { number: '15', title: 'Coming Soon' },
  { number: '16', title: 'Coming Soon' },
  { number: '17', title: 'Coming Soon' },
  { number: '18', title: 'Coming Soon' },
]

function ArchiveCodeAnimation({ large = false }: { large?: boolean }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-white/[.10] bg-white shadow-[0_0_35px_rgba(34,211,238,.05)] ${
        large ? 'h-[560px] p-6 sm:p-10' : 'h-[190px] p-3'
      }`}
    >
      {/* 404 ANIMATION ONLY */}
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
        {/* 404 */}
        <motion.div
          className={`relative z-10 font-serif font-medium tracking-[.04em] text-[#202020] ${
            large ? 'text-[82px] leading-none' : 'text-[34px] leading-none'
          }`}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          404
        </motion.div>

        {/* Animated illustration */}
        <div
          className={`relative z-10 ${
            large ? 'mt-5 h-[250px] w-full max-w-[680px]' : 'mt-2 h-[82px] w-full max-w-[260px]'
          }`}
        >
          <svg
            viewBox="0 0 680 250"
            className="h-full w-full"
            role="img"
            aria-label="Animated 404 lost page illustration"
          >
            {/* Background stones */}
            <motion.ellipse
              cx="520"
              cy="160"
              rx="62"
              ry="90"
              fill="#f1f2f3"
              animate={{ cy: [160, 156, 160] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <ellipse cx="110" cy="183" rx="34" ry="20" fill="#e5e7e9" />
            <rect x="88" y="160" width="45" height="28" rx="14" fill="#e5e7e9" />

            {/* Grass / bushes */}
            <motion.path
              d="M45 210 C55 188 72 190 78 210 C88 194 105 197 110 210 Z"
              fill="#48a83f"
              animate={{ scaleY: [1, 1.08, 1] }}
              style={{ transformOrigin: '78px 210px' }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <path
              d="M180 210 C188 198 198 198 204 210 C214 202 226 202 232 210 Z"
              fill="#48a83f"
            />
            <path
              d="M570 210 C578 192 594 194 600 210 C610 198 625 200 630 210 Z"
              fill="#48a83f"
            />

            {/* Ground */}
            <line
              x1="35"
              y1="212"
              x2="645"
              y2="212"
              stroke="#e7e8e9"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Cable */}
            <motion.path
              d="M350 183 C390 190 390 215 438 216 C485 217 505 198 544 201"
              fill="none"
              stroke="#202020"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{
                d: [
                  'M350 183 C390 190 390 215 438 216 C485 217 505 198 544 201',
                  'M350 183 C392 184 402 222 444 216 C487 210 508 204 544 201',
                  'M350 183 C390 190 390 215 438 216 C485 217 505 198 544 201',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Person legs */}
            <motion.g
              animate={{ rotate: [-1, 1, -1] }}
              style={{ transformOrigin: '326px 170px' }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path
                d="M305 157 L300 207 L315 207 L326 166"
                fill="#f0ad7f"
              />
              <path
                d="M338 160 L348 207 L362 207 L356 158"
                fill="#f0ad7f"
              />

              {/* Body */}
              <path
                d="M292 92 C308 80 346 82 362 98 L350 164 C330 171 304 167 287 155 Z"
                fill="#f5a623"
              />
              <circle cx="306" cy="108" r="3" fill="#d97814" />
              <circle cx="327" cy="101" r="3" fill="#d97814" />
              <circle cx="345" cy="116" r="3" fill="#d97814" />
              <circle cx="315" cy="133" r="3" fill="#d97814" />
              <circle cx="339" cy="145" r="3" fill="#d97814" />

              {/* Head */}
              <circle cx="300" cy="72" r="25" fill="#f0ad7f" />
              <path
                d="M278 67 C278 42 308 35 326 53 C318 52 313 60 311 68 C300 58 289 62 278 67 Z"
                fill="#5b2d1d"
              />
              <path
                d="M280 67 C269 79 274 99 291 102 C282 91 284 79 292 72 Z"
                fill="#5b2d1d"
              />

              {/* Raised arm */}
              <motion.path
                d="M316 88 C337 72 351 66 365 62 C374 59 380 68 373 75 C357 88 344 96 332 108"
                fill="none"
                stroke="#f0ad7f"
                strokeWidth="13"
                strokeLinecap="round"
                animate={{ rotate: [-4, 3, -4] }}
                style={{ transformOrigin: '321px 91px' }}
                transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Searching hand / face detail */}
              <circle cx="307" cy="72" r="4" fill="#1f2937" />
              <path d="M294 82 Q302 88 310 82" fill="none" stroke="#7c3f2a" strokeWidth="2" />

              {/* Lower arm holding cable */}
              <path
                d="M295 119 C282 143 284 170 298 187"
                fill="none"
                stroke="#f0ad7f"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <circle cx="300" cy="188" r="7" fill="#f0ad7f" />
            </motion.g>

            {/* Small moving search spark */}
            <motion.circle
              cx="380"
              cy="58"
              r="5"
              fill="#f5a623"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.35, 0.8] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </svg>
        </div>

        {/* Message */}
        <motion.div
          className={`relative z-10 text-center font-serif font-medium text-[#202020] ${
            large ? 'mt-3 text-[28px]' : 'mt-1 text-[11px]'
          }`}
          animate={{ opacity: [0.82, 1, 0.82] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          Look like you're lost
        </motion.div>

        <div
          className={`relative z-10 text-center text-slate-500 ${
            large ? 'mt-2 text-sm' : 'mt-0.5 text-[5px] sm:text-[6px]'
          }`}
        >
          the page you are looking for is not available!
        </div>

        <motion.div
          className={`relative z-10 bg-[#39ac31] font-medium uppercase tracking-wide text-white ${
            large ? 'mt-5 rounded px-6 py-3 text-xs' : 'mt-1.5 rounded-[2px] px-2 py-1 text-[4px] sm:text-[5px]'
          }`}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Go to Home
        </motion.div>
      </div>
    </div>
  )
}

export function Projects() {
  const [archiveOpen, setArchiveOpen] = useState(false)

  const [previewProject, setPreviewProject] = useState<
    | { kind: 'image'; image: string; title: string }
    | { kind: 'code'; title: string }
    | null
  >(null)

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

  useEffect(() => {
    if (!previewProject) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPreviewProject(null)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [previewProject])

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
                <button
                  type="button"
                  onClick={() =>
                    setPreviewProject({
                      kind: 'image',
                      image: project.image!,
                      title: project.title,
                    })
                  }
                  aria-label={`Open ${project.title} simulation preview`}
                  className="relative mt-5 block w-full cursor-zoom-in overflow-hidden rounded-xl border border-cyan-300/20 bg-[#050816] text-left shadow-[0_0_25px_rgba(34,211,238,.05)]"
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
                </button>
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

            {/* Open Archive CTA */}
            <div className="relative mt-7 inline-flex items-center justify-center gap-3 rounded-xl border border-cyan-300/25 bg-cyan-300/[.05] px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[.20em] text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,.04)] transition-all duration-300 group-hover:border-cyan-300/50 group-hover:bg-cyan-300/[.10] group-hover:shadow-[0_0_28px_rgba(34,211,238,.10)]">
              <span>Open Archive</span>

              <motion.span
                animate={{
                  x: [0, 4, 0],
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-[14px]"
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
                      Projects 09 — 18
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
                  <div className="grid auto-rows-fr gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {archiveProjects.map((project, index) => {
                      if (project.number === '09') {
                        return (
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
                            {'description' in project && (
                              <p className="relative mt-3 text-sm leading-6 text-slate-400">
                                {project.description}
                              </p>
                            )}

                            {/* Tags */}
                            {'tags' in project && (
                              <div className="relative mt-5 flex flex-wrap gap-2">
                                {(project.tags ?? []).map((tag) => (
                                  <span key={tag} className="tech-chip">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Project GIF / Image */}
                            {'image' in project && project.image && (
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewProject({
                                    kind: 'image',
                                    image: project.image,
                                    title: project.title,
                                  })
                                }
                                aria-label={`Open ${project.title} simulation preview`}
                                className="relative mt-5 block w-full cursor-zoom-in overflow-hidden rounded-xl border border-cyan-300/20 bg-[#050816] text-left shadow-[0_0_25px_rgba(34,211,238,.05)]"
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
                              </button>
                            )}

                            {/* GitHub */}
                            {'github' in project && (
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
                            )}
                          </motion.article>
                        )
                      }

                      return (
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
                          className="group relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-2xl border border-white/[.08] bg-white/[.025] p-6 transition duration-300 hover:border-cyan-300/20 hover:bg-cyan-300/[.025]"
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

                          {/* Animated Code Preview */}
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewProject({
                                kind: 'code',
                                title: `Project ${project.number} 404 Animation`,
                              })
                            }
                            aria-label={`Open Project ${project.number} 404 animation`}
                            className="relative mt-7 block w-full cursor-zoom-in text-left transition duration-300 hover:scale-[1.01]"
                          >
                            <ArchiveCodeAnimation />
                          </button>

                          {/* Coming Soon */}
                          <div className="relative mt-auto pt-6">
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
                      )
                    })}
                  </div>
                </div>

                {/* =============================================
                    ARCHIVE FOOTER
                ============================================== */}

                <div className="relative flex shrink-0 items-center justify-between border-t border-white/[.07] px-5 py-4 font-mono text-[9px] uppercase tracking-[.18em] text-slate-600 sm:px-8">
                  <span>Projects 09 — 18</span>

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

      {/* =========================================================
          FULL SCREEN PROJECT GIF / IMAGE PREVIEW
      ========================================================== */}

      {createPortal(
        <AnimatePresence>
          {previewProject && (
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
              onClick={() => setPreviewProject(null)}
              className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#02050d]/95 p-4 backdrop-blur-xl sm:p-8"
            >
              {/* =========================================
                  CLOSE BUTTON
              ========================================== */}

              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                aria-label="Close simulation preview"
                title="Close"
                className="fixed right-5 top-5 z-[1000000] grid h-12 w-12 place-items-center rounded-xl border border-slate-600/40 bg-[#0b101c]/90 text-[22px] text-slate-300 shadow-[0_0_30px_rgba(0,0,0,.5)] backdrop-blur-md transition-all duration-300 hover:border-cyan-300/50 hover:bg-cyan-300/[.08] hover:text-cyan-300 sm:right-8 sm:top-8"
              >
                <FiX />
              </button>

              {/* =========================================
                  PREVIEW WINDOW
              ========================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.92,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: 10,
                }}
                transition={{
                  duration: 0.25,
                }}
                onClick={(event) => event.stopPropagation()}
                className="relative flex max-h-[92vh] max-w-[95vw] flex-col"
              >
                {/* Preview Header */}
                <div className="mb-4 flex items-center gap-3 pr-16">
                  <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,.8)]" />

                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[.2em] text-cyan-300">
                      {previewProject.kind === 'code'
                        ? '404 Animation Preview'
                        : 'Simulation Preview'}
                    </div>

                    <h3 className="mt-1 text-sm font-medium text-slate-200 sm:text-base">
                      {previewProject.title}
                    </h3>
                  </div>
                </div>

                {previewProject.kind === 'image' ? (
                  /* Full Size GIF */
                  <div className="relative overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#050816] shadow-[0_0_80px_rgba(34,211,238,.08)]">
                    <img
                      src={previewProject.image}
                      alt={`${previewProject.title} full simulation preview`}
                      className="block max-h-[80vh] max-w-[92vw] object-contain"
                    />

                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[.05]" />
                  </div>
                ) : (
                  /* Full Size 404 Animation */
                  <div className="w-[92vw] max-w-4xl">
                    <ArchiveCodeAnimation large />
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
