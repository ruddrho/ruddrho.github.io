import { useEffect, useRef } from 'react'

type Node = {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  radius: number
  phase: number
  colorIndex: number
  depth: number
}

const COLORS = [
  '34,211,238',  // cyan
  '56,189,248',  // electric blue
  '139,92,246',  // purple
  '236,72,153',  // magenta
  '249,115,22',  // warm orange
]

export function NeuralNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasElement = canvasRef.current
    if (!canvasElement) return

    const context = canvasElement.getContext('2d')
    if (!context) return

    const canvas: HTMLCanvasElement = canvasElement
    const ctx: CanvasRenderingContext2D = context

    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let animationFrame = 0

    const nodes: Node[] = []

    const mouse = {
      x: width * 0.5,
      y: height * 0.5,
      targetX: width * 0.5,
      targetY: height * 0.5,
      active: false,
    }

    function createNodes() {
      nodes.length = 0

      const area = width * height

      let count = Math.floor(area / 16000)

      if (width < 768) {
        count = Math.min(count, 48)
      } else {
        count = Math.max(75, Math.min(count, 125))
      }

      for (let i = 0; i < count; i++) {
        const x = Math.random() * width
        const y = Math.random() * height

        /*
          Cyan/blue remain dominant.
          Purple, magenta and orange are accents.
        */
        const random = Math.random()

        let colorIndex = 0

        if (random > 0.84) {
          colorIndex = 4
        } else if (random > 0.69) {
          colorIndex = 3
        } else if (random > 0.49) {
          colorIndex = 2
        } else if (random > 0.25) {
          colorIndex = 1
        }

        nodes.push({
          x,
          y,
          baseX: x,
          baseY: y,

          vx:
            (Math.random() - 0.5) * 0.09,

          vy:
            (Math.random() - 0.5) * 0.09,

          radius:
            0.7 + Math.random() * 1.45,

          phase:
            Math.random() * Math.PI * 2,

          colorIndex,

          depth:
            0.35 + Math.random() * 0.65,
        })
      }
    }

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

      createNodes()
    }

    function handleMouseMove(event: MouseEvent) {
      mouse.targetX = event.clientX
      mouse.targetY = event.clientY
      mouse.active = true
    }

    function handleMouseLeave() {
      mouse.active = false
    }

    function draw(time: number) {
      ctx.clearRect(
        0,
        0,
        width,
        height
      )

      /*
        Smooth cursor tracking.
      */

      mouse.x +=
        (mouse.targetX - mouse.x) * 0.075

      mouse.y +=
        (mouse.targetY - mouse.y) * 0.075

      /*
        Move neural nodes.
      */

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        /*
          Natural floating movement.
        */

        node.baseX += node.vx
        node.baseY += node.vy

        if (
          node.baseX < -80 ||
          node.baseX > width + 80
        ) {
          node.vx *= -1
        }

        if (
          node.baseY < -80 ||
          node.baseY > height + 80
        ) {
          node.vy *= -1
        }

        const breatheX =
          Math.sin(
            time * 0.00035 +
              node.phase
          ) *
          9 *
          node.depth

        const breatheY =
          Math.cos(
            time * 0.00042 +
              node.phase
          ) *
          7 *
          node.depth

        let cursorX = 0
        let cursorY = 0

        /*
          =================================================
          CURSOR NEURAL REACTION
          =================================================
        */

        if (mouse.active) {
          const dx =
            mouse.x - node.baseX

          const dy =
            mouse.y - node.baseY

          const distance =
            Math.sqrt(
              dx * dx + dy * dy
            )

          const influenceRadius = 330

          if (
            distance <
              influenceRadius &&
            distance > 0
          ) {
            const strength =
              1 -
              distance /
                influenceRadius

            /*
              Nodes gently bend toward cursor.
            */

            cursorX =
              (dx / distance) *
              strength *
              32 *
              node.depth

            cursorY =
              (dy / distance) *
              strength *
              32 *
              node.depth

            /*
              Small orbital distortion.
            */

            cursorX +=
              (-dy / distance) *
              strength *
              Math.sin(
                time * 0.0015 +
                  node.phase
              ) *
              8

            cursorY +=
              (dx / distance) *
              strength *
              Math.sin(
                time * 0.0015 +
                  node.phase
              ) *
              8
          }
        }

        node.x =
          node.baseX +
          breatheX +
          cursorX

        node.y =
          node.baseY +
          breatheY +
          cursorY
      }

      /*
        =================================================
        NETWORK CONNECTIONS
        =================================================
      */

      const connectionDistance =
        width < 768 ? 115 : 155

      for (
        let i = 0;
        i < nodes.length;
        i++
      ) {
        const a = nodes[i]

        for (
          let j = i + 1;
          j < nodes.length;
          j++
        ) {
          const b = nodes[j]

          const dx = a.x - b.x
          const dy = a.y - b.y

          const distance =
            Math.sqrt(
              dx * dx + dy * dy
            )

          if (
            distance <
            connectionDistance
          ) {
            const opacity =
              (
                1 -
                distance /
                  connectionDistance
              ) *
              0.16

            const color =
              COLORS[
                (
                  a.colorIndex +
                  b.colorIndex
                ) %
                  COLORS.length
              ]

            const gradient =
              ctx.createLinearGradient(
                a.x,
                a.y,
                b.x,
                b.y
              )

            gradient.addColorStop(
              0,
              `rgba(${COLORS[a.colorIndex]},${opacity})`
            )

            gradient.addColorStop(
              0.5,
              `rgba(${color},${opacity * 0.8})`
            )

            gradient.addColorStop(
              1,
              `rgba(${COLORS[b.colorIndex]},${opacity})`
            )

            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)

            ctx.strokeStyle =
              gradient

            ctx.lineWidth = 0.55
            ctx.stroke()
          }
        }
      }

      /*
        =================================================
        CURSOR → NEURAL CONNECTIONS
        =================================================
      */

      if (mouse.active) {
        for (
          let i = 0;
          i < nodes.length;
          i++
        ) {
          const node = nodes[i]

          const dx =
            mouse.x - node.x

          const dy =
            mouse.y - node.y

          const distance =
            Math.sqrt(
              dx * dx + dy * dy
            )

          if (distance < 220) {
            const strength =
              1 - distance / 220

            const gradient =
              ctx.createLinearGradient(
                node.x,
                node.y,
                mouse.x,
                mouse.y
              )

            gradient.addColorStop(
              0,
              `rgba(${COLORS[node.colorIndex]},${strength * 0.30})`
            )

            gradient.addColorStop(
              1,
              `rgba(34,211,238,${strength * 0.04})`
            )

            ctx.beginPath()

            ctx.moveTo(
              node.x,
              node.y
            )

            /*
              Slight curved neural connection.
            */

            const midX =
              (
                node.x +
                mouse.x
              ) /
                2 +
              Math.sin(
                time * 0.001 +
                  node.phase
              ) *
                10

            const midY =
              (
                node.y +
                mouse.y
              ) /
                2 +
              Math.cos(
                time * 0.001 +
                  node.phase
              ) *
                10

            ctx.quadraticCurveTo(
              midX,
              midY,
              mouse.x,
              mouse.y
            )

            ctx.strokeStyle =
              gradient

            ctx.lineWidth =
              0.65 +
              strength * 0.55

            ctx.stroke()
          }
        }

        /*
          Cursor neural pulse rings.
        */

        const pulse =
          (
            time * 0.055
          ) %
          42

        ctx.beginPath()

        ctx.arc(
          mouse.x,
          mouse.y,
          8 + pulse,
          0,
          Math.PI * 2
        )

        ctx.strokeStyle =
          `rgba(34,211,238,${
            0.16 *
            (
              1 -
              pulse / 42
            )
          })`

        ctx.lineWidth = 0.8
        ctx.stroke()

        ctx.beginPath()

        ctx.arc(
          mouse.x,
          mouse.y,
          3.5,
          0,
          Math.PI * 2
        )

        ctx.fillStyle =
          'rgba(125,211,252,.75)'

        ctx.shadowBlur = 18

        ctx.shadowColor =
          'rgba(34,211,238,.85)'

        ctx.fill()

        ctx.shadowBlur = 0
      }

      /*
        =================================================
        DRAW NODES
        =================================================
      */

      for (
        let i = 0;
        i < nodes.length;
        i++
      ) {
        const node = nodes[i]

        const pulse =
          0.5 +
          Math.sin(
            time * 0.0018 +
              node.phase
          ) *
            0.5

        const rgb =
          COLORS[node.colorIndex]

        /*
          Large glow only on selected nodes.
          Keeps background elegant instead of noisy.
        */

        if (
          node.radius > 1.65
        ) {
          const glowRadius =
            9 +
            pulse * 13

          const glow =
            ctx.createRadialGradient(
              node.x,
              node.y,
              0,
              node.x,
              node.y,
              glowRadius
            )

          glow.addColorStop(
            0,
            `rgba(${rgb},${0.28 + pulse * 0.18})`
          )

          glow.addColorStop(
            1,
            `rgba(${rgb},0)`
          )

          ctx.beginPath()

          ctx.arc(
            node.x,
            node.y,
            glowRadius,
            0,
            Math.PI * 2
          )

          ctx.fillStyle = glow
          ctx.fill()
        }

        ctx.beginPath()

        ctx.arc(
          node.x,
          node.y,
          node.radius *
            (
              0.8 +
              pulse * 0.35
            ),
          0,
          Math.PI * 2
        )

        ctx.fillStyle =
          `rgba(${rgb},${
            0.42 +
            pulse * 0.42
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

    document.addEventListener(
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

      document.removeEventListener(
        'mouseleave',
        handleMouseLeave
      )
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-80"
    />
  )
}
