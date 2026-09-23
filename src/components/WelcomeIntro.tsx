import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

type WelcomeIntroProps = {
  onEnter: () => void
}

type Particle = {
  x: number
  y: number
  homeX: number
  homeY: number
  size: number
  phase: number
  depth: number
  red: boolean
  scatter: number
}

export function WelcomeIntro({ onEnter }: WelcomeIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const particles: Particle[] = []

    const mouse = {
      x: width / 2,
      y: height / 2,
      nx: 0,
      ny: 0,
    }

    let smoothX = 0
    let smoothY = 0

    /*
      HUMAN PROFILE MASK

      Instead of generating particles inside an ellipse,
      we first draw a real right-facing human silhouette
      onto an invisible canvas.

      Particles are then sampled from that silhouette.
    */
    function buildHumanParticles() {
      particles.length = 0

      const mask = document.createElement('canvas')
      const maskCtx = mask.getContext('2d')

      if (!maskCtx) return

      mask.width = 760
      mask.height = 920

      maskCtx.clearRect(0, 0, mask.width, mask.height)
      maskCtx.fillStyle = '#ffffff'

      maskCtx.beginPath()

      // Neck / rear shoulder
      maskCtx.moveTo(175, 900)
      maskCtx.bezierCurveTo(190, 830, 205, 765, 210, 700)

      // Back of neck
      maskCtx.bezierCurveTo(218, 640, 195, 590, 188, 520)

      // Back of skull
      maskCtx.bezierCurveTo(175, 390, 188, 245, 275, 145)
      maskCtx.bezierCurveTo(355, 52, 495, 35, 585, 105)

      // Crown
      maskCtx.bezierCurveTo(645, 152, 675, 215, 669, 278)

      // Forehead
      maskCtx.bezierCurveTo(666, 315, 675, 340, 697, 365)

      // Brow / nose bridge
      maskCtx.bezierCurveTo(710, 379, 711, 397, 719, 411)

      // Nose projection
      maskCtx.bezierCurveTo(729, 427, 751, 442, 748, 456)
      maskCtx.bezierCurveTo(745, 469, 723, 474, 705, 477)

      // Under nose
      maskCtx.bezierCurveTo(695, 480, 692, 489, 700, 496)

      // Philtrum / upper lip
      maskCtx.bezierCurveTo(708, 503, 714, 510, 710, 518)

      // Lips
      maskCtx.bezierCurveTo(706, 525, 694, 528, 688, 533)
      maskCtx.bezierCurveTo(698, 538, 704, 546, 699, 555)
      maskCtx.bezierCurveTo(692, 565, 677, 568, 668, 574)

      // Lower lip to chin
      maskCtx.bezierCurveTo(663, 582, 666, 594, 661, 605)
      maskCtx.bezierCurveTo(653, 627, 638, 649, 615, 663)

      // Jaw
      maskCtx.bezierCurveTo(590, 679, 557, 687, 526, 694)
      maskCtx.bezierCurveTo(501, 701, 490, 717, 490, 741)

      // Front neck
      maskCtx.bezierCurveTo(492, 790, 515, 842, 535, 900)

      maskCtx.closePath()
      maskCtx.fill()

      /*
        Ear cut-out creates additional facial readability.
      */
      maskCtx.globalCompositeOperation = 'destination-out'

      maskCtx.beginPath()
      maskCtx.ellipse(
        500,
        455,
        48,
        72,
        -0.12,
        0,
        Math.PI * 2
      )
      maskCtx.fill()

      maskCtx.globalCompositeOperation = 'source-over'

      const imageData = maskCtx.getImageData(
        0,
        0,
        mask.width,
        mask.height
      )

      const density =
        window.innerWidth < 768 ? 5200 : 12500

      let attempts = 0

      while (
        particles.length < density &&
        attempts < density * 40
      ) {
        attempts++

        const x = Math.floor(Math.random() * mask.width)
        const y = Math.floor(Math.random() * mask.height)

        const alpha =
          imageData.data[(y * mask.width + x) * 4 + 3]

        if (alpha < 100) continue

        const normalizedX = x / mask.width

        /*
          Red/magenta particles are concentrated toward
          the rear of the head.
        */
        const redChance =
          normalizedX < 0.42
            ? 0.34
            : normalizedX < 0.55
              ? 0.12
              : 0.025

        particles.push({
          x,
          y,
          homeX: x,
          homeY: y,
          size: Math.random() * 1.25 + 0.35,
          phase: Math.random() * Math.PI * 2,
          depth: Math.random(),
          red: Math.random() < redChance,
          scatter:
            normalizedX < 0.45
              ? Math.random() * 85
              : Math.random() * 18,
        })
      }

      /*
        Additional dispersed particles behind the skull.
      */
      const extra =
        window.innerWidth < 768 ? 450 : 1300

      for (let i = 0; i < extra; i++) {
        const x = 70 + Math.random() * 270
        const y = 120 + Math.random() * 650

        particles.push({
          x,
          y,
          homeX: x,
          homeY: y,
          size: Math.random() * 1.4 + 0.35,
          phase: Math.random() * Math.PI * 2,
          depth: Math.random(),
          red: Math.random() > 0.3,
          scatter: 60 + Math.random() * 170,
        })
      }
    }

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = width * dpr
      canvas.height = height * dpr

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      buildHumanParticles()
    }

    function handleMouseMove(event: MouseEvent) {
      mouse.x = event.clientX
      mouse.y = event.clientY

      mouse.nx =
        event.clientX / window.innerWidth - 0.5

      mouse.ny =
        event.clientY / window.innerHeight - 0.5
    }

    function draw(time: number) {
      ctx.clearRect(0, 0, width, height)

      smoothX += (mouse.nx - smoothX) * 0.035
      smoothY += (mouse.ny - smoothY) * 0.035

      const mobile = width < 768

      const targetHeight = mobile
        ? height * 0.52
        : height * 0.82

      const scale = targetHeight / 920

      const baseX = mobile
        ? width * 0.5 - (760 * scale) / 2
        : width * 0.075

      const baseY = mobile
        ? height * 0.05
        : height * 0.09

      const breathe =
        1 + Math.sin(time * 0.00125) * 0.007

      for (const p of particles) {
        const rearFactor =
          Math.max(0, 1 - p.homeX / 400)

        const scatterWave =
          Math.sin(time * 0.0007 + p.phase)

        const scatterX =
          -p.scatter *
          rearFactor *
          (0.35 + scatterWave * 0.22)

        const scatterY =
          Math.sin(time * 0.0011 + p.phase) *
          p.scatter *
          0.13

        const driftX =
          Math.sin(time * 0.0015 + p.phase) *
          (1.2 + p.depth * 2)

        const driftY =
          Math.cos(time * 0.0012 + p.phase) *
          (1 + p.depth * 1.7)

        /*
          Cursor interaction:
          different depth layers move different amounts.
        */
        const cursorX =
          smoothX * (7 + p.depth * 20)

        const cursorY =
          smoothY * (4 + p.depth * 12)

        const centerX = 420
        const centerY = 470

        const localX =
          (p.homeX - centerX) * breathe + centerX

        const localY =
          (p.homeY - centerY) * breathe + centerY

        const px =
          baseX +
          localX * scale +
          scatterX * scale +
          driftX +
          cursorX

        const py =
          baseY +
          localY * scale +
          scatterY * scale +
          driftY +
          cursorY

        const pulse =
          0.5 +
          Math.sin(time * 0.0022 + p.phase) * 0.5

        if (p.red) {
          ctx.fillStyle = `rgba(244,63,94,${
            0.25 + pulse * 0.55
          })`
        } else {
          ctx.fillStyle = `rgba(34,211,238,${
            0.28 + pulse * 0.6
          })`
        }

        ctx.beginPath()

        ctx.arc(
          px,
          py,
          p.size * (0.75 + p.depth * 0.7),
          0,
          Math.PI * 2
        )

        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)

      window.removeEventListener(
        'resize',
        resize
      )

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      )
    }
  }, [])

  function enterPortfolio() {
    setLeaving(true)

    window.setTimeout(() => {
      onEnter()
    }, 1150)
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={
        leaving
          ? {
              opacity: 0,
              scale: 1.035,
              filter: 'blur(12px)',
            }
          : {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
            }
      }
      transition={{
        duration: 1.1,
        ease: 'easeInOut',
      }}
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#01040a]"
    >
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,.11) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,.11) 1px, transparent 1px)
          `,
          backgroundSize: '70px 70px',
        }}
      />

      {/* Scan line */}
      <div className="intro-scan pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

      {/* Ambient lighting */}
      <div className="pointer-events-none absolute -left-[10%] top-[5%] h-[85vh] w-[65vw] rounded-full bg-cyan-500/[.035] blur-[150px]" />

      <div className="pointer-events-none absolute left-[5%] top-[15%] h-[65vh] w-[35vw] rounded-full bg-rose-500/[.025] blur-[150px]" />

      {/* HUMAN PARTICLES */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
      />

      {/* INITIALIZATION */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
        }}
        className="absolute left-6 top-7 z-20 hidden font-mono text-[9px] uppercase leading-5 tracking-[.16em] text-cyan-300/60 md:block"
      >
        <div>Initializing...</div>
        <div>Loading Systems...</div>
        <div>Calibrating Vision...</div>
        <div>Connecting Modules...</div>

        <div className="text-cyan-300">
          Ready.
        </div>
      </motion.div>

      {/* LEFT TECH LABELS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute left-7 top-[33%] z-20 hidden font-mono text-[8px] uppercase leading-5 tracking-[.14em] text-cyan-200/50 xl:block"
      >
        <div>AI</div>
        <div>Robotics</div>
        <div>Control</div>
        <div>Simulation</div>
        <div>Research</div>
        <div>Innovation</div>

        <div className="mt-4 h-px w-10 bg-cyan-300/40" />
      </motion.div>

      {/* LARGE ANIMATED BRAIN */}
      <motion.div
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.8,
          duration: 1,
        }}
        className="absolute left-[50%] top-[5%] z-20 hidden -translate-x-1/2 lg:block"
      >
        <div className="brain-panel relative h-[180px] w-[280px] overflow-hidden rounded-xl border border-cyan-300/10 bg-[#020a13]/30 backdrop-blur-[2px]">
          <div className="absolute left-4 top-3 font-mono text-[7px] uppercase tracking-[.22em] text-cyan-300/40">
            Brain // AI Interface
          </div>

          <div className="absolute right-4 top-3 h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee]" />

          <svg
            viewBox="0 0 300 190"
            className="absolute inset-0 h-full w-full"
          >
            <g className="brain-float">
              <path
                d="M96 105
                C70 92 70 60 92 49
                C98 26 126 23 140 37
                C158 18 191 29 195 52
                C222 57 229 86 214 101
                C224 123 207 146 185 145
                C173 163 144 161 133 145
                C109 155 87 137 92 117
                C77 116 77 107 96 105Z"
                fill="rgba(34,211,238,.025)"
                stroke="rgba(34,211,238,.58)"
                strokeWidth="1"
                className="brain-outline"
              />

              <path
                d="M105 70
                L129 84
                L151 58
                L174 79
                L197 67

                M129 84
                L119 112
                L148 128
                L172 104
                L197 122

                M151 58
                L148 128

                M174 79
                L172 104"
                fill="none"
                stroke="rgba(168,85,247,.7)"
                strokeWidth="1"
                className="neural-path"
              />

              {[
                [105, 70],
                [129, 84],
                [151, 58],
                [174, 79],
                [197, 67],
                [119, 112],
                [148, 128],
                [172, 104],
                [197, 122],
              ].map(([cx, cy], index) => (
                <circle
                  key={index}
                  cx={cx}
                  cy={cy}
                  r="2.6"
                  fill={
                    index % 3 === 0
                      ? '#c084fc'
                      : '#22d3ee'
                  }
                  className="neural-node"
                  style={{
                    animationDelay: `${index * 0.17}s`,
                  }}
                />
              ))}
            </g>

            <circle
              cx="150"
              cy="94"
              r="69"
              fill="none"
              stroke="rgba(34,211,238,.12)"
              strokeDasharray="3 7"
              className="brain-ring-one"
            />

            <circle
              cx="150"
              cy="94"
              r="82"
              fill="none"
              stroke="rgba(168,85,247,.09)"
              strokeDasharray="14 10"
              className="brain-ring-two"
            />
          </svg>

          <div className="absolute bottom-4 right-4 space-y-1">
            <div className="h-[2px] w-14 bg-cyan-300/30" />
            <div className="h-[2px] w-10 bg-cyan-300/20" />
            <div className="h-[2px] w-16 bg-purple-400/20" />
          </div>
        </div>
      </motion.div>

      {/* HOLOGRAPHIC EARTH */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.85,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          delay: 1,
          duration: 1.2,
        }}
        className="absolute right-[4%] top-[5%] z-20 hidden xl:block"
      >
        <div className="relative h-[260px] w-[260px]">
          <div className="earth-ring-one absolute inset-0 rounded-full border border-cyan-300/10" />

          <div className="earth-ring-two absolute inset-4 rounded-full border border-dashed border-cyan-300/15" />

          <div className="earth-ring-three absolute inset-10 rounded-full border border-cyan-300/[.07]" />

          <div className="earth-float absolute inset-[42px] overflow-hidden rounded-full border border-cyan-300/25 bg-cyan-300/[.018] shadow-[0_0_55px_rgba(34,211,238,.08)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(34,211,238,.18),transparent_48%)]" />

            <svg
              viewBox="0 0 200 200"
              className="earth-map h-full w-full"
            >
              {/* latitude */}
              <ellipse
                cx="100"
                cy="100"
                rx="91"
                ry="34"
                fill="none"
                stroke="rgba(34,211,238,.18)"
              />

              <ellipse
                cx="100"
                cy="100"
                rx="91"
                ry="62"
                fill="none"
                stroke="rgba(34,211,238,.12)"
              />

              {/* longitude */}
              <ellipse
                cx="100"
                cy="100"
                rx="38"
                ry="91"
                fill="none"
                stroke="rgba(34,211,238,.16)"
              />

              <ellipse
                cx="100"
                cy="100"
                rx="65"
                ry="91"
                fill="none"
                stroke="rgba(34,211,238,.1)"
              />

              {/* stylized continents */}
              <path
                d="M48 55
                L62 42
                L82 39
                L93 48
                L88 60
                L75 64
                L69 75
                L57 78
                L47 69Z"
                fill="rgba(34,211,238,.09)"
                stroke="rgba(34,211,238,.55)"
                strokeWidth="1"
              />

              <path
                d="M82 81
                L98 74
                L112 82
                L107 97
                L115 110
                L105 132
                L93 145
                L84 126
                L87 108
                L77 96Z"
                fill="rgba(34,211,238,.08)"
                stroke="rgba(34,211,238,.48)"
                strokeWidth="1"
              />

              <path
                d="M118 55
                L138 48
                L158 57
                L165 72
                L150 79
                L140 72
                L128 80
                L116 69Z"
                fill="rgba(34,211,238,.08)"
                stroke="rgba(34,211,238,.48)"
                strokeWidth="1"
              />

              <circle
                cx="72"
                cy="63"
                r="2"
                fill="#22d3ee"
                className="earth-node"
              />

              <circle
                cx="138"
                cy="67"
                r="2"
                fill="#c084fc"
                className="earth-node"
              />

              <circle
                cx="100"
                cy="108"
                r="2"
                fill="#22d3ee"
                className="earth-node"
              />
            </svg>
          </div>

          <div className="absolute right-[-25px] top-[105px] font-mono text-[7px] uppercase leading-5 tracking-[.15em] text-cyan-300/40">
            <div>Vision</div>
            <div>Planning</div>
            <div>Control</div>
            <div>Perception</div>
            <div>Autonomy</div>
          </div>
        </div>
      </motion.div>

      {/* ROBOT ARM HUD */}
      <div className="robot-arm-hud pointer-events-none absolute bottom-[7%] right-[2%] z-10 hidden h-[210px] w-[260px] opacity-25 xl:block">
        <svg
          viewBox="0 0 300 230"
          className="h-full w-full"
        >
          <g
            fill="none"
            stroke="rgba(34,211,238,.65)"
            strokeWidth="1"
          >
            <ellipse
              cx="175"
              cy="205"
              rx="62"
              ry="14"
            />

            <rect
              x="145"
              y="174"
              width="60"
              height="29"
              rx="4"
            />

            <circle
              cx="174"
              cy="169"
              r="17"
            />

            <path d="M170 154 L132 115" />

            <path d="M180 154 L144 107" />

            <circle
              cx="137"
              cy="111"
              r="13"
            />

            <path d="M128 101 L164 69" />

            <path d="M144 115 L176 80" />

            <circle
              cx="170"
              cy="74"
              r="12"
            />

            <path d="M181 70 L217 88" />

            <path d="M177 82 L211 99" />

            <circle
              cx="218"
              cy="94"
              r="10"
            />

            <path d="M226 90 L251 75" />
            <path d="M226 97 L254 106" />

            <path d="M251 75 L265 67" />
            <path d="M254 106 L269 112" />
          </g>
        </svg>
      </div>

      {/* MAIN TEXT */}
      <div className="absolute inset-0 z-30 flex items-center justify-center px-6 md:justify-end md:pr-[7%] xl:pr-[10%]">
        <div className="w-full max-w-[720px] text-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.55,
              duration: 0.8,
            }}
            className="font-mono text-xs uppercase tracking-[.55em] text-cyan-100 sm:text-sm"
          >
            Welcome To
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              letterSpacing: '.18em',
              filter: 'blur(10px)',
            }}
            animate={{
              opacity: 1,
              letterSpacing: '-.035em',
              filter: 'blur(0px)',
            }}
            transition={{
              delay: 0.9,
              duration: 1.3,
            }}
            className="mt-6 whitespace-nowrap text-4xl font-semibold uppercase text-white sm:text-5xl lg:text-6xl xl:text-[4.6rem]"
          >
            RUDDRHO{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              MOLLIK
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1.5,
              duration: 0.9,
            }}
            className="mt-7 font-mono text-[9px] uppercase tracking-[.25em] text-cyan-300/80 sm:text-[11px]"
          >
            Robotics
            <span className="mx-3 text-slate-600">
              •
            </span>

            Control Systems

            <span className="mx-3 text-slate-600">
              •
            </span>

            Autonomous Systems
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1.9,
              duration: 0.8,
            }}
            className="mt-12 font-mono text-[10px] uppercase leading-6 tracking-[.3em] text-slate-400 sm:text-xs"
          >
            A Journey Towards
            <br />
            Intelligent Machines
          </motion.div>

          <motion.button
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
              boxShadow: [
                '0 0 12px rgba(34,211,238,.08)',
                '0 0 38px rgba(34,211,238,.22)',
                '0 0 12px rgba(34,211,238,.08)',
              ],
            }}
            transition={{
              opacity: {
                delay: 2.15,
                duration: 0.7,
              },

              y: {
                delay: 2.15,
                duration: 0.7,
              },

              boxShadow: {
                delay: 2.7,
                duration: 2.4,
                repeat: Infinity,
              },
            }}
            onClick={enterPortfolio}
            className="group mt-10 inline-flex min-w-[300px] items-center justify-center gap-4 rounded-full border border-cyan-300/60 bg-[#03101b]/50 px-10 py-4 font-mono text-xs uppercase tracking-[.18em] text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:bg-cyan-300/[.08]"
          >
            Enter Portfolio

            <FiArrowRight className="text-cyan-300 transition-transform duration-300 group-hover:translate-x-2" />
          </motion.button>
        </div>
      </div>

      {/* BOTTOM HUD */}
      <div className="absolute bottom-7 left-8 z-20 hidden font-mono text-[8px] uppercase tracking-[.3em] text-cyan-300/40 md:block">
        Explore&nbsp;&nbsp;•&nbsp;&nbsp;
        Learn&nbsp;&nbsp;•&nbsp;&nbsp;
        Build&nbsp;&nbsp;•&nbsp;&nbsp;
        Repeat
      </div>

      <div className="absolute bottom-7 right-8 z-20 hidden font-mono text-[8px] uppercase tracking-[.3em] text-cyan-300/40 md:block">
        Innovation Lives Here
      </div>

      <style>{`
        .intro-scan {
          animation: introScan 7s linear infinite;
        }

        .brain-panel {
          animation: brainPanelFloat 5s ease-in-out infinite;
        }

        .brain-float {
          transform-origin: center;
          animation: brainBreathe 4s ease-in-out infinite;
        }

        .brain-outline {
          stroke-dasharray: 7 5;
          animation: brainDash 8s linear infinite;
        }

        .neural-path {
          stroke-dasharray: 5 8;
          animation: neuralTravel 2.2s linear infinite;
        }

        .neural-node {
          animation: nodePulse 1.8s ease-in-out infinite;
        }

        .brain-ring-one {
          transform-origin: 150px 94px;
          animation: brainRingOne 16s linear infinite;
        }

        .brain-ring-two {
          transform-origin: 150px 94px;
          animation: brainRingTwo 23s linear infinite reverse;
        }

        .earth-ring-one {
          animation: earthRing 30s linear infinite;
        }

        .earth-ring-two {
          animation: earthRing 19s linear infinite reverse;
        }

        .earth-ring-three {
          animation: earthRing 13s linear infinite;
        }

        .earth-float {
          animation: earthFloat 5s ease-in-out infinite;
        }

        .earth-map {
          transform-origin: center;
          animation: earthMapRotate 18s linear infinite;
        }

        .earth-node {
          animation: earthNode 1.7s ease-in-out infinite;
        }

        .robot-arm-hud {
          animation: robotHud 4.5s ease-in-out infinite;
        }

        @keyframes introScan {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }

          10% {
            opacity: .45;
          }

          90% {
            opacity: .18;
          }

          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes brainPanelFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes brainBreathe {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.035);
          }
        }

        @keyframes brainDash {
          to {
            stroke-dashoffset: -120;
          }
        }

        @keyframes neuralTravel {
          to {
            stroke-dashoffset: -80;
          }
        }

        @keyframes nodePulse {
          0%, 100% {
            opacity: .35;
          }

          50% {
            opacity: 1;
            filter: drop-shadow(0 0 7px #22d3ee);
          }
        }

        @keyframes brainRingOne {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes brainRingTwo {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes earthRing {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes earthFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes earthMapRotate {
          0% {
            transform: rotateY(0deg);
          }

          50% {
            transform: rotateY(18deg);
          }

          100% {
            transform: rotateY(0deg);
          }
        }

        @keyframes earthNode {
          0%, 100% {
            opacity: .35;
          }

          50% {
            opacity: 1;
            filter: drop-shadow(0 0 8px #22d3ee);
          }
        }

        @keyframes robotHud {
          0%, 100% {
            transform: translateY(0);
            opacity: .2;
          }

          50% {
            transform: translateY(-7px);
            opacity: .38;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-scan,
          .brain-panel,
          .brain-float,
          .brain-outline,
          .neural-path,
          .neural-node,
          .brain-ring-one,
          .brain-ring-two,
          .earth-ring-one,
          .earth-ring-two,
          .earth-ring-three,
          .earth-float,
          .earth-map,
          .earth-node,
          .robot-arm-hud {
            animation: none !important;
          }
        }
      `}</style>
    </motion.div>
  )
}
