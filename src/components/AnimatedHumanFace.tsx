import { useEffect, useRef } from 'react'

type Point = {
  tx: number
  ty: number
  sx: number
  sy: number
  x: number
  y: number
  r: number
  g: number
  b: number
  size: number
  delay: number
  phase: number
}

export function AnimatedHumanFace() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 1
    let h = 1
    let dpr = 1
    let points: Point[] = []
    let ready = false
    const start = performance.now()
    const mouse = { x: -9999, y: -9999, active: false }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = Math.max(1, rect.width)
      h = Math.max(1, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const ease = (t: number) => {
      const v = Math.max(0, Math.min(1, t))
      return 1 - Math.pow(1 - v, 3)
    }

    const buildFromImage = (img: HTMLImageElement) => {
      const off = document.createElement('canvas')
      const ow = 360
      const oh = 470
      off.width = ow
      off.height = oh
      const ox = off.getContext('2d', { willReadFrequently: true })
      if (!ox) return

      // The image is NEVER shown. It is only used as an invisible geometry mask.
      // This crop isolates the human head/neck and removes most page text.
      const sx = Math.round(img.naturalWidth * 0.055)
      const sy = Math.round(img.naturalHeight * 0.012)
      const sw = Math.round(img.naturalWidth * 0.94)
      const sh = Math.round(img.naturalHeight * 0.985)
      ox.drawImage(img, sx, sy, sw, sh, 0, 0, ow, oh)
      const data = ox.getImageData(0, 0, ow, oh).data

      const candidates: Array<{ x: number; y: number; r: number; g: number; b: number }> = []
      for (let y = 2; y < oh - 2; y += 2) {
        for (let x = 2; x < ow - 2; x += 2) {
          const i = (y * ow + x) * 4
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const max = Math.max(r, g, b)
          const min = Math.min(r, g, b)
          const saturation = max - min
          const luminous = max > 82
          const neuralHue = b > 105 && (b > r * 0.9 || b > g * 1.02) && saturation > 34
          const pinkHue = r > 100 && b > 105 && saturation > 32

          // Reject nearly-white typography/grid and retain blue/pink point-cloud pixels.
          if (luminous && (neuralHue || pinkHue) && !(r > 205 && g > 205 && b > 205)) {
            candidates.push({ x, y, r, g, b })
          }
        }
      }

      // Dense enough to read as a face, capped for smooth animation.
      const maxPoints = window.innerWidth < 768 ? 2600 : 6200
      const stride = Math.max(1, Math.floor(candidates.length / maxPoints))
      const selected = candidates.filter((_, i) => i % stride === 0).slice(0, maxPoints)

      points = selected.map((p) => {
        const nx = p.x / ow
        const ny = p.y / oh
        const angle = Math.random() * Math.PI * 2
        const radius = 80 + Math.random() * 260
        const originX = w * 0.52
        const originY = h * 0.52
        return {
          tx: nx,
          ty: ny,
          sx: originX + Math.cos(angle) * radius,
          sy: originY + Math.sin(angle) * radius,
          x: originX,
          y: originY,
          r: p.r,
          g: p.g,
          b: p.b,
          size: 0.45 + Math.random() * 1.15,
          delay: (nx * 0.34 + ny * 0.10) + Math.random() * 0.26,
          phase: Math.random() * Math.PI * 2,
        }
      })
      ready = true
    }

    const image = new Image()
    image.src = '/ai-human-face.png'
    image.onload = () => buildFromImage(image)

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }
    const onLeave = () => { mouse.active = false }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h)
      if (ready) {
        const elapsed = (time - start) / 1000
        const pulse = 0.5 + 0.5 * Math.sin(time * 0.0018)

        // Fit the sampled anatomy inside this component without changing its proportions.
        const padX = w * 0.02
        const padY = h * 0.015
        const faceW = w - padX * 2
        const faceH = h - padY * 2

        ctx.globalCompositeOperation = 'lighter'
        for (let i = 0; i < points.length; i++) {
          const p = points[i]
          const local = ease((elapsed - p.delay * 1.35) / 2.45)
          const targetX = padX + p.tx * faceW
          const targetY = padY + p.ty * faceH

          let x = p.sx + (targetX - p.sx) * local
          let y = p.sy + (targetY - p.sy) * local

          if (local > 0.92) {
            const alive = (local - 0.92) / 0.08
            x += Math.sin(time * 0.00125 + p.phase) * 1.15 * alive
            y += Math.cos(time * 0.00105 + p.phase * 1.3) * 0.9 * alive

            if (mouse.active) {
              const dx = x - mouse.x
              const dy = y - mouse.y
              const dist = Math.hypot(dx, dy)
              const radius = 105
              if (dist < radius && dist > 0.1) {
                const force = (1 - dist / radius) * 13
                x += (dx / dist) * force
                y += (dy / dist) * force
              }
            }
          }

          p.x = x
          p.y = y
          const alpha = Math.min(0.88, 0.18 + local * 0.62 + pulse * 0.08)
          const size = p.size * (0.82 + local * 0.35)
          ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }

        // Moving energy wave: animation, not a static picture.
        const scanX = ((elapsed * 0.11) % 1) * w
        const glow = ctx.createLinearGradient(scanX - 55, 0, scanX + 55, 0)
        glow.addColorStop(0, 'rgba(34,211,238,0)')
        glow.addColorStop(0.5, 'rgba(125,211,252,.10)')
        glow.addColorStop(1, 'rgba(236,72,153,0)')
        ctx.fillStyle = glow
        ctx.fillRect(scanX - 55, 0, 110, h)
        ctx.globalCompositeOperation = 'source-over'
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="h-full w-full"
    />
  )
}
