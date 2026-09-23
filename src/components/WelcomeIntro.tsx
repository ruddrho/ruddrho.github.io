import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

type WelcomeIntroProps = {
  onEnter: () => void
}

type Particle = {
  x: number
  y: number
  ox: number
  oy: number
  size: number
  phase: number
  hot: boolean
}

export function WelcomeIntro({ onEnter }: WelcomeIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrame = 0
    let width = window.innerWidth
    let height = window.innerHeight

    const mouse = {
      x: width * 0.5,
      y: height * 0.5,
      targetX: 0,
      targetY: 0,
    }

    const particles: Particle[] = []

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      width = window.innerWidth
      height = window.innerHeight

      canvas!.width = width * dpr
      canvas!.height = height * dpr

      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function createHead() {
      particles.length = 0

      const count = width < 768 ? 4200 : 8500

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.sqrt(Math.random())

        let x = Math.cos(angle) * radius * 0.28
        let y = Math.sin(angle) * radius * 0.42

        // Shape the front of the face
        if (x > 0.08) {
          const faceShape =
            Math.sin((y + 0.42) * Math.PI * 2.2) * 0.035

          x += faceShape

          if (y > -0.05 && y < 0.08) {
            x += 0.07
          }

          if (y > 0.08 && y < 0.2) {
            x += 0.025
          }
        }

        // Neck
        if (y > 0.27) {
          x *= 0.65
        }

        particles.push({
          x,
          y,
          ox: x,
          oy: y,
          size: Math.random() * 1.35 + 0.25,
          phase: Math.random() * Math.PI * 2,
          hot: Math.random() > 0.87,
        })
      }
    }

    function handleMouseMove(event: MouseEvent) {
      mouse.x = event.clientX
      mouse.y = event.clientY

      mouse.targetX =
        (event.clientX / window.innerWidth - 0.5) * 1.0

      mouse.targetY =
        (event.clientY / window.innerHeight - 0.5) * 1.0
    }

    resize()
    createHead()

    window.addEventListener('resize', () => {
      resize()
      createHead()
    })

    window.addEventListener('mousemove', handleMouseMove)

    let rotationX = 0
    let rotationY = 0

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height)

      rotationX += (mouse.targetX - rotationX) * 0.025
      rotationY += (mouse.targetY - rotationY) * 0.025

      const mobile = width < 768

      const centerX = mobile ? width * 0.5 : width * 0.27
      const centerY = mobile ? height * 0.34 : height * 0.51

      const scale = mobile
        ? Math.min(width, height) * 0.75
        : Math.min(width, height) * 0.92

      const breathe =
        1 + Math.sin(time * 0.0012) * 0.012

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        const depth =
          Math.sqrt(
            Math.max(
              0,
              1 -
                (p.ox * p.ox) / 0.0784 -
                (p.oy * p.oy) / 0.1764
            )
          ) || 0

        const turn =
          rotationX * depth * 0.085

        const verticalTurn =
          rotationY * depth * 0.035

        const driftX =
          Math.sin(time * 0.001 + p.phase) * 0.0025

        const driftY =
          Math.cos(time * 0.0012 + p.phase) * 0.002

        const px =
          centerX +
          (p.ox + turn + driftX) *
            scale *
            breathe

        const py =
          centerY +
          (p.oy + verticalTurn + driftY) *
            scale *
            breathe

        const pulse =
          0.45 +
          Math.sin(time * 0.002 + p.phase) * 0.25

        if (p.hot) {
          ctx!.fillStyle = `rgba(244,63,94,${
            0.18 + pulse * 0.45
          })`
        } else {
          ctx!.fillStyle = `rgba(34,211,238,${
            0.22 + pulse * 0.55
          })`
        }

        ctx!.beginPath()
        ctx!.arc(
          px,
          py,
          p.size,
          0,
          Math.PI * 2
        )
        ctx!.fill()
      }

      animationFrame = requestAnimationFrame(draw)
    }

    animationFrame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  function enterPortfolio() {
    setLeaving(true)

    window.setTimeout(() => {
      onEnter()
    }, 1050)
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={
        leaving
          ? {
              opacity: 0,
              scale: 1.035,
              filter: 'blur(10px)',
            }
          : {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
            }
      }
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#02050b]"
    >
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,.14) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,.14) 1px, transparent 1px)
          `,
          backgroundSize: '70px 70px',
        }}
      />

      {/* Background glow */}
      <div className="absolute -left-[10%] top-[10%] h-[70vh] w-[70vh] rounded-full bg-cyan-500/[.07] blur-[130px]" />

      <div className="absolute right-[5%] top-[15%] h-[45vh] w-[45vh] rounded-full bg-blue-600/[.06] blur-[130px]" />

      {/* Particle human */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* LEFT HUD */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute left-6 top-7 hidden font-mono text-[9px] uppercase leading-5 tracking-[.16em] text-cyan-300/60 md:block"
      >
        <div>Initializing...</div>
        <div>Loading Systems...</div>
        <div>Calibrating Vision...</div>
        <div>Connecting Modules...</div>
        <div className="text-cyan-300">Ready.</div>
      </motion.div>

      {/* Brain */}
      <div className="absolute left-1/2 top-[8%] hidden -translate-x-1/2 lg:block">
        <div className="intro-brain relative grid h-32 w-40 place-items-center rounded-xl border border-cyan-300/10 bg-[#04101b]/20 backdrop-blur-sm">
          <div className="absolute left-3 top-2 font-mono text-[7px] tracking-[.2em] text-cyan-300/40">
            BRAIN // AI INTERFACE
          </div>

          <svg
            viewBox="0 0 200 150"
            className="h-24 w-28"
          >
            <path
              d="M55 78 C40 45 65 25 92 34 C105 15 142 27 143 53 C168 61 164 93 145 102 C145 126 115 134 98 116 C77 130 51 113 55 91 C42 89 43 81 55 78Z"
              fill="none"
              stroke="rgba(34,211,238,.65)"
              strokeWidth="1.2"
              className="brain-path"
            />

            <path
              d="M74 55 L98 70 L121 48 M98 70 L87 96 L116 108 M98 70 L133 82"
              fill="none"
              stroke="rgba(168,85,247,.65)"
              strokeWidth="1"
              className="brain-signal"
            />

            <circle
              cx="98"
              cy="70"
              r="4"
              fill="#22d3ee"
              className="brain-core"
            />
          </svg>
        </div>
      </div>

      {/* EARTH */}
      <div className="absolute right-[5%] top-[7%] hidden lg:block">
        <div className="earth-orbit relative h-52 w-52">
          <div className="absolute inset-0 rounded-full border border-cyan-300/10" />

          <div className="absolute inset-5 rounded-full border border-dashed border-cyan-300/20" />

          <div className="earth-globe absolute inset-10 overflow-hidden rounded-full border border-cyan-300/30 bg-cyan-300/[.025] shadow-[0_0_45px_rgba(34,211,238,.08)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(34,211,238,.22),transparent_45%)]" />

            <div className="earth-lines absolute inset-[-20%] opacity-60">
              <div className="absolute left-1/2 top-0 h-full w-px bg-cyan-300/20" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-cyan-300/20" />
              <div className="absolute left-[25%] top-0 h-full w-px rotate-[25deg] bg-cyan-300/10" />
              <div className="absolute right-[25%] top-0 h-full w-px -rotate-[25deg] bg-cyan-300/10" />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-6 md:justify-end md:pr-[8%] lg:pr-[11%]">
        <div className="w-full max-w-[690px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-mono text-xs uppercase tracking-[.55em] text-cyan-200 sm:text-sm"
          >
            Welcome To
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              letterSpacing: '.18em',
              filter: 'blur(12px)',
            }}
            animate={{
              opacity: 1,
              letterSpacing: '-.035em',
              filter: 'blur(0px)',
            }}
            transition={{
              delay: 0.85,
              duration: 1.4,
            }}
            className="mt-6 text-4xl font-semibold uppercase text-white sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            RUDDRHO{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              MOLLIK
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="mt-6 font-mono text-[9px] uppercase tracking-[.25em] text-cyan-300/80 sm:text-[11px]"
          >
            Robotics
            <span className="mx-3 text-slate-600">•</span>
            Control Systems
            <span className="mx-3 text-slate-600">•</span>
            Autonomous Systems
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="mt-12 font-mono text-[10px] uppercase leading-6 tracking-[.3em] text-slate-400 sm:text-xs"
          >
            A Journey Towards
            <br />
            Intelligent Machines
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              boxShadow: [
                '0 0 15px rgba(34,211,238,.10)',
                '0 0 35px rgba(34,211,238,.24)',
                '0 0 15px rgba(34,211,238,.10)',
              ],
            }}
            transition={{
              opacity: { delay: 2.25, duration: 0.7 },
              y: { delay: 2.25, duration: 0.7 },
              boxShadow: {
                delay: 2.8,
                duration: 2.2,
                repeat: Infinity,
              },
            }}
            onClick={enterPortfolio}
            className="group mt-10 inline-flex min-w-[280px] items-center justify-center gap-4 rounded-full border border-cyan-300/60 bg-cyan-300/[.035] px-9 py-4 font-mono text-xs uppercase tracking-[.18em] text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:bg-cyan-300/[.09]"
          >
            Enter Portfolio

            <FiArrowRight className="text-cyan-300 transition-transform duration-300 group-hover:translate-x-2" />
          </motion.button>
        </div>
      </div>

      {/* Bottom interface */}
      <div className="absolute bottom-7 left-8 hidden font-mono text-[8px] uppercase tracking-[.3em] text-cyan-300/40 md:block">
        Explore&nbsp;&nbsp;•&nbsp;&nbsp;Learn&nbsp;&nbsp;•&nbsp;&nbsp;Build
      </div>

      <div className="absolute bottom-7 right-8 hidden font-mono text-[8px] uppercase tracking-[.3em] text-cyan-300/40 md:block">
        Innovation Lives Here
      </div>

      <style>{`
        .intro-brain {
          animation: brainFloat 5s ease-in-out infinite;
        }

        .brain-path {
          stroke-dasharray: 8 5;
          animation: brainDash 7s linear infinite;
        }

        .brain-signal {
          stroke-dasharray: 5 8;
          animation: brainSignal 2.5s linear infinite;
        }

        .brain-core {
          animation: brainPulse 1.8s ease-in-out infinite;
        }

        .earth-orbit {
          animation: orbitSpin 24s linear infinite;
        }

        .earth-globe {
          animation: globeFloat 5s ease-in-out infinite;
        }

        .earth-lines {
          animation: earthRotate 12s linear infinite;
        }

        @keyframes brainFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes brainDash {
          to {
            stroke-dashoffset: -100;
          }
        }

        @keyframes brainSignal {
          to {
            stroke-dashoffset: -80;
          }
        }

        @keyframes brainPulse {
          0%, 100% {
            opacity: .45;
            filter: drop-shadow(0 0 2px #22d3ee);
          }

          50% {
            opacity: 1;
            filter: drop-shadow(0 0 10px #22d3ee);
          }
        }

        @keyframes orbitSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes earthRotate {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes globeFloat {
          0%, 100% {
            box-shadow: 0 0 25px rgba(34,211,238,.06);
          }

          50% {
            box-shadow: 0 0 55px rgba(34,211,238,.18);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-brain,
          .brain-path,
          .brain-signal,
          .brain-core,
          .earth-orbit,
          .earth-globe,
          .earth-lines {
            animation: none !important;
          }
        }
      `}</style>
    </motion.div>
  )
}
