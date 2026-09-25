import { motion } from 'framer-motion'
import {
  FiGithub,
  FiArrowUpRight,
  FiCpu,
  FiPlus,
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
]

export function Projects() {
  return (
    <section id="projects" className="section-wrap">

      <SectionTitle
        eyebrow="05 // Selected Work"
        title="Robotics & control engineering projects."
        text="Selected projects exploring autonomous navigation, robotic perception, SLAM, intelligent control and dynamic systems."
      />

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
                <span
                  key={tag}
                  className="tech-chip"
                >
                  {tag}
                </span>
              ))}

            </div>

            {/* =========================
                PROJECT GIF / IMAGE
            ========================== */}
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

                {/* Subtle overlay */}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[.04]" />

                {/* Simulation label */}
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

        {/* =========================
            ADD MORE PROJECTS
        ========================== */}

        <motion.div
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
            delay: 0.35,
          }}
          className="glass-card relative flex min-h-[340px] flex-col items-center justify-center overflow-hidden border-dashed p-8 text-center"
        >

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.05),transparent_65%)]" />

          <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-dashed border-cyan-300/30 bg-cyan-300/[.04] text-2xl text-cyan-300">
            <FiPlus />
          </div>

          <div className="relative mt-5 font-mono text-[10px] uppercase tracking-[.22em] text-cyan-300">
            Project Archive
          </div>

          <h3 className="relative mt-3 text-xl font-medium text-white">
            More projects coming.
          </h3>

          <p className="relative mt-3 max-w-[260px] text-sm leading-6 text-slate-500">
            Additional robotics, control systems and autonomous systems
            projects will be added as development continues.
          </p>

        </motion.div>

      </div>

    </section>
  )
}
