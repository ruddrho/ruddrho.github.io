import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { NeuralNetworkBackground } from './NeuralNetworkBackground'
import { AnimatedHumanFace } from './AnimatedHumanFace'

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
    const profileFibers: NeuralFiber[] = []
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
        x: p0.x * mt2 * mt + 3 * p1.x * mt2 * t + 3 * p2.x * mt * t2 + p3.x * t2 * t,
        y: p0.y * mt2 * mt + 3 * p1.y * mt2 * t + 3 * p2.y * mt * t2 + p3.y * t2 * t,
      }
    }

    function sampleBezier(
      p0: FiberPoint,
      p1: FiberPoint,
      p2: FiberPoint,
      p3: FiberPoint,
      count = 28
    ) {
      const points: FiberPoint[] = []
      for (let i = 0; i <= count; i++) {
        points.push(cubicPoint(i / count, p0, p1, p2, p3))
      }
      return points
    }

    function jitterPoint(point: FiberPoint, amount: number): FiberPoint {
      return {
        x: point.x + (Math.random() - 0.5) * amount,
        y: point.y + (Math.random() - 0.5) * amount,
      }
    }

    function colorForRegion(frontBias: number) {
      const r = Math.random()
      if (frontBias > 0.72) {
        if (r < 0.58) return 0
        if (r < 0.84) return 1
        if (r < 0.95) return 2
        if (r < 0.99) return 3
        return 4
      }
      if (r < 0.34) return 0
      if (r < 0.54) return 1
      if (r < 0.75) return 2
      if (r < 0.96) return 3
      return 4
    }

    function addFiber(
      target: NeuralFiber[],
      points: FiberPoint[],
      colorIndex: number,
      widthValue: number,
      alpha: number,
      delay: number,
      speed: number
    ) {
      target.push({
        points,
        colorIndex,
        width: widthValue,
        alpha,
        delay,
        speed,
        phase: Math.random() * Math.PI * 2,
        sparkOffset: Math.random(),
      })
    }

    function buildHumanFibers() {
      fibers.length = 0
      profileFibers.length = 0

      const mobile = window.innerWidth < 768
      const interiorCount = mobile ? 250 : 520
      const profileCount = mobile ? 32 : 72
      const backCount = mobile ? 22 : 46

      // Exact right-facing facial silhouette. These guides make the nose,
      // lips, chin and jaw readable even when hundreds of fibres overlap.
      const profileSegments: [FiberPoint, FiberPoint, FiberPoint, FiberPoint][] = [
        [{ x: 575, y: 105 }, { x: 635, y: 135 }, { x: 675, y: 205 }, { x: 667, y: 275 }],
        [{ x: 667, y: 275 }, { x: 664, y: 318 }, { x: 680, y: 345 }, { x: 698, y: 369 }],
        [{ x: 698, y: 369 }, { x: 710, y: 385 }, { x: 711, y: 401 }, { x: 719, y: 413 }],
        [{ x: 719, y: 413 }, { x: 731, y: 430 }, { x: 755, y: 442 }, { x: 750, y: 456 }],
        [{ x: 750, y: 456 }, { x: 746, y: 469 }, { x: 724, y: 474 }, { x: 704, y: 478 }],
        [{ x: 704, y: 478 }, { x: 694, y: 482 }, { x: 692, y: 489 }, { x: 700, y: 497 }],
        [{ x: 700, y: 497 }, { x: 710, y: 504 }, { x: 715, y: 511 }, { x: 710, y: 519 }],
        [{ x: 710, y: 519 }, { x: 705, y: 526 }, { x: 694, y: 530 }, { x: 687, y: 533 }],
        [{ x: 687, y: 533 }, { x: 698, y: 539 }, { x: 704, y: 547 }, { x: 699, y: 556 }],
        [{ x: 699, y: 556 }, { x: 691, y: 565 }, { x: 678, y: 570 }, { x: 668, y: 575 }],
        [{ x: 668, y: 575 }, { x: 662, y: 586 }, { x: 666, y: 598 }, { x: 659, y: 610 }],
        [{ x: 659, y: 610 }, { x: 650, y: 632 }, { x: 635, y: 651 }, { x: 613, y: 665 }],
        [{ x: 613, y: 665 }, { x: 588, y: 681 }, { x: 556, y: 689 }, { x: 526, y: 696 }],
        [{ x: 526, y: 696 }, { x: 501, y: 704 }, { x: 490, y: 719 }, { x: 490, y: 744 }],
        [{ x: 490, y: 744 }, { x: 493, y: 798 }, { x: 518, y: 850 }, { x: 545, y: 920 }],
      ]

      const backSegments: [FiberPoint, FiberPoint, FiberPoint, FiberPoint][] = [
        [{ x: 545, y: 920 }, { x: 470, y: 885 }, { x: 390, y: 855 }, { x: 310, y: 815 }],
        [{ x: 310, y: 815 }, { x: 235, y: 770 }, { x: 205, y: 700 }, { x: 212, y: 710 }],
        [{ x: 212, y: 710 }, { x: 220, y: 645 }, { x: 193, y: 585 }, { x: 188, y: 520 }],
        [{ x: 188, y: 520 }, { x: 172, y: 390 }, { x: 185, y: 245 }, { x: 270, y: 145 }],
        [{ x: 270, y: 145 }, { x: 350, y: 52 }, { x: 490, y: 35 }, { x: 575, y: 105 }],
      ]

      // Strong layered facial outline. The earlier version lacked this,
      // which is why it looked like a feather-shaped bundle instead of a face.
      for (let copy = 0; copy < profileCount; copy++) {
        const offset = (copy - profileCount / 2) * 0.17
        const points: FiberPoint[] = []
        for (const segment of profileSegments) {
          const sampled = sampleBezier(
            jitterPoint({ x: segment[0].x + offset, y: segment[0].y }, 2.2),
            jitterPoint({ x: segment[1].x + offset, y: segment[1].y }, 3.5),
            jitterPoint({ x: segment[2].x + offset, y: segment[2].y }, 3.5),
            jitterPoint({ x: segment[3].x + offset, y: segment[3].y }, 2.2),
            8
          )
          if (points.length) sampled.shift()
          points.push(...sampled)
        }
        addFiber(
          profileFibers,
          points,
          copy % 9 === 0 ? 3 : copy % 13 === 0 ? 2 : copy % 17 === 0 ? 4 : 0,
          0.35 + Math.random() * 0.75,
          0.25 + Math.random() * 0.48,
          0.04 + Math.random() * 0.14,
          0.95 + Math.random() * 0.28
        )
      }

      // Back/crown silhouette completes the skull without creating a spiky fan.
      for (let copy = 0; copy < backCount; copy++) {
        const points: FiberPoint[] = []
        for (const segment of backSegments) {
          const sampled = sampleBezier(
            jitterPoint(segment[0], 4),
            jitterPoint(segment[1], 8),
            jitterPoint(segment[2], 8),
            jitterPoint(segment[3], 4),
            9
          )
          if (points.length) sampled.shift()
          points.push(...sampled)
        }
        addFiber(
          profileFibers,
          points,
          Math.random() < 0.45 ? 3 : Math.random() < 0.58 ? 2 : 0,
          0.3 + Math.random() * 0.65,
          0.14 + Math.random() * 0.30,
          0.16 + Math.random() * 0.18,
          0.82 + Math.random() * 0.30
        )
      }

      // Interior neural fibres travel from the rear skull/neck toward precise
      // facial landmarks. This creates a woven head instead of a filled blob.
      const faceTargets: FiberPoint[] = [
        { x: 667, y: 280 }, { x: 695, y: 365 }, { x: 718, y: 412 },
        { x: 748, y: 455 }, { x: 704, y: 478 }, { x: 700, y: 497 },
        { x: 710, y: 519 }, { x: 687, y: 533 }, { x: 699, y: 556 },
        { x: 668, y: 575 }, { x: 659, y: 610 }, { x: 613, y: 665 },
        { x: 526, y: 696 }, { x: 490, y: 744 },
      ]

      for (let i = 0; i < interiorCount; i++) {
        const targetBase = faceTargets[Math.floor(Math.random() * faceTargets.length)]
        const target = jitterPoint(targetBase, targetBase.x > 690 ? 8 : 20)

        const sourceRoll = Math.random()
        let start: FiberPoint
        if (sourceRoll < 0.56) {
          start = {
            x: 205 + Math.random() * 250,
            y: 150 + Math.random() * 470,
          }
        } else if (sourceRoll < 0.82) {
          start = {
            x: 300 + Math.random() * 210,
            y: 610 + Math.random() * 235,
          }
        } else {
          start = {
            x: 380 + Math.random() * 175,
            y: 270 + Math.random() * 300,
          }
        }

        const c1: FiberPoint = {
          x: start.x + (target.x - start.x) * (0.24 + Math.random() * 0.16),
          y: start.y + (Math.random() - 0.5) * 120,
        }
        const c2: FiberPoint = {
          x: start.x + (target.x - start.x) * (0.68 + Math.random() * 0.13),
          y: target.y + (Math.random() - 0.5) * 95,
        }

        addFiber(
          fibers,
          sampleBezier(start, c1, c2, target, mobile ? 18 : 24),
          colorForRegion(target.x / 760),
          0.25 + Math.random() * 0.78,
          0.10 + Math.random() * 0.38,
          0.08 + Math.random() * 0.32,
          0.82 + Math.random() * 0.42
        )
      }

      // Eye/brow and jaw accent fibres are intentionally explicit so the
      // viewer reads a human face immediately.
      const accents: FiberPoint[][] = [
        sampleBezier({ x: 615, y: 393 }, { x: 640, y: 382 }, { x: 662, y: 389 }, { x: 680, y: 402 }, 22),
        sampleBezier({ x: 625, y: 407 }, { x: 644, y: 414 }, { x: 659, y: 414 }, { x: 671, y: 406 }, 18),
        sampleBezier({ x: 520, y: 555 }, { x: 575, y: 535 }, { x: 635, y: 535 }, { x: 687, y: 533 }, 22),
        sampleBezier({ x: 470, y: 620 }, { x: 535, y: 620 }, { x: 590, y: 640 }, { x: 613, y: 665 }, 22),
      ]
      accents.forEach((points, index) => {
        for (let copy = 0; copy < (mobile ? 3 : 7); copy++) {
          addFiber(
            profileFibers,
            points.map((p) => jitterPoint(p, 2.8)),
            index === 1 ? 1 : copy % 4 === 0 ? 2 : 0,
            0.42 + Math.random() * 0.55,
            0.30 + Math.random() * 0.38,
            0.18 + index * 0.035,
            0.95 + Math.random() * 0.2
          )
        }
      })
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
      if (reveal <= 0 || fiber.points.length < 2) return
      const maxIndex = Math.max(
        1,
        Math.min(fiber.points.length - 1, Math.floor((fiber.points.length - 1) * reveal))
      )
      const rgb = HUMAN_NEURAL_COLORS[fiber.colorIndex]
      const pulse = 0.76 + Math.sin(time * 0.002 + fiber.phase) * 0.24

      ctx.beginPath()
      for (let index = 0; index <= maxIndex; index++) {
        const point = fiber.points[index]
        const progress = index / Math.max(1, fiber.points.length - 1)
        const wave = Math.sin(time * 0.00125 + fiber.phase + progress * 7) * (0.55 + progress * 1.25)
        const cursorDepth = progress * (4 + fiber.width * 2)
        const x = baseX + point.x * scale + wave * scale + smoothX * cursorDepth * 1.6
        const y = baseY + point.y * scale + Math.cos(time * 0.0011 + fiber.phase + progress * 6) * 0.8 * scale + smoothY * cursorDepth
        if (index === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      if (glowPass) {
        ctx.strokeStyle = `rgba(${rgb},${fiber.alpha * 0.09 * pulse})`
        ctx.lineWidth = (fiber.width * 3.3 + 0.8) * scale
        ctx.shadowBlur = 8
        ctx.shadowColor = `rgba(${rgb},.38)`
      } else {
        ctx.strokeStyle = `rgba(${rgb},${fiber.alpha * pulse})`
        ctx.lineWidth = Math.max(0.32, fiber.width * scale)
        ctx.shadowBlur = 0
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    function drawCollection(
      collection: NeuralFiber[],
      masterFormation: number,
      baseX: number,
      baseY: number,
      scale: number,
      time: number
    ) {
      for (const glowPass of [true, false]) {
        for (const fiber of collection) {
          const localFormation = clamp(
            (masterFormation - fiber.delay) * fiber.speed * 2.65,
            0,
            1
          )
          drawFiber(fiber, easeOutCubic(localFormation), baseX, baseY, scale, time, glowPass)
        }
      }
    }

    function draw(time: number) {
      ctx.clearRect(0, 0, width, height)
      smoothX += (mouse.nx - smoothX) * 0.035
      smoothY += (mouse.ny - smoothY) * 0.035

      const mobile = width < 768
      const targetHeight = mobile ? height * 0.48 : height * 0.74
      const scale = targetHeight / 920
      const baseX = mobile ? width * 0.5 - (760 * scale) / 2 : width * 0.035
      const baseY = mobile ? height * 0.035 : height * 0.095
      const elapsed = (time - startTime) / 3600
      const masterFormation = easeOutCubic(elapsed)

      // Formation core around the cheek/jaw, matching the reference's birth point.
      if (masterFormation < 0.78) {
        const coreX = baseX + 610 * scale
        const coreY = baseY + 525 * scale
        const radius = (14 + masterFormation * 28) * scale
        const glow = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, radius)
        glow.addColorStop(0, `rgba(224,247,255,${0.46 - masterFormation * 0.22})`)
        glow.addColorStop(0.3, `rgba(34,211,238,${0.28 - masterFormation * 0.10})`)
        glow.addColorStop(0.7, `rgba(236,72,153,${0.10 - masterFormation * 0.04})`)
        glow.addColorStop(1, 'rgba(34,211,238,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(coreX, coreY, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Interior first, crisp anatomical outline last.
      drawCollection(fibers, masterFormation, baseX, baseY, scale, time)
      drawCollection(profileFibers, masterFormation, baseX, baseY, scale, time)

      if (masterFormation > 0.48) {
        const all = [...fibers, ...profileFibers]
        const signalTime = time * 0.00017
        for (let i = 0; i < all.length; i += 17) {
          const fiber = all[i]
          const travel = (signalTime + fiber.sparkOffset) % 1
          const pointIndex = Math.min(
            fiber.points.length - 1,
            Math.floor(travel * (fiber.points.length - 1))
          )
          const point = fiber.points[pointIndex]
          const rgb = HUMAN_NEURAL_COLORS[fiber.colorIndex]
          const px = baseX + point.x * scale + smoothX * travel * 7
          const py = baseY + point.y * scale + smoothY * travel * 5
          ctx.beginPath()
          ctx.arc(px, py, Math.max(0.6, 0.95 * scale), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${rgb},.82)`
          ctx.shadowBlur = 8
          ctx.shadowColor = `rgba(${rgb},.75)`
          ctx.fill()
          ctx.shadowBlur = 0
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
          ANIMATED HUMAN POINT-CLOUD FACE
          The PNG is used only as an invisible geometry mask inside
          AnimatedHumanFace. No static image is rendered on screen.
      ================================================= */}

      <motion.div
        initial={{ opacity: 0, x: -35, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-[2.5vw] top-[6vh] z-[4] h-[84vh] w-[43vw] md:block"
      >
        <AnimatedHumanFace />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 0.82, scale: 1 }}
        transition={{ duration: 1.1 }}
        className="absolute left-[-8vw] top-[8vh] z-[4] h-[45vh] w-[76vw] md:hidden"
      >
        <AnimatedHumanFace />
      </motion.div>

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
