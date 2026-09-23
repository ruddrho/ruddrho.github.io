import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { NeuralNetworkBackground } from './NeuralNetworkBackground'

type WelcomeIntroProps = {
  onEnter: () => void
}

type Particle = {
  homeX: number
  homeY: number

  startX: number
  startY: number

  x: number
  y: number

  size: number
  phase: number
  depth: number

  colorIndex: number
  scatter: number

  connectionRadius: number
  signalOffset: number
}

export function WelcomeIntro({ onEnter }: WelcomeIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const canvasElement = canvasRef.current

    if (!canvasElement) {
      return
    }

    const context = canvasElement.getContext('2d')

    if (!context) {
      return
    }

    const canvas: HTMLCanvasElement = canvasElement
    const ctx: CanvasRenderingContext2D = context

    let animationFrame = 0
    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const particles: Particle[] = []

    const HUMAN_COLORS = [
      '34,211,238',   // Cyan
      '56,189,248',   // Electric blue
      '139,92,246',   // Purple
      '236,72,153',   // Magenta / pink
      '249,115,22',   // Warm orange signal nodes
    ]

    const mouse = {
      nx: 0,
      ny: 0,
      active: false,
    }

    let smoothX = 0
    let smoothY = 0
    let formationStartedAt = performance.now()

    /*
      =====================================================
      HUMAN PARTICLE GENERATOR
      =====================================================
    */

    function buildHumanParticles() {
      particles.length = 0
      formationStartedAt = performance.now()

      const mask = document.createElement('canvas')
      const maskContext = mask.getContext('2d')

      if (!maskContext) {
        return
      }

      mask.width = 760
      mask.height = 920

      maskContext.clearRect(
        0,
        0,
        mask.width,
        mask.height
      )

      maskContext.fillStyle = '#ffffff'
      maskContext.beginPath()

      /*
        RIGHT-FACING HUMAN PROFILE
        Keep the original silhouette unchanged.
      */

      maskContext.moveTo(150, 920)

      maskContext.bezierCurveTo(
        175, 840,
        205, 775,
        212, 710
      )

      maskContext.bezierCurveTo(
        218, 650,
        194, 585,
        188, 520
      )

      maskContext.bezierCurveTo(
        172, 390,
        185, 245,
        270, 145
      )

      maskContext.bezierCurveTo(
        350, 52,
        490, 35,
        582, 103
      )

      maskContext.bezierCurveTo(
        640, 147,
        672, 210,
        667, 275
      )

      maskContext.bezierCurveTo(
        665, 315,
        673, 340,
        695, 365
      )

      maskContext.bezierCurveTo(
        708, 380,
        710, 397,
        718, 411
      )

      maskContext.bezierCurveTo(
        729, 428,
        752, 442,
        749, 456
      )

      maskContext.bezierCurveTo(
        746, 469,
        724, 475,
        705, 477
      )

      maskContext.bezierCurveTo(
        694, 480,
        692, 488,
        700, 496
      )

      maskContext.bezierCurveTo(
        709, 503,
        715, 511,
        710, 519
      )

      maskContext.bezierCurveTo(
        706, 526,
        694, 529,
        687, 533
      )

      maskContext.bezierCurveTo(
        698, 539,
        704, 547,
        699, 556
      )

      maskContext.bezierCurveTo(
        692, 565,
        678, 569,
        668, 575
      )

      maskContext.bezierCurveTo(
        663, 584,
        666, 596,
        660, 608
      )

      maskContext.bezierCurveTo(
        652, 630,
        637, 650,
        615, 664
      )

      maskContext.bezierCurveTo(
        590, 680,
        556, 688,
        526, 695
      )

      maskContext.bezierCurveTo(
        500, 702,
        489, 718,
        490, 742
      )

      maskContext.bezierCurveTo(
        492, 795,
        518, 850,
        545, 920
      )

      maskContext.closePath()
      maskContext.fill()

      /* Small ear and eye details. */

      maskContext.globalCompositeOperation =
        'destination-out'

      maskContext.beginPath()
      maskContext.ellipse(
        505,
        458,
        18,
        30,
        -0.12,
        0,
        Math.PI * 2
      )
      maskContext.fill()

      maskContext.beginPath()
      maskContext.ellipse(
        650,
        405,
        7,
        3,
        -0.08,
        0,
        Math.PI * 2
      )
      maskContext.fill()

      maskContext.globalCompositeOperation =
        'source-over'

      const imageData =
        maskContext.getImageData(
          0,
          0,
          mask.width,
          mask.height
        )

      const targetParticleCount =
        window.innerWidth < 768
          ? 4800
          : 13500

      let attempts = 0

      while (
        particles.length < targetParticleCount &&
        attempts < targetParticleCount * 50
      ) {
        attempts++

        const x = Math.floor(
          Math.random() * mask.width
        )

        const y = Math.floor(
          Math.random() * mask.height
        )

        const alpha =
          imageData.data[
            (y * mask.width + x) * 4 + 3
          ]

        if (alpha < 100) {
          continue
        }

        const normalizedX = x / mask.width
        const random = Math.random()

        /*
          5-color palette:
          front = cyan / blue
          middle = cyan / blue / purple
          rear = purple / magenta
          orange = rare signal nodes
        */

        let colorIndex = 0

        if (normalizedX > 0.62) {
          if (random < 0.60) {
            colorIndex = 0
          } else if (random < 0.88) {
            colorIndex = 1
          } else if (random < 0.97) {
            colorIndex = 2
          } else {
            colorIndex = 4
          }
        } else if (normalizedX > 0.42) {
          if (random < 0.38) {
            colorIndex = 0
          } else if (random < 0.62) {
            colorIndex = 1
          } else if (random < 0.82) {
            colorIndex = 2
          } else if (random < 0.96) {
            colorIndex = 3
          } else {
            colorIndex = 4
          }
        } else {
          if (random < 0.14) {
            colorIndex = 0
          } else if (random < 0.28) {
            colorIndex = 1
          } else if (random < 0.52) {
            colorIndex = 2
          } else if (random < 0.90) {
            colorIndex = 3
          } else {
            colorIndex = 4
          }
        }

        const rearStrength =
          Math.max(0, 1 - normalizedX)

        const scatter =
          90 +
          rearStrength * 270 +
          Math.random() * 160

        const angle =
          Math.random() * Math.PI * 2

        const startDistance =
          scatter *
          (0.55 + Math.random() * 0.75)

        let startX =
          x +
          Math.cos(angle) * startDistance

        const startY =
          y +
          Math.sin(angle) *
            startDistance * 0.72

        /*
          Pull rear particles farther left so the head
          appears to emerge from a neural data stream.
        */

        if (normalizedX < 0.52) {
          startX -=
            110 + Math.random() * 230
        }

        particles.push({
          homeX: x,
          homeY: y,
          startX,
          startY,
          x: startX,
          y: startY,
          size:
            Math.random() * 1.15 + 0.35,
          phase:
            Math.random() * Math.PI * 2,
          depth:
            Math.random(),
          colorIndex,
          scatter,
          connectionRadius:
            26 + Math.random() * 30,
          signalOffset:
            Math.random(),
        })
      }
    }

    /*
      =====================================================
      RESIZE
      =====================================================
    */

    function resize() {
      width = window.innerWidth
      height = window.innerHeight

      dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      )

      canvas.width =
        Math.floor(width * dpr)

      canvas.height =
        Math.floor(height * dpr)

      canvas.style.width =
        `${width}px`

      canvas.style.height =
        `${height}px`

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      )

      buildHumanParticles()
    }

    /*
      =====================================================
      CURSOR
      =====================================================
    */

    function handleMouseMove(
      event: MouseEvent
    ) {
      mouse.nx =
        event.clientX /
          window.innerWidth -
        0.5

      mouse.ny =
        event.clientY /
          window.innerHeight -
        0.5

      mouse.active = true
    }

    function handleMouseLeave() {
      mouse.active = false
    }

    /*
      =====================================================
      PARTICLE ANIMATION
      =====================================================
    */

    function draw(time: number) {
      ctx.clearRect(
        0,
        0,
        width,
        height
      )

      smoothX +=
        (mouse.nx - smoothX) * 0.035

      smoothY +=
        (mouse.ny - smoothY) * 0.035

      const mobile = width < 768

      const targetHeight =
        mobile
          ? height * 0.48
          : height * 0.74

      const scale =
        targetHeight / 920

      const baseX =
        mobile
          ? width * 0.5 -
            (760 * scale) / 2
          : width * 0.035

      const baseY =
        mobile
          ? height * 0.035
          : height * 0.095

      const breathe =
        1 +
        Math.sin(
          time * 0.00125
        ) * 0.007

      /*
        One-time formation:
        scattered neural cloud -> readable human head.
      */

      const formationElapsed =
        time - formationStartedAt

      const formationProgress =
        Math.max(
          0,
          Math.min(
            1,
            (formationElapsed - 180) / 2800
          )
        )

      const mouseScreenX =
        (smoothX + 0.5) * width

      const mouseScreenY =
        (smoothY + 0.5) * height

      const centerX = 420
      const centerY = 470

      /*
        PASS 1:
        calculate every particle position.
      */

      for (
        let i = 0;
        i < particles.length;
        i++
      ) {
        const p = particles[i]

        const staggered =
          Math.max(
            0,
            Math.min(
              1,
              (formationProgress -
                p.signalOffset * 0.22) /
                0.78
            )
          )

        const formed =
          1 -
          Math.pow(
            1 - staggered,
            3
          )

        const homeX =
          (p.homeX - centerX) *
            breathe +
          centerX

        const homeY =
          (p.homeY - centerY) *
            breathe +
          centerY

        /*
          Scattered particles remain alive while
          travelling toward their final head position.
        */

        const startDriftX =
          Math.sin(
            time * 0.00075 +
              p.phase
          ) *
          (5 + p.depth * 10)

        const startDriftY =
          Math.cos(
            time * 0.00062 +
              p.phase
          ) *
          (4 + p.depth * 8)

        let localX =
          (p.startX + startDriftX) *
            (1 - formed) +
          homeX * formed

        let localY =
          (p.startY + startDriftY) *
            (1 - formed) +
          homeY * formed

        /*
          After formation, keep the rear of the head
          gently dissolving / flowing like a data stream.
        */

        const rearFactor =
          Math.max(
            0,
            1 - p.homeX / 430
          )

        const rearFlow =
          formed * rearFactor

        localX +=
          -rearFlow *
          p.scatter *
          0.055 *
          (
            0.45 +
            Math.sin(
              time * 0.00065 +
                p.phase
            ) * 0.30
          )

        localY +=
          rearFlow *
          Math.sin(
            time * 0.001 +
              p.phase
          ) *
          p.scatter *
          0.018

        /*
          Fine breathing / neural vibration.
        */

        localX +=
          Math.sin(
            time * 0.00145 +
              p.phase
          ) *
          (0.8 + p.depth * 1.8) *
          formed

        localY +=
          Math.cos(
            time * 0.00118 +
              p.phase
          ) *
          (0.7 + p.depth * 1.5) *
          formed

        let px =
          baseX + localX * scale

        let py =
          baseY + localY * scale

        /*
          Whole-head cursor parallax.
        */

        px +=
          smoothX *
          (5 + p.depth * 15) *
          formed

        py +=
          smoothY *
          (3 + p.depth * 9) *
          formed

        /*
          Local cursor reaction:
          nearby neural particles bend toward the cursor
          and receive a subtle orbital distortion.
        */

        if (
          mouse.active &&
          formed > 0.45
        ) {
          const dx =
            mouseScreenX - px

          const dy =
            mouseScreenY - py

          const distance =
            Math.sqrt(
              dx * dx + dy * dy
            )

          const influenceRadius = 175

          if (
            distance < influenceRadius &&
            distance > 0
          ) {
            const strength =
              1 -
              distance / influenceRadius

            px +=
              (dx / distance) *
              strength *
              (5 + p.depth * 10)

            py +=
              (dy / distance) *
              strength *
              (5 + p.depth * 10)

            const swirl =
              Math.sin(
                time * 0.0018 +
                  p.phase
              ) *
              strength * 4

            px +=
              (-dy / distance) * swirl

            py +=
              (dx / distance) * swirl
          }
        }

        p.x = px
        p.y = py
      }

      /*
        PASS 2:
        neural mesh connections.

        Only a sampled subset is connected so the
        animation stays smooth even with 13k+ particles.
      */

      const connectionStep =
        mobile ? 24 : 18

      const connectionDistance =
        mobile ? 34 : 46

      const cellSize =
        connectionDistance

      const grid =
        new Map<string, number[]>()

      for (
        let i = 0;
        i < particles.length;
        i += connectionStep
      ) {
        const p = particles[i]

        const cellX =
          Math.floor(p.x / cellSize)

        const cellY =
          Math.floor(p.y / cellSize)

        const key =
          `${cellX},${cellY}`

        const bucket = grid.get(key)

        if (bucket) {
          bucket.push(i)
        } else {
          grid.set(key, [i])
        }
      }

      for (
        let i = 0;
        i < particles.length;
        i += connectionStep
      ) {
        const a = particles[i]

        const cellX =
          Math.floor(a.x / cellSize)

        const cellY =
          Math.floor(a.y / cellSize)

        let links = 0

        for (
          let gx = -1;
          gx <= 1 && links < 2;
          gx++
        ) {
          for (
            let gy = -1;
            gy <= 1 && links < 2;
            gy++
          ) {
            const bucket =
              grid.get(
                `${cellX + gx},${cellY + gy}`
              )

            if (!bucket) {
              continue
            }

            for (
              let k = 0;
              k < bucket.length && links < 2;
              k++
            ) {
              const j = bucket[k]

              if (j <= i) {
                continue
              }

              const b = particles[j]

              const dx = a.x - b.x
              const dy = a.y - b.y

              const distance =
                Math.sqrt(
                  dx * dx + dy * dy
                )

              const allowedDistance =
                Math.min(
                  connectionDistance,
                  (
                    a.connectionRadius +
                    b.connectionRadius
                  ) * 0.72
                )

              if (
                distance > allowedDistance
              ) {
                continue
              }

              const opacity =
                (
                  1 -
                  distance /
                    allowedDistance
                ) * 0.22

              const gradient =
                ctx.createLinearGradient(
                  a.x,
                  a.y,
                  b.x,
                  b.y
                )

              gradient.addColorStop(
                0,
                `rgba(${HUMAN_COLORS[a.colorIndex]},${opacity})`
              )

              gradient.addColorStop(
                1,
                `rgba(${HUMAN_COLORS[b.colorIndex]},${opacity})`
              )

              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.strokeStyle = gradient
              ctx.lineWidth = 0.55
              ctx.stroke()

              links++
            }
          }
        }
      }

      /*
        Cursor-to-neural links.
        This makes the head visibly react to movement.
      */

      if (mouse.active) {
        for (
          let i = 0;
          i < particles.length;
          i += connectionStep * 2
        ) {
          const p = particles[i]

          const dx =
            mouseScreenX - p.x

          const dy =
            mouseScreenY - p.y

          const distance =
            Math.sqrt(
              dx * dx + dy * dy
            )

          if (distance < 145) {
            const strength =
              1 - distance / 145

            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(
              mouseScreenX,
              mouseScreenY
            )

            ctx.strokeStyle =
              `rgba(${HUMAN_COLORS[p.colorIndex]},${strength * 0.18})`

            ctx.lineWidth = 0.55
            ctx.stroke()
          }
        }
      }

      /*
        PASS 3:
        particles + travelling neural signal.
      */

      const signalPosition =
        (time * 0.00016) % 1

      for (
        let i = 0;
        i < particles.length;
        i++
      ) {
        const p = particles[i]

        const pulse =
          0.5 +
          Math.sin(
            time * 0.0022 +
              p.phase
          ) * 0.5

        const pathPosition =
          p.homeX / 760

        let signalDistance =
          Math.abs(
            pathPosition -
              signalPosition
          )

        signalDistance =
          Math.min(
            signalDistance,
            1 - signalDistance
          )

        const signalBoost =
          Math.max(
            0,
            1 - signalDistance / 0.045
          )

        const rgb =
          HUMAN_COLORS[p.colorIndex]

        if (
          signalBoost > 0.25 &&
          i % 13 === 0
        ) {
          const glowRadius =
            5 + signalBoost * 10

          const glow =
            ctx.createRadialGradient(
              p.x,
              p.y,
              0,
              p.x,
              p.y,
              glowRadius
            )

          glow.addColorStop(
            0,
            `rgba(${rgb},${0.34 + signalBoost * 0.32})`
          )

          glow.addColorStop(
            1,
            `rgba(${rgb},0)`
          )

          ctx.beginPath()
          ctx.arc(
            p.x,
            p.y,
            glowRadius,
            0,
            Math.PI * 2
          )
          ctx.fillStyle = glow
          ctx.fill()
        }

        ctx.beginPath()

        ctx.arc(
          p.x,
          p.y,
          p.size *
            (
              0.72 +
              p.depth * 0.62 +
              signalBoost * 0.45
            ),
          0,
          Math.PI * 2
        )

        ctx.fillStyle =
          `rgba(${rgb},${
            0.28 +
            pulse * 0.54 +
            signalBoost * 0.16
          })`

        ctx.fill()
      }

      animationFrame =
        window.requestAnimationFrame(
          draw
        )
    }

    resize()

    window.addEventListener(
      'resize',
      resize
    )

    window.addEventListener(
      'mousemove',
      handleMouseMove
    )

    window.addEventListener(
      'mouseleave',
      handleMouseLeave
    )

    animationFrame =
      window.requestAnimationFrame(
        draw
      )

    return () => {
      window.cancelAnimationFrame(
        animationFrame
      )

      window.removeEventListener(
        'resize',
        resize
      )

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      )

      window.removeEventListener(
        'mouseleave',
        handleMouseLeave
      )
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
