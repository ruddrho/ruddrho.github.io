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

type FeaturePoint = Point & {
  glow: number
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

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
    let featurePoints: FeaturePoint[] = []
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
      const v = clamp01(t)
      return 1 - Math.pow(1 - v, 3)
    }

    const makeStart = (tx: number, ty: number) => {
      const angle = Math.random() * Math.PI * 2
      const radius = 90 + Math.random() * 280
      const originX = w * 0.50
      const originY = h * 0.50
      return {
        sx: originX + Math.cos(angle) * radius,
        sy: originY + Math.sin(angle) * radius,
        delay: tx * 0.30 + ty * 0.08 + Math.random() * 0.22,
      }
    }

    const addFeatureDot = (
      tx: number,
      ty: number,
      color: [number, number, number],
      size = 1.05,
      glow = 1
    ) => {
      const s = makeStart(tx, ty)
      featurePoints.push({
        tx,
        ty,
        ...s,
        x: s.sx,
        y: s.sy,
        r: color[0],
        g: color[1],
        b: color[2],
        size: size * (0.72 + Math.random() * 0.55),
        phase: Math.random() * Math.PI * 2,
        glow,
      })
    }

    const sampleCurve = (
      coords: Array<[number, number]>,
      density: number,
      color: [number, number, number],
      size = 1.05,
      glow = 1
    ) => {
      for (let s = 0; s < coords.length - 1; s++) {
        const [x1, y1] = coords[s]
        const [x2, y2] = coords[s + 1]
        const dist = Math.hypot(x2 - x1, y2 - y1)
        const count = Math.max(3, Math.ceil(dist * density))
        for (let i = 0; i <= count; i++) {
          const t = i / count
          const tx = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 0.0022
          const ty = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 0.0022
          addFeatureDot(tx, ty, color, size, glow)
        }
      }
    }

    const sampleEllipse = (
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      count: number,
      color: [number, number, number],
      size = 1.05,
      glow = 1,
      startAngle = 0,
      endAngle = Math.PI * 2
    ) => {
      for (let i = 0; i < count; i++) {
        const t = i / Math.max(1, count - 1)
        const a = startAngle + (endAngle - startAngle) * t
        addFeatureDot(
          cx + Math.cos(a) * rx + (Math.random() - 0.5) * 0.0018,
          cy + Math.sin(a) * ry + (Math.random() - 0.5) * 0.0018,
          color,
          size,
          glow
        )
      }
    }

    const buildFacialFeatures = () => {
      featurePoints = []
      const cyan: [number, number, number] = [70, 225, 255]
      const blue: [number, number, number] = [80, 165, 255]
      const pink: [number, number, number] = [244, 114, 220]
      const ice: [number, number, number] = [190, 240, 255]

      // LEFT EAR — multiple nested contours so it reads clearly as an ear.
      sampleEllipse(0.205, 0.505, 0.075, 0.112, 150, cyan, 1.08, 1.15, Math.PI * 0.42, Math.PI * 1.58)
      sampleEllipse(0.218, 0.505, 0.044, 0.075, 100, pink, 0.92, 0.95, Math.PI * 0.38, Math.PI * 1.62)
      sampleCurve([[0.225, 0.455], [0.195, 0.485], [0.205, 0.535], [0.235, 0.555]], 950, blue, 0.9, 0.8)

      // EYEBROW — gives the upper face a human expression.
      sampleCurve([[0.565, 0.332], [0.615, 0.305], [0.680, 0.302], [0.728, 0.325]], 1150, pink, 1.0, 1.0)

      // EYE — almond outline + iris + pupil + highlight.
      sampleCurve([[0.575, 0.390], [0.620, 0.360], [0.682, 0.360], [0.730, 0.392]], 1450, ice, 1.12, 1.35)
      sampleCurve([[0.575, 0.390], [0.620, 0.414], [0.682, 0.417], [0.730, 0.392]], 1450, cyan, 1.08, 1.25)
      sampleEllipse(0.656, 0.389, 0.028, 0.037, 105, cyan, 1.05, 1.25)
      sampleEllipse(0.656, 0.389, 0.011, 0.016, 58, ice, 1.25, 1.55)
      sampleEllipse(0.648, 0.380, 0.0045, 0.006, 20, ice, 1.5, 1.8)

      // NOSE — bridge, tip, nostril and underside. This is intentionally denser.
      sampleCurve([[0.720, 0.360], [0.748, 0.405], [0.770, 0.465], [0.802, 0.515], [0.858, 0.545]], 1500, cyan, 1.12, 1.3)
      sampleCurve([[0.858, 0.545], [0.842, 0.562], [0.805, 0.565], [0.780, 0.552]], 1500, ice, 1.1, 1.25)
      sampleCurve([[0.790, 0.548], [0.808, 0.535], [0.830, 0.540]], 1700, pink, 1.05, 1.15)
      sampleEllipse(0.818, 0.548, 0.012, 0.007, 38, pink, 1.0, 1.1, Math.PI * 0.05, Math.PI * 0.95)

      // PHILTRUM / centre line between nose and lips.
      sampleCurve([[0.790, 0.570], [0.785, 0.592], [0.790, 0.612]], 1200, blue, 0.85, 0.75)

      // LIPS — Cupid bow, mouth seam and lower lip.
      sampleCurve([[0.735, 0.635], [0.765, 0.620], [0.790, 0.630], [0.812, 0.620], [0.845, 0.638]], 1600, pink, 1.14, 1.35)
      sampleCurve([[0.735, 0.637], [0.775, 0.643], [0.810, 0.643], [0.845, 0.638]], 1700, ice, 0.95, 1.05)
      sampleCurve([[0.742, 0.645], [0.770, 0.670], [0.812, 0.673], [0.840, 0.645]], 1550, pink, 1.08, 1.2)

      // CHIN + JAW — helps the face read as a head instead of a sphere.
      sampleCurve([[0.835, 0.675], [0.822, 0.715], [0.790, 0.755], [0.735, 0.785], [0.650, 0.800]], 1200, cyan, 1.0, 1.0)
      sampleCurve([[0.650, 0.800], [0.555, 0.800], [0.455, 0.770], [0.365, 0.715], [0.300, 0.650]], 900, blue, 0.88, 0.75)

      // FOREHEAD / front silhouette accent.
      sampleCurve([[0.705, 0.165], [0.745, 0.220], [0.755, 0.285], [0.735, 0.335]], 950, cyan, 0.95, 0.9)
    }

    const buildFromImage = (img: HTMLImageElement) => {
      const off = document.createElement('canvas')
      const ow = 360
      const oh = 470
      off.width = ow
      off.height = oh
      const ox = off.getContext('2d', { willReadFrequently: true })
      if (!ox) return

      // The PNG is never displayed. It is only a hidden geometry/density mask.
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

          if (luminous && (neuralHue || pinkHue) && !(r > 205 && g > 205 && b > 205)) {
            candidates.push({ x, y, r, g, b })
          }
        }
      }

      const maxPoints = window.innerWidth < 768 ? 3000 : 7000
      const stride = Math.max(1, Math.floor(candidates.length / maxPoints))
      const selected = candidates.filter((_, i) => i % stride === 0).slice(0, maxPoints)

      points = selected.map((p) => {
        const nx = p.x / ow
        const ny = p.y / oh
        const s = makeStart(nx, ny)
        return {
          tx: nx,
          ty: ny,
          ...s,
          x: s.sx,
          y: s.sy,
          r: p.r,
          g: p.g,
          b: p.b,
          size: 0.48 + Math.random() * 1.10,
          phase: Math.random() * Math.PI * 2,
        }
      })

      buildFacialFeatures()
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

    const positionPoint = (p: Point, elapsed: number, time: number, padX: number, padY: number, faceW: number, faceH: number) => {
      const local = ease((elapsed - p.delay * 1.25) / 2.15)
      const targetX = padX + p.tx * faceW
      const targetY = padY + p.ty * faceH
      let x = p.sx + (targetX - p.sx) * local
      let y = p.sy + (targetY - p.sy) * local

      if (local > 0.90) {
        const alive = (local - 0.90) / 0.10
        x += Math.sin(time * 0.00118 + p.phase) * 0.85 * alive
        y += Math.cos(time * 0.00102 + p.phase * 1.25) * 0.68 * alive

        if (mouse.active) {
          const dx = x - mouse.x
          const dy = y - mouse.y
          const dist = Math.hypot(dx, dy)
          const radius = 115
          if (dist < radius && dist > 0.1) {
            const force = (1 - dist / radius) * 10
            x += (dx / dist) * force
            y += (dy / dist) * force
          }
        }
      }

      p.x = x
      p.y = y
      return { x, y, local }
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h)
      if (ready) {
        const elapsed = (time - start) / 1000
        const pulse = 0.5 + 0.5 * Math.sin(time * 0.0018)
        const padX = w * 0.02
        const padY = h * 0.015
        const faceW = w - padX * 2
        const faceH = h - padY * 2

        ctx.globalCompositeOperation = 'lighter'

        // Base animated point-cloud anatomy.
        for (let i = 0; i < points.length; i++) {
          const p = points[i]
          const { x, y, local } = positionPoint(p, elapsed, time, padX, padY, faceW, faceH)
          const alpha = Math.min(0.82, 0.15 + local * 0.58 + pulse * 0.06)
          const size = p.size * (0.82 + local * 0.32)
          ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }

        // Anatomical landmark layer: animated particles, NOT an image overlay.
        // Eye, nose, lips and ear stay legible even while the whole point cloud moves.
        for (let i = 0; i < featurePoints.length; i++) {
          const p = featurePoints[i]
          const { x, y, local } = positionPoint(p, elapsed, time, padX, padY, faceW, faceH)
          const signal = 0.72 + 0.28 * Math.sin(time * 0.0032 + p.phase)
          const alpha = Math.min(1, (0.22 + local * 0.74) * signal)
          const size = p.size * (0.88 + pulse * 0.22)

          if (p.glow > 1.05 && i % 3 === 0) {
            const halo = ctx.createRadialGradient(x, y, 0, x, y, 5.5 * p.glow)
            halo.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${0.22 * local})`)
            halo.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`)
            ctx.fillStyle = halo
            ctx.beginPath()
            ctx.arc(x, y, 5.5 * p.glow, 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }

        // Energy scan remains dynamic across both base cloud and facial landmarks.
        const scanX = ((elapsed * 0.105) % 1) * w
        const glow = ctx.createLinearGradient(scanX - 58, 0, scanX + 58, 0)
        glow.addColorStop(0, 'rgba(34,211,238,0)')
        glow.addColorStop(0.5, 'rgba(125,211,252,.105)')
        glow.addColorStop(1, 'rgba(236,72,153,0)')
        ctx.fillStyle = glow
        ctx.fillRect(scanX - 58, 0, 116, h)
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

  return <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
}
