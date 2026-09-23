import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { NeuralNetworkBackground } from './NeuralNetworkBackground'

type WelcomeIntroProps = {
  onEnter: () => void
}

type FiberPoint = {
  x: number
  y: number
}

type NeuralFiber = {
  points: FiberPoint[]
  colorIndex: number
  width: number
  alpha: number
  delay: number
  speed: number
  phase: number
  sparkOffset: number
}

const HUMAN_NEURAL_COLORS = [
  '34,211,238',  // cyan
  '56,189,248',  // electric blue
  '139,92,246',  // violet
  '236,72,153',  // magenta / pink
  '251,146,60',  // warm orange accent
]

export function WelcomeIntro({ onEnter }: WelcomeIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const canvasElement = canvasRef.current
    if (!canvasElement) return

    const context = canvasElement.getContext('2d')
    if (!context) return

    const canvas: HTMLCanvasElement = canvasElement
    const ctx: CanvasRenderingContext2D = context

    let animationFrame = 0
    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let startTime = performance.now()

    const fibers: NeuralFiber[] = []
    const mouse = { nx: 0, ny: 0 }
    let smoothX = 0
    let smoothY = 0

    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(max, value))

    const easeOutCubic = (value: number) =>
      1 - Math.pow(1 - clamp(value, 0, 1), 3)

    function cubicPoint(
      t: number,
      p0: FiberPoint,
      p1: FiberPoint,
      p2: FiberPoint,
      p3: FiberPoint
    ): FiberPoint {
      const mt = 1 - t
      const mt2 = mt * mt
      const t2 = t * t

      return {
        x:
          p0.x * mt2 * mt +
          3 * p1.x * mt2 * t +
          3 * p2.x * mt * t2 +
          p3.x * t2 * t,
        y:
          p0.y * mt2 * mt +
          3 * p1.y * mt2 * t +
          3 * p2.y * mt * t2 +
          p3.y * t2 * t,
      }
    }

    function insideHead(x: number, y: number) {
      // Main skull / brain volume.
      const skullX = (x - 385) / 245
      const skullY = (y - 395) / 325
      const skull = skullX * skullX + skullY * skullY <= 1

      // Lower face / jaw volume.
      const faceX = (x - 520) / 205
      const faceY = (y - 535) / 235
      const face = faceX * faceX + faceY * faceY <= 1

      // Neck volume.
      const neck = x > 320 && x < 545 && y > 650 && y < 920

      // Keep the front edge readable instead of making a round blob.
      const foreheadLimit = y < 350 ? 655 : 735
      const lowerFaceLimit = y > 590 ? 670 : 755
      const frontLimit = Math.min(foreheadLimit, lowerFaceLimit)

      return (skull || face || neck) && x < frontLimit && x > 125
    }

    function randomHeadPoint(): FiberPoint {
      for (let attempt = 0; attempt < 80; attempt++) {
        const x = 120 + Math.random() * 610
        const y = 70 + Math.random() * 810
        if (insideHead(x, y)) return { x, y }
      }

      return {
        x: 260 + Math.random() * 320,
        y: 240 + Math.random() * 420,
      }
    }

    function pickColorIndex(target: FiberPoint) {
      const r = Math.random()

      // Face/front stays cool and clean.
      if (target.x > 560) {
        if (r < 0.58) return 0
        if (r < 0.86) return 1
        if (r < 0.96) return 2
        if (r < 0.99) return 3
        return 4
      }

      // Brain/skull gets the cyan-violet-pink mixture seen in the reference.
      if (r < 0.34) return 0
      if (r < 0.55) return 1
      if (r < 0.76) return 2
      if (r < 0.96) return 3
      return 4
    }

    function buildHumanFibers() {
      fibers.length = 0

      const mobile = window.innerWidth < 768
      const fiberCount = mobile ? 320 : 760
      const samplesPerFiber = mobile ? 18 : 26

      for (let i = 0; i < fiberCount; i++) {
        const target = randomHeadPoint()

        // Reference-like formation core: strands originate around the face,
        // jaw and upper-neck region, then bloom backward into the skull.
        const sourceBand = Math.random()
        let start: FiberPoint

        if (sourceBand < 0.48) {
          start = {
            x: 620 + Math.random() * 52,
            y: 405 + Math.random() * 185,
          }
        } else if (sourceBand < 0.78) {
          start = {
            x: 525 + Math.random() * 105,
            y: 575 + Math.random() * 120,
          }
        } else {
          start = {
            x: 425 + Math.random() * 100,
            y: 690 + Math.random() * 155,
          }
        }

        const bend = 45 + Math.random() * 150
        const verticalWave = (Math.random() - 0.5) * 190

        const control1: FiberPoint = {
          x: start.x - bend * (0.30 + Math.random() * 0.42),
          y: start.y + verticalWave * 0.35,
        }

        const control2: FiberPoint = {
          x:
            target.x +
            (start.x - target.x) * (0.16 + Math.random() * 0.22) +
            (Math.random() - 0.5) * 70,
          y:
            target.y +
            (Math.random() - 0.5) * 120 -
            verticalWave * 0.18,
        }

        const points: FiberPoint[] = []

        for (let sample = 0; sample <= samplesPerFiber; sample++) {
          const t = sample / samplesPerFiber
          points.push(cubicPoint(t, start, control1, control2, target))
        }

        // Delay depends partly on how far back/up the strand must grow.
        // Face appears first; skull and crown bloom afterwards.
        const distanceFromCore = clamp((650 - target.x) / 520, 0, 1)
        const crownDelay = clamp((390 - target.y) / 430, 0, 1)

        fibers.push({
          points,
          colorIndex: pickColorIndex(target),
          width: 0.35 + Math.random() * 1.05,
          alpha: 0.22 + Math.random() * 0.60,
          delay:
            0.02 +
            distanceFromCore * 0.34 +
            crownDelay * 0.15 +
            Math.random() * 0.20,
          speed: 0.75 + Math.random() * 0.65,
          phase: Math.random() * Math.PI * 2,
          sparkOffset: Math.random(),
        })
      }

      // A smaller group of loose fibres creates the wispy edges visible
      // around the crown/back of the reference animation.
      const looseCount = mobile ? 45 : 120

      for (let i = 0; i < looseCount; i++) {
        const y = 160 + Math.random() * 590
        const target: FiberPoint = {
          x: 105 + Math.random() * 245,
          y,
        }
        const start: FiberPoint = {
          x: 585 + Math.random() * 75,
          y: 430 + Math.random() * 210,
        }
        const control1: FiberPoint = {
          x: 500 + Math.random() * 80,
          y: start.y + (Math.random() - 0.5) * 180,
        }
        const control2: FiberPoint = {
          x: 250 + Math.random() * 120,
          y: target.y + (Math.random() - 0.5) * 150,
        }
        const points: FiberPoint[] = []

        for (let sample = 0; sample <= samplesPerFiber; sample++) {
          const t = sample / samplesPerFiber
          points.push(cubicPoint(t, start, control1, control2, target))
        }

        fibers.push({
          points,
          colorIndex: Math.random() < 0.55 ? 0 : Math.random() < 0.7 ? 2 : 3,
          width: 0.3 + Math.random() * 0.7,
          alpha: 0.14 + Math.random() * 0.32,
          delay: 0.28 + Math.random() * 0.36,
          speed: 0.72 + Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2,
          sparkOffset: Math.random(),
        })
      }
    }

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildHumanFibers()
      startTime = performance.now()
    }

    function handleMouseMove(event: MouseEvent) {
      mouse.nx = event.clientX / window.innerWidth - 0.5
      mouse.ny = event.clientY / window.innerHeight - 0.5
    }

    function drawFiber(
      fiber: NeuralFiber,
      reveal: number,
      baseX: number,
      baseY: number,
      scale: number,
      time: number,
      glowPass: boolean
    ) {
      if (reveal <= 0) return

      const maxIndex = Math.max(
        1,
        Math.min(
          fiber.points.length - 1,
          Math.floor((fiber.points.length - 1) * reveal)
        )
      )

      const rgb = HUMAN_NEURAL_COLORS[fiber.colorIndex]
      const cursorStrength = 5 + smoothX * 3
      const pulse = 0.72 + Math.sin(time * 0.002 + fiber.phase) * 0.28

      ctx.beginPath()

      for (let index = 0; index <= maxIndex; index++) {
        const point = fiber.points[index]
        const progress = index / Math.max(1, fiber.points.length - 1)

        // Flowing fibres never become perfectly static.
        const wave =
          Math.sin(time * 0.00145 + fiber.phase + progress * 8) *
          (1.2 + progress * 2.8)

        const depthParallax = progress * cursorStrength
        const x =
          baseX +
          point.x * scale +
          wave * scale +
          smoothX * depthParallax * 2.4
        const y =
          baseY +
          point.y * scale +
          Math.cos(time * 0.0012 + fiber.phase + progress * 7) *
            1.8 *
            scale +
          smoothY * depthParallax * 1.6

        if (index === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (glowPass) {
        ctx.strokeStyle = `rgba(${rgb},${fiber.alpha * 0.11 * pulse})`
        ctx.lineWidth = (fiber.width * 4.2 + 1.4) * scale
        ctx.shadowBlur = 10
        ctx.shadowColor = `rgba(${rgb},.45)`
      } else {
        ctx.strokeStyle = `rgba(${rgb},${fiber.alpha * pulse})`
        ctx.lineWidth = Math.max(0.35, fiber.width * scale)
        ctx.shadowBlur = 0
      }

      ctx.stroke()
      ctx.shadowBlur = 0
    }

    function draw(time: number) {
      ctx.clearRect(0, 0, width, height)

      smoothX += (mouse.nx - smoothX) * 0.035
      smoothY += (mouse.ny - smoothY) * 0.035

      const mobile = width < 768
      const targetHeight = mobile ? height * 0.48 : height * 0.74
      const scale = targetHeight / 920
      const baseX = mobile
        ? width * 0.5 - (760 * scale) / 2
        : width * 0.035
      const baseY = mobile ? height * 0.035 : height * 0.095

      // About 3.4 s to fully form, close to the visual rhythm of the reference.
      const elapsed = (time - startTime) / 3400
      const masterFormation = easeOutCubic(elapsed)

      // Soft luminous core visible at the beginning of formation.
      if (masterFormation < 0.82) {
        const coreX = baseX + 610 * scale
        const coreY = baseY + 535 * scale
        const coreRadius = (18 + masterFormation * 34) * scale
        const coreGlow = ctx.createRadialGradient(
          coreX,
          coreY,
          0,
          coreX,
          coreY,
          coreRadius
        )
        coreGlow.addColorStop(0, `rgba(224,247,255,${0.50 - masterFormation * 0.25})`)
        coreGlow.addColorStop(0.25, `rgba(34,211,238,${0.30 - masterFormation * 0.12})`)
        coreGlow.addColorStop(0.62, `rgba(168,85,247,${0.13 - masterFormation * 0.05})`)
        coreGlow.addColorStop(1, 'rgba(34,211,238,0)')
        ctx.fillStyle = coreGlow
        ctx.beginPath()
        ctx.arc(coreX, coreY, coreRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Glow pass first, crisp fibre pass second.
      for (const glowPass of [true, false]) {
        for (let i = 0; i < fibers.length; i++) {
          const fiber = fibers[i]
          const localFormation = clamp(
            (masterFormation - fiber.delay) * fiber.speed * 2.35,
            0,
            1
          )
          const reveal = easeOutCubic(localFormation)
          drawFiber(fiber, reveal, baseX, baseY, scale, time, glowPass)
        }
      }

      // Moving signal sparks travel through selected completed fibres.
      if (masterFormation > 0.34) {
        const signalTime = time * 0.00019

        for (let i = 0; i < fibers.length; i += 11) {
          const fiber = fibers[i]
          const localFormation = clamp(
            (masterFormation - fiber.delay) * fiber.speed * 2.35,
            0,
            1
          )
          if (localFormation < 0.55) continue

          const travel = (signalTime + fiber.sparkOffset) % 1
          const pointIndex = Math.min(
            fiber.points.length - 1,
            Math.floor(travel * (fiber.points.length - 1))
          )
          const point = fiber.points[pointIndex]
          const rgb = HUMAN_NEURAL_COLORS[fiber.colorIndex]
          const px =
            baseX +
            point.x * scale +
            smoothX * travel * 12
          const py =
            baseY +
            point.y * scale +
            smoothY * travel * 8

          const radius = (1.2 + (i % 3) * 0.35) * scale
          ctx.beginPath()
          ctx.arc(px, py, Math.max(0.8, radius), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${rgb},.92)`
          ctx.shadowBlur = 10
          ctx.shadowColor = `rgba(${rgb},.9)`
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }

      // A few tiny nodes make the finished head feel like a living data mesh.
      if (masterFormation > 0.62) {
        for (let i = 4; i < fibers.length; i += 23) {
          const fiber = fibers[i]
          const point = fiber.points[fiber.points.length - 1]
          const rgb = HUMAN_NEURAL_COLORS[fiber.colorIndex]
          const twinkle = 0.35 + Math.sin(time * 0.0024 + fiber.phase) * 0.30
          const px = baseX + point.x * scale + smoothX * 7
          const py = baseY + point.y * scale + smoothY * 5

          ctx.beginPath()
          ctx.arc(px, py, Math.max(0.55, 1.15 * scale), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${rgb},${twinkle})`
          ctx.fill()
        }
      }

      animationFrame = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    animationFrame = window.requestAnimationFrame(draw)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  /*
    =======================================================
    ENTER PORTFOLIO
    =======================================================
  */

  function enterPortfolio() {
    if (leaving) {
      return
    }

    setLeaving(true)

    window.setTimeout(() => {
      onEnter()
    }, 1150)
  }

  return (
    <motion.div
      initial={{
        opacity: 1,
      }}
      animate={
        leaving
          ? {
              opacity: 0,
              scale: 1.035,
              filter:
                'blur(12px)',
            }
          : {
              opacity: 1,
              scale: 1,
              filter:
                'blur(0px)',
            }
      }
      transition={{
        duration: 1.1,
        ease: 'easeInOut',
      }}
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#01040a]"
    >
      {/* =================================================
          BLUEPRINT GRID
      ================================================= */}

      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(34,211,238,.11) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(34,211,238,.11) 1px,
              transparent 1px
            )
          `,
          backgroundSize:
            '70px 70px',
        }}
      />
       {/* Interactive Neural Network Background */}
      
      <NeuralNetworkBackground />

      {/* SCANNING LINE */}

      <div className="intro-scan pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

      {/* AMBIENT LIGHT */}

      <div className="pointer-events-none absolute -left-[10%] top-[5%] h-[85vh] w-[65vw] rounded-full bg-cyan-500/[.035] blur-[150px]" />

      <div className="pointer-events-none absolute left-[5%] top-[15%] h-[65vh] w-[35vw] rounded-full bg-rose-500/[.03] blur-[150px]" />

      {/* =================================================
          HUMAN PARTICLES
      ================================================= */}

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
      />

      {/* =================================================
          INITIALIZATION HUD
      ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          x: -20,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          delay: 0.3,
          duration: 0.8,
        }}
        className="absolute left-6 top-7 z-20 hidden font-mono text-[9px] uppercase leading-5 tracking-[.16em] text-cyan-300/60 md:block"
      >
        <div>
          Initializing...
        </div>

        <div>
          Loading Systems...
        </div>

        <div>
          Calibrating Vision...
        </div>

        <div>
          Connecting Modules...
        </div>

        <div className="text-cyan-300">
          Ready.
        </div>
      </motion.div>

      {/* LEFT TECH HUD */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1.2,
        }}
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

      {/* =================================================
          ANIMATED HOLOGRAPHIC BRAIN
      ================================================= */}

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
        className="absolute left-[49%] top-[4%] z-20 hidden -translate-x-1/2 lg:block"
      >
        <div className="brain-panel relative h-[205px] w-[315px] overflow-hidden rounded-xl border border-cyan-300/10 bg-[#020a13]/30 backdrop-blur-[2px]">
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
                d="
                  M96 105
                  C70 92 70 60 92 49
                  C98 26 126 23 140 37
                  C158 18 191 29 195 52
                  C222 57 229 86 214 101
                  C224 123 207 146 185 145
                  C173 163 144 161 133 145
                  C109 155 87 137 92 117
                  C77 116 77 107 96 105Z
                "
                fill="rgba(34,211,238,.025)"
                stroke="rgba(34,211,238,.68)"
                strokeWidth="1"
                className="brain-outline"
              />

              <path
                d="
                  M105 70
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
                  L172 104
                "
                fill="none"
                stroke="rgba(168,85,247,.78)"
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
              ].map(
                (
                  point,
                  index
                ) => {
                  const cx =
                    point[0]

                  const cy =
                    point[1]

                  return (
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
                        animationDelay:
                          `${index * 0.17}s`,
                      }}
                    />
                  )
                }
              )}
            </g>

            <circle
              cx="150"
              cy="94"
              r="69"
              fill="none"
              stroke="rgba(34,211,238,.14)"
              strokeDasharray="3 7"
              className="brain-ring-one"
            />

            <circle
              cx="150"
              cy="94"
              r="82"
              fill="none"
              stroke="rgba(168,85,247,.12)"
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

      {/* =================================================
          ANIMATED EARTH
      ================================================= */}

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
        className="absolute right-[3%] top-[4%] z-20 hidden xl:block"
      >
        <div className="relative h-[285px] w-[285px]">
          <div className="earth-ring-one absolute inset-0 rounded-full border border-cyan-300/10" />

          <div className="earth-ring-two absolute inset-4 rounded-full border border-dashed border-cyan-300/15" />

          <div className="earth-ring-three absolute inset-10 rounded-full border border-cyan-300/[.09]" />

          <div className="earth-float absolute inset-[42px] overflow-hidden rounded-full border border-cyan-300/30 bg-cyan-300/[.025] shadow-[0_0_65px_rgba(34,211,238,.16)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(34,211,238,.22),transparent_48%)]" />

            <svg
              viewBox="0 0 200 200"
              className="earth-map h-full w-full"
            >
              {/* LATITUDE */}

              <ellipse
                cx="100"
                cy="100"
                rx="91"
                ry="34"
                fill="none"
                stroke="rgba(34,211,238,.20)"
              />

              <ellipse
                cx="100"
                cy="100"
                rx="91"
                ry="62"
                fill="none"
                stroke="rgba(34,211,238,.14)"
              />

              {/* LONGITUDE */}

              <ellipse
                cx="100"
                cy="100"
                rx="38"
                ry="91"
                fill="none"
                stroke="rgba(34,211,238,.18)"
              />

              <ellipse
                cx="100"
                cy="100"
                rx="65"
                ry="91"
                fill="none"
                stroke="rgba(34,211,238,.12)"
              />

              {/* NORTH AMERICA */}

              <path
                d="
                  M48 55
                  L62 42
                  L82 39
                  L93 48
                  L88 60
                  L75 64
                  L69 75
                  L57 78
                  L47 69Z
                "
                fill="rgba(34,211,238,.10)"
                stroke="rgba(34,211,238,.65)"
                strokeWidth="1"
              />

              {/* SOUTH AMERICA */}

              <path
                d="
                  M82 81
                  L98 74
                  L112 82
                  L107 97
                  L115 110
                  L105 132
                  L93 145
                  L84 126
                  L87 108
                  L77 96Z
                "
                fill="rgba(34,211,238,.09)"
                stroke="rgba(34,211,238,.58)"
                strokeWidth="1"
              />

              {/* EUROPE / ASIA */}

              <path
                d="
                  M118 55
                  L138 48
                  L158 57
                  L165 72
                  L150 79
                  L140 72
                  L128 80
                  L116 69Z
                "
                fill="rgba(34,211,238,.09)"
                stroke="rgba(34,211,238,.58)"
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

          <div className="absolute right-[-15px] top-[115px] font-mono text-[7px] uppercase leading-5 tracking-[.15em] text-cyan-300/45">
            <div>Vision</div>
            <div>Planning</div>
            <div>Control</div>
            <div>Perception</div>
            <div>Autonomy</div>
          </div>
        </div>
      </motion.div>

      {/* =================================================
          ROBOT ARM BLUEPRINT
      ================================================= */}

      <div className="robot-arm-hud pointer-events-none absolute bottom-[6%] right-[2%] z-10 hidden h-[230px] w-[285px] opacity-40 xl:block">
        <svg
          viewBox="0 0 300 230"
          className="h-full w-full"
        >
          <g
            fill="none"
            stroke="rgba(34,211,238,.72)"
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

          <circle
            cx="137"
            cy="111"
            r="3"
            fill="#22d3ee"
            className="robot-node"
          />

          <circle
            cx="170"
            cy="74"
            r="3"
            fill="#22d3ee"
            className="robot-node"
          />

          <circle
            cx="218"
            cy="94"
            r="3"
            fill="#c084fc"
            className="robot-node"
          />
        </svg>
      </div>

      {/* =================================================
          MAIN WELCOME CONTENT
      ================================================= */}

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
              letterSpacing:
                '.18em',
              filter:
                'blur(10px)',
            }}
            animate={{
              opacity: 1,
              letterSpacing:
                '-.035em',
              filter:
                'blur(0px)',
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
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
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
            type="button"
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
            onClick={
              enterPortfolio
            }
            disabled={leaving}
            className="group mt-10 inline-flex min-w-[300px] items-center justify-center gap-4 rounded-full border border-cyan-300/60 bg-[#03101b]/50 px-10 py-4 font-mono text-xs uppercase tracking-[.18em] text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:bg-cyan-300/[.08] disabled:pointer-events-none"
          >
            Enter Portfolio

            <FiArrowRight className="text-cyan-300 transition-transform duration-300 group-hover:translate-x-2" />
          </motion.button>
        </div>
      </div>

      {/* =================================================
          BOTTOM HUD
      ================================================= */}

      <div className="absolute bottom-7 left-8 z-20 hidden font-mono text-[8px] uppercase tracking-[.3em] text-cyan-300/40 md:block">
        Explore
        &nbsp;&nbsp;•&nbsp;&nbsp;
        Learn
        &nbsp;&nbsp;•&nbsp;&nbsp;
        Build
        &nbsp;&nbsp;•&nbsp;&nbsp;
        Repeat
      </div>

      <div className="absolute bottom-7 right-8 z-20 hidden font-mono text-[8px] uppercase tracking-[.3em] text-cyan-300/40 md:block">
        Innovation Lives Here
      </div>

      {/* =================================================
          ANIMATION CSS
      ================================================= */}

      <style>{`
        .intro-scan {
          animation:
            introScan 7s linear infinite;
        }

        .brain-panel {
          animation:
            brainPanelFloat 5s
            ease-in-out infinite;
        }

        .brain-float {
          transform-origin: center;

          animation:
            brainBreathe 4s
            ease-in-out infinite;
        }

        .brain-outline {
          stroke-dasharray: 7 5;

          animation:
            brainDash 8s
            linear infinite;
        }

        .neural-path {
          stroke-dasharray: 5 8;

          animation:
            neuralTravel 2.2s
            linear infinite;
        }

        .neural-node {
          animation:
            nodePulse 1.8s
            ease-in-out infinite;
        }

        .brain-ring-one {
          transform-origin:
            150px 94px;

          animation:
            brainRingOne 16s
            linear infinite;
        }

        .brain-ring-two {
          transform-origin:
            150px 94px;

          animation:
            brainRingTwo 23s
            linear infinite reverse;
        }

        .earth-ring-one {
          animation:
            earthRing 30s
            linear infinite;
        }

        .earth-ring-two {
          animation:
            earthRing 19s
            linear infinite reverse;
        }

        .earth-ring-three {
          animation:
            earthRing 13s
            linear infinite;
        }

        .earth-float {
          animation:
            earthFloat 5s
            ease-in-out infinite;
        }

        .earth-map {
          transform-origin: center;

          animation:
            earthMapRotate 18s
            ease-in-out infinite;
        }

        .earth-node {
          animation:
            earthNode 1.7s
            ease-in-out infinite;
        }

        .robot-arm-hud {
          animation:
            robotHud 4.5s
            ease-in-out infinite;
        }

        .robot-node {
          animation:
            robotNodePulse 1.7s
            ease-in-out infinite;
        }

        @keyframes introScan {
          0% {
            transform:
              translateY(-20px);

            opacity: 0;
          }

          10% {
            opacity: .45;
          }

          90% {
            opacity: .18;
          }

          100% {
            transform:
              translateY(100vh);

            opacity: 0;
          }
        }

        @keyframes brainPanelFloat {
          0%,
          100% {
            transform:
              translateY(0);
          }

          50% {
            transform:
              translateY(-7px);
          }
        }

        @keyframes brainBreathe {
          0%,
          100% {
            transform:
              scale(1);
          }

          50% {
            transform:
              scale(1.04);
          }
        }

        @keyframes brainDash {
          to {
            stroke-dashoffset:
              -120;
          }
        }

        @keyframes neuralTravel {
          to {
            stroke-dashoffset:
              -80;
          }
        }

        @keyframes nodePulse {
          0%,
          100% {
            opacity: .35;
          }

          50% {
            opacity: 1;

            filter:
              drop-shadow(
                0 0 7px #22d3ee
              );
          }
        }

        @keyframes brainRingOne {
          to {
            transform:
              rotate(360deg);
          }
        }

        @keyframes brainRingTwo {
          to {
            transform:
              rotate(360deg);
          }
        }

        @keyframes earthRing {
          to {
            transform:
              rotate(360deg);
          }
        }

        @keyframes earthFloat {
          0%,
          100% {
            transform:
              translateY(0);
          }

          50% {
            transform:
              translateY(-8px);
          }
        }

        @keyframes earthMapRotate {
          0%,
          100% {
            transform:
              scaleX(1);
          }

          50% {
            transform:
              scaleX(.82);
          }
        }

        @keyframes earthNode {
          0%,
          100% {
            opacity: .35;
          }

          50% {
            opacity: 1;

            filter:
              drop-shadow(
                0 0 8px #22d3ee
              );
          }
        }

        @keyframes robotHud {
          0%,
          100% {
            transform:
              translateY(0);

            opacity: .28;
          }

          50% {
            transform:
              translateY(-7px);

            opacity: .55;
          }
        }

        @keyframes robotNodePulse {
          0%,
          100% {
            opacity: .3;
          }

          50% {
            opacity: 1;

            filter:
              drop-shadow(
                0 0 8px #22d3ee
              );
          }
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
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
          .robot-arm-hud,
          .robot-node {
            animation:
              none !important;
          }
        }
      `}</style>
    </motion.div>
  )
}
