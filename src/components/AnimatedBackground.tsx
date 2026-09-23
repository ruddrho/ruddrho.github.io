import { useEffect, useRef } from 'react'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let width = 0
    let height = 0

    const mouse = {
      x: -9999,
      y: -9999,
    }

    const dots = Array.from({ length: 55 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00016,
      vy: (Math.random() - 0.5) * 0.00016,
    }))

    const resize = () => {
      width = canvas.width = innerWidth * devicePixelRatio
      height = canvas.height = innerHeight * devicePixelRatio
    }

    const move = (e: MouseEvent) => {
      mouse.x = e.clientX * devicePixelRatio
      mouse.y = e.clientY * devicePixelRatio
    }

    resize()

    addEventListener('resize', resize)
    addEventListener('mousemove', move)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      dots.forEach((d) => {
        d.x = (d.x + d.vx + 1) % 1
        d.y = (d.y + d.vy + 1) % 1
      })

      for (let i = 0; i < dots.length; i++) {
        const a = dots[i]
        const ax = a.x * width
        const ay = a.y * height

        // Particle
        ctx.beginPath()
        ctx.arc(
          ax,
          ay,
          1.2 * devicePixelRatio,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = 'rgba(103,232,249,.28)'
        ctx.fill()

        // Network connections
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j]
          const bx = b.x * width
          const by = b.y * height

          const dist = Math.hypot(
            ax - bx,
            ay - by
          )

          if (dist < 150 * devicePixelRatio) {
            ctx.beginPath()
            ctx.moveTo(ax, ay)
            ctx.lineTo(bx, by)

            ctx.strokeStyle = `rgba(
              34,
              211,
              238,
              ${0.08 * (1 - dist / (150 * devicePixelRatio))}
            )`

            ctx.stroke()
          }
        }

        // Mouse interaction
        const md = Math.hypot(
          ax - mouse.x,
          ay - mouse.y
        )

        if (md < 180 * devicePixelRatio) {
          ctx.beginPath()
          ctx.moveTo(ax, ay)
          ctx.lineTo(mouse.x, mouse.y)

          ctx.strokeStyle =
            'rgba(168,85,247,.10)'

          ctx.stroke()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      removeEventListener('mousemove', move)
    }
  }, [])

  return (
    <>
      {/* =========================================
          FULL WEBSITE ROBOTICS WATERMARK
      ========================================== */}
      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage:
            "url('/robotics-watermark.png')",

          backgroundSize: 'cover',

          backgroundPosition: 'center center',

          opacity: 0.14,

          filter:
            'saturate(0.65) contrast(1.15)',
        }}
        aria-hidden="true"
      />

      {/* =========================================
          DARK NAVY OVERLAY

          Keeps text readable while allowing
          robotic hands to remain visible.
      ========================================== */}
      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          bg-[#050816]/45
        "
        aria-hidden="true"
      />

      {/* =========================================
          EXISTING ANIMATED PARTICLE NETWORK
      ========================================== */}
      <canvas
        ref={canvasRef}
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          h-full
          w-full
          opacity-80
        "
        aria-hidden="true"
      />
    </>
  )
}
