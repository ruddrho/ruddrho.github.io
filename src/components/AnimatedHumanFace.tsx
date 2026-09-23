import { useEffect, useRef } from 'react'

type Pt = { x: number; y: number }
type Particle = {
  tx: number
  ty: number
  x: number
  y: number
  sx: number
  sy: number
  size: number
  phase: number
  delay: number
  color: number
  glow: number
}

const C = [
  [34, 211, 238],   // cyan
  [56, 189, 248],   // blue
  [99, 102, 241],   // indigo
  [168, 85, 247],   // purple
  [236, 72, 153],   // magenta
] as const

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3)

function sampleLine(a: Pt, b: Pt, step: number, out: Pt[]) {
  const d = Math.hypot(b.x - a.x, b.y - a.y)
  const n = Math.max(2, Math.ceil(d / step))
  for (let i = 0; i <= n; i++) {
    const t = i / n
    out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
  }
}

function samplePolyline(points: Pt[], step: number, out: Pt[]) {
  for (let i = 0; i < points.length - 1; i++) sampleLine(points[i], points[i + 1], step, out)
}

function sampleEllipse(cx: number, cy: number, rx: number, ry: number, count: number, out: Pt[], start = 0, end = Math.PI * 2) {
  for (let i = 0; i <= count; i++) {
    const a = start + (end - start) * (i / count)
    out.push({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry })
  }
}

function addPanelFill(poly: Pt[], spacing: number, out: Pt[]) {
  const ys = poly.map(p => p.y)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  for (let y = minY; y <= maxY; y += spacing) {
    const xs: number[] = []
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i]
      const b = poly[(i + 1) % poly.length]
      if ((a.y <= y && b.y > y) || (b.y <= y && a.y > y)) {
        const t = (y - a.y) / (b.y - a.y)
        xs.push(a.x + (b.x - a.x) * t)
      }
    }
    xs.sort((a, b) => a - b)
    for (let i = 0; i + 1 < xs.length; i += 2) {
      for (let x = xs[i]; x <= xs[i + 1]; x += spacing) {
        out.push({ x, y })
      }
    }
  }
}

function buildRobotGeometry() {
  const edge: Pt[] = []
  const fill: Pt[] = []
  const accent: Pt[] = []

  // 3/4-view robotic mask silhouette: deliberately mechanical, not a human portrait.
  const outer: Pt[] = [
    { x: 0.28, y: 0.11 }, { x: 0.43, y: 0.07 }, { x: 0.59, y: 0.10 },
    { x: 0.70, y: 0.18 }, { x: 0.76, y: 0.28 }, { x: 0.80, y: 0.37 },
    { x: 0.86, y: 0.43 }, { x: 0.82, y: 0.49 }, { x: 0.84, y: 0.55 },
    { x: 0.80, y: 0.61 }, { x: 0.81, y: 0.68 }, { x: 0.75, y: 0.76 },
    { x: 0.66, y: 0.82 }, { x: 0.60, y: 0.92 }, { x: 0.37, y: 0.91 },
    { x: 0.30, y: 0.82 }, { x: 0.23, y: 0.74 }, { x: 0.19, y: 0.60 },
    { x: 0.17, y: 0.44 }, { x: 0.19, y: 0.27 }, { x: 0.23, y: 0.17 },
    { x: 0.28, y: 0.11 },
  ]
  samplePolyline(outer, 0.006, edge)

  // Armor panels
  const forehead = [
    {x:.30,y:.14},{x:.47,y:.10},{x:.63,y:.14},{x:.71,y:.23},
    {x:.63,y:.31},{x:.45,y:.28},{x:.29,y:.24}
  ]
  const cheek = [
    {x:.48,y:.47},{x:.70,y:.43},{x:.78,y:.51},{x:.73,y:.66},
    {x:.62,y:.73},{x:.48,y:.65}
  ]
  const temple = [
    {x:.25,y:.30},{x:.43,y:.30},{x:.47,y:.45},{x:.38,y:.57},
    {x:.23,y:.54},{x:.20,y:.41}
  ]
  const jaw = [
    {x:.38,y:.61},{x:.49,y:.68},{x:.63,y:.75},{x:.58,y:.86},
    {x:.38,y:.84},{x:.28,y:.73}
  ]

  for (const p of [forehead, cheek, temple, jaw]) {
    samplePolyline([...p, p[0]], 0.008, edge)
    addPanelFill(p, 0.018, fill)
  }

  // Mechanical eye / visor
  const eye: Pt[] = [
    {x:.48,y:.35},{x:.60,y:.32},{x:.72,y:.36},{x:.65,y:.41},
    {x:.54,y:.42},{x:.46,y:.39},{x:.48,y:.35}
  ]
  samplePolyline(eye, 0.004, accent)
  sampleEllipse(.595, .372, .033, .028, 36, accent)
  sampleEllipse(.595, .372, .012, .012, 20, accent)

  // Nose bridge is a hard mechanical ridge
  samplePolyline([
    {x:.70,y:.38},{x:.75,y:.43},{x:.80,y:.48},{x:.75,y:.52},{x:.69,y:.51}
  ], 0.004, accent)

  // Mouth is a segmented vent, not lips
  samplePolyline([{x:.63,y:.60},{x:.73,y:.59},{x:.78,y:.62},{x:.72,y:.65},{x:.61,y:.65}], 0.004, accent)
  for (let i = 0; i < 6; i++) {
    const y = .602 + i * .009
    sampleLine({x:.645,y},{x:.745,y:y+.002}, .006, accent)
  }

  // Ear / side module
  sampleEllipse(.255, .46, .070, .115, 50, edge, Math.PI * .52, Math.PI * 1.48)
  sampleEllipse(.258, .46, .040, .078, 40, accent, Math.PI * .55, Math.PI * 1.45)
  sampleEllipse(.258, .46, .012, .020, 18, accent)

  // Circuit seams
  const seams: Pt[][] = [
    [{x:.31,y:.17},{x:.40,y:.24},{x:.44,y:.31}],
    [{x:.61,y:.16},{x:.59,y:.25},{x:.63,y:.31}],
    [{x:.31,y:.55},{x:.38,y:.61},{x:.39,y:.72}],
    [{x:.50,y:.47},{x:.56,y:.52},{x:.56,y:.60}],
    [{x:.65,y:.70},{x:.68,y:.77},{x:.62,y:.84}],
    [{x:.25,y:.67},{x:.33,y:.72},{x:.35,y:.82}],
  ]
  seams.forEach(s => samplePolyline(s, .006, accent))

  // Neck mechanics
  const neckL = [{x:.36,y:.82},{x:.34,y:.95},{x:.26,y:1.03}]
  const neckR = [{x:.59,y:.84},{x:.63,y:.96},{x:.72,y:1.03}]
  samplePolyline(neckL, .006, edge)
  samplePolyline(neckR, .006, edge)
  for (let y=.87; y<1.01; y+=.028) {
    sampleLine({x:.38,y},{x:.59,y:y+.01}, .010, accent)
  }

  // Extra sparse interior tech points
  for (let i = 0; i < 1500; i++) {
    const x = .21 + Math.random() * .58
    const y = .12 + Math.random() * .72
    const dx = (x-.49)/.34
    const dy = (y-.47)/.40
    if (dx*dx + dy*dy < 1 && Math.random() > .30) fill.push({x,y})
  }

  return { edge, fill, accent }
}

export function AnimatedHumanFace() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Keep non-null references for nested animation callbacks (strict TypeScript).
    const canvasEl: HTMLCanvasElement = canvas
    const context: CanvasRenderingContext2D = ctx

    let w = 1, h = 1, dpr = 1, raf = 0
    const mouse = { x: -9999, y: -9999, active: false }
    const geometry = buildRobotGeometry()
    let particles: Particle[] = []
    const start = performance.now()

    function rebuild() {
      const mobile = w < 760
      const scale = Math.min(h * (mobile ? .68 : .82), w * (mobile ? .72 : .48))
      const ox = mobile ? w * .04 : w * .035
      const oy = h * .055

      const all: Array<{p: Pt; glow: number; color: number; size: number}> = []

      geometry.fill.forEach((p, i) => {
        if (mobile && i % 2) return
        all.push({p, glow:.15, color:i%3, size:.65 + Math.random()*.8})
      })
      geometry.edge.forEach((p, i) => all.push({p, glow:.75, color:i%4, size:1.0 + Math.random()*1.1}))
      geometry.accent.forEach((p, i) => all.push({p, glow:1, color:(i%3===0?4:0), size:1.15 + Math.random()*1.2}))

      particles = all.map((item, i) => {
        const tx = ox + item.p.x * scale
        const ty = oy + item.p.y * scale
        const angle = Math.random() * Math.PI * 2
        const dist = scale * (.18 + Math.random() * .55)
        return {
          tx, ty,
          x: tx + Math.cos(angle) * dist,
          y: ty + Math.sin(angle) * dist,
          sx: tx + Math.cos(angle) * dist,
          sy: ty + Math.sin(angle) * dist,
          size: item.size,
          phase: Math.random() * Math.PI * 2,
          delay: (i / Math.max(1, all.length)) * .65 + Math.random()*.45,
          color: item.color,
          glow: item.glow,
        }
      })
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const r = canvasEl.getBoundingClientRect()
      w = Math.max(1, r.width)
      h = Math.max(1, r.height)
      canvasEl.width = Math.floor(w * dpr)
      canvasEl.height = Math.floor(h * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      rebuild()
    }

    function onMove(e: MouseEvent) {
      const r = canvasEl.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.active = true
    }
    function onLeave() { mouse.active = false }

    function draw(now: number) {
      context.clearRect(0, 0, w, h)
      const t = (now - start) / 1000
      const scan = ((t * .16) % 1.15) - .08

      // subtle holographic aura
      const auraX = w < 760 ? w*.30 : w*.23
      const auraY = h*.45
      const aura = context.createRadialGradient(auraX,auraY,10,auraX,auraY,Math.min(w,h)*.35)
      aura.addColorStop(0,'rgba(34,211,238,.045)')
      aura.addColorStop(.55,'rgba(99,102,241,.025)')
      aura.addColorStop(1,'rgba(0,0,0,0)')
      context.fillStyle = aura
      context.fillRect(0,0,w,h)

      for (const p of particles) {
        const form = ease((t - p.delay) / 1.75)
        const idleX = Math.sin(t*1.15 + p.phase) * (p.glow > .6 ? 1.2 : .55)
        const idleY = Math.cos(t*.95 + p.phase*1.4) * (p.glow > .6 ? 1.0 : .45)

        let targetX = p.tx + idleX
        let targetY = p.ty + idleY

        if (mouse.active) {
          const dx = targetX - mouse.x
          const dy = targetY - mouse.y
          const d = Math.hypot(dx,dy)
          if (d < 150 && d > .1) {
            const force = (1-d/150) * (10 + p.glow*14)
            targetX += dx/d * force
            targetY += dy/d * force
          }
        }

        p.x = p.sx + (targetX - p.sx) * form
        p.y = p.sy + (targetY - p.sy) * form

        const ny = clamp(p.ty / Math.max(1,h))
        const scanGlow = Math.exp(-Math.pow((ny-scan)/.035,2))
        const pulse = .72 + .28*Math.sin(t*2.2+p.phase)
        const [r,g,b] = C[p.color % C.length]
        const alpha = clamp((.28 + p.glow*.48 + scanGlow*.30) * form * pulse, 0, 1)
        const size = p.size * (1 + scanGlow*.55)

        if (p.glow > .55 || scanGlow > .25) {
          context.shadowBlur = 5 + p.glow*9 + scanGlow*10
          context.shadowColor = `rgba(${r},${g},${b},${alpha})`
        } else context.shadowBlur = 0

        context.beginPath()
        context.arc(p.x,p.y,size,0,Math.PI*2)
        context.fillStyle = `rgba(${r},${g},${b},${alpha})`
        context.fill()
      }

      context.shadowBlur = 0

      // moving data packets along random short links
      if (t > 1.3) {
        context.lineWidth = .55
        for (let i=0;i<particles.length;i+=115) {
          const a = particles[i]
          if (a.glow < .55) continue
          const b = particles[(i+37)%particles.length]
          const d = Math.hypot(a.x-b.x,a.y-b.y)
          if (d < 95) {
            const [r,g,bb] = C[a.color%C.length]
            context.strokeStyle = `rgba(${r},${g},${bb},.10)`
            context.beginPath(); context.moveTo(a.x,a.y); context.lineTo(b.x,b.y); context.stroke()
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
