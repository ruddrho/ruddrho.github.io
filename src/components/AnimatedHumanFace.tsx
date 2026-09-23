import { useEffect, useRef } from 'react'

type Particle = {
  nx: number
  ny: number
  depth: number
  sx: number
  sy: number
  x: number
  y: number
  size: number
  phase: number
  delay: number
  color: number
  feature: number
}

const COLORS = [
  [34, 211, 238],   // cyan
  [56, 189, 248],   // electric blue
  [99, 102, 241],   // indigo
  [168, 85, 247],   // purple
  [236, 72, 153],   // magenta
] as const

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const gauss = (x: number, y: number, cx: number, cy: number, rx: number, ry: number) => {
  const dx = (x - cx) / rx
  const dy = (y - cy) / ry
  return Math.exp(-(dx * dx + dy * dy) * 2.2)
}

// Right-facing anatomical silhouette. Coordinates are normalized 0..1.
function faceBounds(y: number) {
  // back of skull / neck
  let left = 0.16
  if (y < 0.16) left = 0.30 - y * 0.55
  else if (y > 0.78) left = 0.23 + (y - 0.78) * 0.50

  // front profile: forehead -> brow -> nose -> lips -> chin -> neck
  let right = 0.76
  if (y < 0.12) right = 0.58 + y * 1.25
  else if (y < 0.27) right = 0.73 + (y - 0.12) * 0.34
  else if (y < 0.36) right = 0.78 + (y - 0.27) * 0.20
  else if (y < 0.49) right = 0.80 + (y - 0.36) * 0.72 // nose projection
  else if (y < 0.54) right = 0.895 - (y - 0.49) * 1.20 // nose underside
  else if (y < 0.60) right = 0.835 - (y - 0.54) * 0.18
  else if (y < 0.66) right = 0.824 + Math.sin(((y - 0.60) / 0.06) * Math.PI) * 0.026 // lips
  else if (y < 0.76) right = 0.82 - (y - 0.66) * 0.34
  else if (y < 0.84) right = 0.786 - (y - 0.76) * 0.95 // chin
  else right = 0.71 - (y - 0.84) * 0.72 // neck

  return { left, right }
}

function insideHead(x: number, y: number) {
  if (y < 0.045 || y > 0.97) return false
  const { left, right } = faceBounds(y)
  if (x < left || x > right) return false

  // round skull cap
  if (y < 0.25) {
    const dx = (x - 0.48) / 0.36
    const dy = (y - 0.24) / 0.22
    if (dx * dx + dy * dy > 1.06) return false
  }
  return true
}

function depthAt(x: number, y: number) {
  const { left, right } = faceBounds(y)
  const mid = (left + right) * 0.5
  const half = Math.max(0.001, (right - left) * 0.5)
  const u = clamp((x - mid) / half, -1, 1)
  let z = Math.sqrt(Math.max(0, 1 - u * u))

  // facial volumes — subtle, not cartoon outlines
  z += gauss(x, y, 0.79, 0.46, 0.12, 0.16) * 0.20 // nose / central face
  z += gauss(x, y, 0.73, 0.63, 0.14, 0.07) * 0.07 // mouth volume
  z += gauss(x, y, 0.67, 0.75, 0.18, 0.10) * 0.05 // chin
  z -= gauss(x, y, 0.68, 0.37, 0.13, 0.07) * 0.14 // eye socket
  z -= gauss(x, y, 0.66, 0.56, 0.11, 0.055) * 0.05 // under nose
  return clamp(z, 0, 1.25)
}

function featureWeight(x: number, y: number) {
  const eye = gauss(x, y, 0.69, 0.375, 0.115, 0.055)
  const iris = gauss(x, y, 0.715, 0.378, 0.035, 0.038)
  const brow = gauss(x, y, 0.67, 0.315, 0.15, 0.035)
  const nose = gauss(x, y, 0.805, 0.485, 0.10, 0.14)
  const lips = gauss(x, y, 0.775, 0.635, 0.105, 0.040)
  const ear = gauss(x, y, 0.285, 0.49, 0.075, 0.12)
  const jaw = gauss(x, y, 0.60, 0.76, 0.23, 0.055)
  return clamp(Math.max(eye * 0.8, iris, brow * 0.5, nose * 0.65, lips * 0.9, ear * 0.7, jaw * 0.45))
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
    let particles: Particle[] = []
    let start = performance.now()
    const mouse = { x: -9999, y: -9999, active: false }

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = Math.max(1, r.width)
      h = Math.max(1, r.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
    }

    const build = () => {
      const target = window.innerWidth < 768 ? 4300 : 11500
      const list: Particle[] = []
      let tries = 0

      while (list.length < target && tries < target * 10) {
        tries++
        const y = 0.045 + Math.random() * 0.925
        const { left, right } = faceBounds(y)
        const x = left + Math.random() * (right - left)
        if (!insideHead(x, y)) continue

        const feature = featureWeight(x, y)
        // Slightly thin generic regions, retain more points around real facial landmarks.
        if (feature < 0.18 && Math.random() < 0.16) continue

        const depth = depthAt(x, y)
        const angle = Math.random() * Math.PI * 2
        const radius = Math.max(w, h) * (0.28 + Math.random() * 0.42)
        const sx = w * 0.36 + Math.cos(angle) * radius
        const sy = h * 0.50 + Math.sin(angle) * radius

        let color = 1
        const rnd = Math.random()
        if (feature > 0.45 && rnd < 0.28) color = 4
        else if (depth > 0.72 && rnd < 0.55) color = 0
        else if (rnd < 0.72) color = 1
        else if (rnd < 0.88) color = 2
        else color = 3

        list.push({
          nx: x,
          ny: y,
          depth,
          sx,
          sy,
          x: sx,
          y: sy,
          size: (0.45 + Math.random() * 0.95) * (0.9 + feature * 0.35),
          phase: Math.random() * Math.PI * 2,
          delay: Math.random() * 0.85 + (1 - x) * 0.30,
          color,
          feature,
        })
      }

      // Extra particles inside features. They create density/shading, not neon outlines.
      const addCluster = (cx: number, cy: number, rx: number, ry: number, count: number, colorBias = 0) => {
        for (let i = 0; i < count; i++) {
          const a = Math.random() * Math.PI * 2
          const rr = Math.sqrt(Math.random())
          const x = cx + Math.cos(a) * rx * rr
          const y = cy + Math.sin(a) * ry * rr
          if (!insideHead(x, y)) continue
          const depth = depthAt(x, y)
          const angle = Math.random() * Math.PI * 2
          const radius = Math.max(w, h) * (0.32 + Math.random() * 0.36)
          list.push({
            nx: x, ny: y, depth,
            sx: w * 0.36 + Math.cos(angle) * radius,
            sy: h * 0.50 + Math.sin(angle) * radius,
            x: 0, y: 0,
            size: 0.55 + Math.random() * 0.95,
            phase: Math.random() * Math.PI * 2,
            delay: Math.random() * 0.7,
            color: Math.random() < 0.24 + colorBias ? 4 : (Math.random() < 0.55 ? 0 : 1),
            feature: 0.75 + Math.random() * 0.25,
          })
          const p = list[list.length - 1]
          p.x = p.sx; p.y = p.sy
        }
      }

      addCluster(0.69, 0.375, 0.095, 0.038, window.innerWidth < 768 ? 180 : 420, 0.04) // eye
      addCluster(0.715, 0.378, 0.027, 0.029, window.innerWidth < 768 ? 90 : 210, 0.00) // iris
      addCluster(0.805, 0.49, 0.065, 0.12, window.innerWidth < 768 ? 150 : 360, 0.00) // nose
      addCluster(0.775, 0.635, 0.085, 0.027, window.innerWidth < 768 ? 140 : 330, 0.22) // lips
      addCluster(0.285, 0.49, 0.050, 0.095, window.innerWidth < 768 ? 130 : 300, 0.08) // ear

      particles = list
      start = performance.now()
    }

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.active = true
    }
    const onLeave = () => { mouse.active = false }

    const draw = (now: number) => {
      const elapsed = (now - start) / 1000
      ctx.clearRect(0, 0, w, h)

      const faceH = Math.min(h * 0.92, w * 1.06)
      const faceW = faceH * 0.82
      const ox = Math.max(-faceW * 0.05, w * 0.015)
      const oy = (h - faceH) * 0.48
      const breathe = 1 + Math.sin(now * 0.0011) * 0.004
      const turn = Math.sin(now * 0.00032) * 0.018
      const scan = (now * 0.00012) % 1.15 - 0.075

      // very faint volumetric aura
      const glow = ctx.createRadialGradient(
        ox + faceW * 0.62, oy + faceH * 0.47, 0,
        ox + faceW * 0.62, oy + faceH * 0.47, faceW * 0.48
      )
      glow.addColorStop(0, 'rgba(34,211,238,0.055)')
      glow.addColorStop(0.55, 'rgba(99,102,241,0.025)')
      glow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      for (const p of particles) {
        const form = smoothstep(p.delay, p.delay + 1.9, elapsed)

        // Depth/parallax makes it read as a volume rather than a flat mask.
        const depthShift = (p.depth - 0.55) * faceW * (0.030 + turn)
        let tx = ox + (p.nx - 0.5) * faceW * breathe + faceW * 0.5 + depthShift
        let ty = oy + (p.ny - 0.5) * faceH * breathe + faceH * 0.5

        const micro = 0.7 + p.depth * 1.1
        tx += Math.sin(now * 0.0014 + p.phase) * micro
        ty += Math.cos(now * 0.00115 + p.phase * 1.7) * micro * 0.62

        // Mouse interaction: gentle repulsion, then particles return to anatomy.
        if (mouse.active) {
          const dx = tx - mouse.x
          const dy = ty - mouse.y
          const dist = Math.hypot(dx, dy)
          const radius = 125
          if (dist < radius && dist > 0.01) {
            const force = (1 - dist / radius) ** 2
            tx += (dx / dist) * force * 22
            ty += (dy / dist) * force * 22
          }
        }

        p.x += ((p.sx + (tx - p.sx) * form) - p.x) * 0.105
        p.y += ((p.sy + (ty - p.sy) * form) - p.y) * 0.105

        const [r, g, b] = COLORS[p.color]
        const scanGlow = Math.exp(-Math.pow((p.ny - scan) / 0.028, 2))
        const frontLight = 0.34 + p.depth * 0.52
        const featureLight = p.feature * 0.22
        const alpha = clamp((0.22 + frontLight * 0.52 + featureLight + scanGlow * 0.34) * form, 0, 0.94)
        const size = p.size * (0.76 + p.depth * 0.48 + scanGlow * 0.42)

        if (p.feature > 0.62 || scanGlow > 0.35) {
          ctx.shadowBlur = 5 + p.feature * 5 + scanGlow * 7
          ctx.shadowColor = `rgba(${r},${g},${b},${alpha * 0.75})`
        } else {
          ctx.shadowBlur = 0
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.fill()
      }

      ctx.shadowBlur = 0

      // sparse short neural links only on high-feature/front points; avoids cartoon contour lines.
      if (elapsed > 1.25) {
        ctx.lineWidth = 0.45
        for (let i = 0; i < particles.length; i += 70) {
          const a = particles[i]
          if (a.depth < 0.72 && a.feature < 0.45) continue
          let best: Particle | null = null
          let bestD = 26
          for (let j = i + 1; j < Math.min(particles.length, i + 85); j += 4) {
            const b = particles[j]
            const d = Math.hypot(a.x - b.x, a.y - b.y)
            if (d < bestD) { bestD = d; best = b }
          }
          if (best) {
            const [r, g, b] = COLORS[a.color]
            ctx.strokeStyle = `rgba(${r},${g},${b},${0.055 + a.feature * 0.055})`
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(best.x, best.y); ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
