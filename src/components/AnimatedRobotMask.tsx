import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Vec {
  x: number;
  y: number;
}

type ParticleColor = "cyan" | "purple" | "white";

interface Particle {
  target: Vec;
  scatter: Vec;
  size: number;
  seed: number;
  introDelay: number;
  cycleOffset: number;
  cycleDuration: number;
  color: ParticleColor;
}

interface AmbientOrb {
  x: number; // 0..1 of canvas
  y: number; // 0..1 of canvas
  r: number; // px
  color: "cyan" | "purple" | "orange";
  drift: number;
  phase: number;
}

interface AmbientDot {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/* ------------------------------------------------------------------ */
/*  Geometry (normalized 700x900 space, mirrored around CX)            */
/* ------------------------------------------------------------------ */

const NORM_W = 700;
const NORM_H = 900;
const CX = 350;

const crownLeft: Vec[] = [
  { x: 350, y: 118 },
  { x: 300, y: 150 },
  { x: 258, y: 138 },
  { x: 222, y: 106 },
  { x: 246, y: 168 },
  { x: 214, y: 196 },
  { x: 196, y: 256 },
];

const templeLeft: Vec[] = [
  { x: 196, y: 256 },
  { x: 176, y: 330 },
  { x: 167, y: 410 },
  { x: 172, y: 490 },
];

const cheekLeft: Vec[] = [
  { x: 172, y: 490 },
  { x: 190, y: 565 },
  { x: 222, y: 635 },
  { x: 258, y: 695 },
];

const jawLeft: Vec[] = [
  { x: 258, y: 695 },
  { x: 296, y: 750 },
  { x: 326, y: 810 },
  { x: 348, y: 862 },
  { x: 350, y: 892 },
];

const eyeSocketLeft: Vec[] = [
  { x: 224, y: 300 },
  { x: 300, y: 288 },
  { x: 322, y: 322 },
  { x: 318, y: 352 },
  { x: 268, y: 368 },
  { x: 214, y: 350 },
  { x: 224, y: 300 },
];

const eyeGlowLeft: Vec[] = [
  { x: 236, y: 322 },
  { x: 276, y: 310 },
  { x: 312, y: 326 },
  { x: 272, y: 338 },
  { x: 236, y: 322 },
];

const cheekAccentsLeft: Vec[][] = [
  [
    { x: 188, y: 470 },
    { x: 258, y: 508 },
  ],
  [
    { x: 200, y: 558 },
    { x: 268, y: 588 },
  ],
  [
    { x: 230, y: 636 },
    { x: 290, y: 658 },
  ],
];

const noseBridge: Vec[] = [
  { x: 350, y: 392 },
  { x: 350, y: 460 },
  { x: 350, y: 520 },
  { x: 350, y: 648 },
  { x: 350, y: 862 },
];

const crownSpike: Vec[] = [
  { x: 350, y: 94 },
  { x: 350, y: 118 },
];

// the single continuous glowing brow/visor chevron that dips to meet the
// nose bridge between the eyes - the most distinctive silhouette feature
const browChevron: Vec[] = [
  { x: 208, y: 328 },
  { x: 236, y: 316 },
  { x: 272, y: 306 },
  { x: 312, y: 336 },
  { x: 350, y: 392 },
  { x: 388, y: 336 },
  { x: 428, y: 306 },
  { x: 464, y: 316 },
  { x: 492, y: 328 },
];

const AI_CORE: Vec = { x: 350, y: 520 };
const MASK_CENTER: Vec = { x: 350, y: 470 };

function mirrorX(x: number): number {
  return 2 * CX - x;
}

function mirrorPath(path: Vec[]): Vec[] {
  return path.map((p) => ({ x: mirrorX(p.x), y: p.y }));
}

function buildSilhouette(): Vec[] {
  const left = [...crownLeft, ...templeLeft.slice(1), ...cheekLeft.slice(1), ...jawLeft.slice(1)];
  const right = mirrorPath(left).reverse();
  return [...left, ...right];
}

const SILHOUETTE = buildSilhouette();

const STRUCTURAL_PATHS_LEFT: { path: Vec[]; closed: boolean }[] = [
  { path: crownLeft, closed: false },
  { path: templeLeft, closed: false },
  { path: cheekLeft, closed: false },
  { path: jawLeft, closed: false },
  { path: eyeSocketLeft, closed: true },
  ...cheekAccentsLeft.map((p) => ({ path: p, closed: false })),
];

const STRUCTURAL_PATHS_CENTER: { path: Vec[]; closed: boolean }[] = [
  { path: noseBridge, closed: false },
  { path: crownSpike, closed: false },
  { path: browChevron, closed: false },
];

/* ------------------------------------------------------------------ */
/*  Point-in-polygon + low-poly surface mesh                           */
/* ------------------------------------------------------------------ */

function pointInPolygon(pt: Vec, poly: Vec[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersect =
      yi > pt.y !== yj > pt.y && pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function buildMeshGrid(): Vec[] {
  const points: Vec[] = [];
  const step = 27;
  let row = 0;
  for (let y = 140; y < 880; y += step) {
    const rowOffset = row % 2 === 0 ? 0 : step / 2;
    for (let x = 150; x < 550; x += step) {
      const seed = x * 3.1 + y * 7.7;
      const jx = x + rowOffset + (seededRandom(seed) - 0.5) * 8;
      const jy = y + (seededRandom(seed + 1) - 0.5) * 8;
      const p = { x: jx, y: jy };
      if (pointInPolygon(p, SILHOUETTE)) points.push(p);
    }
    row++;
  }
  return points;
}

const MESH_POINTS = buildMeshGrid();

function buildMeshEdges(points: Vec[]): [number, number][] {
  const edges: [number, number][] = [];
  const maxDist = 40;
  for (let i = 0; i < points.length; i++) {
    let count = 0;
    for (let j = i + 1; j < points.length && count < 3; j++) {
      if (dist(points[i], points[j]) < maxDist) {
        edges.push([i, j]);
        count++;
      }
    }
  }
  return edges;
}

const MESH_EDGES = buildMeshEdges(MESH_POINTS);

/* ------------------------------------------------------------------ */
/*  Math helpers                                                       */
/* ------------------------------------------------------------------ */

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(t: number): number {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

function easeOutCubic(t: number): number {
  const c = clamp01(t);
  return 1 - Math.pow(1 - c, 3);
}

function dist(a: Vec, b: Vec): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/* ------------------------------------------------------------------ */
/*  Particle generation                                                */
/* ------------------------------------------------------------------ */

function sampleParticles(
  path: Vec[],
  spacing: number,
  color: ParticleColor,
  mirror: boolean,
  seedBase: number
): Particle[] {
  const result: Particle[] = [];
  let carry = 0;
  let idx = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    const segLen = dist(a, b);
    if (segLen < 0.0001) continue;

    let d = carry;
    while (d < segLen) {
      const t = d / segLen;
      let px = lerp(a.x, b.x, t);
      const py = lerp(a.y, b.y, t);
      if (mirror) px = mirrorX(px);

      const seed = seedBase + idx * 7.13 + (mirror ? 1000 : 0);
      const angle = seededRandom(seed) * Math.PI * 2;
      const radius = 220 + seededRandom(seed + 1) * 260;
      const scatter: Vec = {
        x: MASK_CENTER.x + Math.cos(angle) * radius * (0.6 + seededRandom(seed + 2) * 0.9),
        y: MASK_CENTER.y + Math.sin(angle) * radius,
      };

      result.push({
        target: { x: px, y: py },
        scatter,
        size: 1.1 + seededRandom(seed + 3) * 1.6,
        seed,
        introDelay: seededRandom(seed + 4) * 1400,
        cycleOffset: seededRandom(seed + 5) * 9000,
        cycleDuration: 6000 + seededRandom(seed + 6) * 5000,
        color,
      });

      idx++;
      d += spacing;
    }
    carry = d - segLen;
  }

  return result;
}

function buildAllParticles(): Particle[] {
  const particles: Particle[] = [];
  let seedCounter = 0;

  for (const { path } of STRUCTURAL_PATHS_LEFT) {
    const color: ParticleColor = path === eyeSocketLeft ? "white" : "cyan";
    particles.push(...sampleParticles(path, 13, color, false, seedCounter));
    seedCounter += 500;
    particles.push(...sampleParticles(path, 13, color, true, seedCounter));
    seedCounter += 500;
  }

  particles.push(...sampleParticles(noseBridge, 15, "purple", false, seedCounter));
  seedCounter += 500;
  particles.push(...sampleParticles(eyeGlowLeft, 6, "white", false, seedCounter));
  seedCounter += 500;
  particles.push(...sampleParticles(eyeGlowLeft, 6, "white", true, seedCounter));
  seedCounter += 500;

  particles.push(...buildMeshParticles(seedCounter));

  return particles;
}

function buildMeshParticles(seedBase: number): Particle[] {
  return MESH_POINTS.map((pt, i) => {
    const seed = seedBase + i * 5.31;
    const angle = seededRandom(seed) * Math.PI * 2;
    const radius = 200 + seededRandom(seed + 1) * 300;
    const scatter: Vec = {
      x: MASK_CENTER.x + Math.cos(angle) * radius,
      y: MASK_CENTER.y + Math.sin(angle) * radius,
    };
    return {
      target: pt,
      scatter,
      size: 0.5 + seededRandom(seed + 2) * 0.6,
      seed,
      introDelay: seededRandom(seed + 3) * 1600,
      cycleOffset: seededRandom(seed + 4) * 12000,
      cycleDuration: 8000 + seededRandom(seed + 5) * 8000,
      color: seededRandom(seed + 6) > 0.9 ? "purple" : "cyan",
    };
  });
}

const STRUCTURAL_PARTICLES = buildAllParticles();
const MESH_START = STRUCTURAL_PARTICLES.length - MESH_POINTS.length;
const PARTICLES = STRUCTURAL_PARTICLES;

/* ------------------------------------------------------------------ */
/*  Ambient background field                                           */
/* ------------------------------------------------------------------ */

const AMBIENT_ORBS: AmbientOrb[] = [
  { x: 0.86, y: 0.09, r: 40, color: "cyan", drift: 14, phase: 0 },
  { x: 0.34, y: 0.17, r: 22, color: "cyan", drift: 10, phase: 1.4 },
  { x: 0.76, y: 0.22, r: 16, color: "orange", drift: 8, phase: 2.1 },
  { x: 0.02, y: 0.56, r: 20, color: "cyan", drift: 11, phase: 0.6 },
  { x: 0.28, y: 0.78, r: 26, color: "purple", drift: 12, phase: 3.0 },
  { x: 0.94, y: 0.66, r: 20, color: "cyan", drift: 9, phase: 1.9 },
  { x: 0.2, y: 0.94, r: 18, color: "cyan", drift: 13, phase: 0.3 },
  { x: 0.31, y: 0.98, r: 14, color: "orange", drift: 7, phase: 2.6 },
  { x: 0.53, y: 0.99, r: 34, color: "cyan", drift: 15, phase: 1.1 },
  { x: 0.82, y: 0.95, r: 30, color: "purple", drift: 10, phase: 0.8 },
  { x: 0.9, y: 0.99, r: 16, color: "cyan", drift: 8, phase: 2.3 },
  { x: 0.07, y: 0.91, r: 15, color: "orange", drift: 9, phase: 1.6 },
];

const AMBIENT_DOTS: AmbientDot[] = Array.from({ length: 26 }, (_, i) => {
  const seed = i * 31.7;
  return {
    x: seededRandom(seed) ,
    y: seededRandom(seed + 1),
    vx: (seededRandom(seed + 2) - 0.5) * 0.00006,
    vy: (seededRandom(seed + 3) - 0.5) * 0.00006,
  };
});

/* ------------------------------------------------------------------ */
/*  Colors                                                             */
/* ------------------------------------------------------------------ */

const COLORS = {
  cyan: "rgba(80, 230, 255, 1)",
  cyanSoft: "rgba(80, 230, 255, 0.35)",
  purple: "rgba(170, 110, 255, 1)",
  purpleSoft: "rgba(170, 110, 255, 0.35)",
  white: "rgba(220, 250, 255, 1)",
  orange: "rgba(255, 150, 70, 1)",
  bgTop: "#030509",
  bgBottom: "#060b16",
};

function particleColor(c: ParticleColor): string {
  if (c === "purple") return COLORS.purple;
  if (c === "white") return COLORS.white;
  return COLORS.cyan;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AnimatedRobotMask() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    const startTime = performance.now();
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, w);
      height = Math.max(1, h);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    resize();

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => resize()) : null;
    if (resizeObserver && canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener("resize", resize);

    function getTransform() {
      const scale = Math.min(width / NORM_W, height / NORM_H) * 0.92;
      const offsetX = (width - NORM_W * scale) / 2;
      const offsetY = (height - NORM_H * scale) / 2;
      return { scale, offsetX, offsetY };
    }

    function pathFromPoints(points: Vec[]): Path2D {
      const p = new Path2D();
      points.forEach((pt, i) => {
        if (i === 0) p.moveTo(pt.x, pt.y);
        else p.lineTo(pt.x, pt.y);
      });
      return p;
    }

    /* -------------------------------------------------------------- */
    /*  Drawing sub-routines                                           */
    /* -------------------------------------------------------------- */

    function drawBackground(now: number, ctx2d: CanvasRenderingContext2D) {
      const grad = ctx2d.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, COLORS.bgTop);
      grad.addColorStop(1, COLORS.bgBottom);
      ctx2d.fillStyle = grad;
      ctx2d.fillRect(0, 0, width, height);

      // constellation dots
      const positions = AMBIENT_DOTS.map((d) => {
        const t = now;
        let x = (d.x + d.vx * t) % 1;
        let y = (d.y + d.vy * t) % 1;
        if (x < 0) x += 1;
        if (y < 0) y += 1;
        return { x: x * width, y: y * height };
      });

      ctx2d.lineWidth = 1;
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const d = dist(positions[i], positions[j]);
          if (d < 140) {
            const alpha = (1 - d / 140) * 0.18;
            ctx2d.strokeStyle = `rgba(90,200,255,${alpha})`;
            ctx2d.beginPath();
            ctx2d.moveTo(positions[i].x, positions[i].y);
            ctx2d.lineTo(positions[j].x, positions[j].y);
            ctx2d.stroke();
          }
        }
      }
      for (const p of positions) {
        ctx2d.fillStyle = "rgba(150,220,255,0.6)";
        ctx2d.beginPath();
        ctx2d.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
        ctx2d.fill();
      }

      // glow orbs
      for (const orb of AMBIENT_ORBS) {
        const dx = Math.sin(now * 0.00018 + orb.phase) * orb.drift;
        const dy = Math.cos(now * 0.00015 + orb.phase) * orb.drift;
        const cx = orb.x * width + dx;
        const cy = orb.y * height + dy;
        const color =
          orb.color === "cyan" ? "80,230,255" : orb.color === "purple" ? "170,110,255" : "255,150,70";
        const g = ctx2d.createRadialGradient(cx, cy, 0, cx, cy, orb.r);
        g.addColorStop(0, `rgba(${color},0.55)`);
        g.addColorStop(1, `rgba(${color},0)`);
        ctx2d.fillStyle = g;
        ctx2d.beginPath();
        ctx2d.arc(cx, cy, orb.r, 0, Math.PI * 2);
        ctx2d.fill();
      }
    }

    function drawRings(elapsed: number, ctx2d: CanvasRenderingContext2D) {
      const rings = [
        { ry: 300, rx: 340, y: 470, speed: 0.00004, alpha: 0.28 },
        { ry: 60, rx: 330, y: 615, speed: -0.00006, alpha: 0.22 },
        { ry: 380, rx: 380, y: 470, speed: 0.00002, alpha: 0.14 },
      ];
      for (const r of rings) {
        const rot = elapsed * r.speed;
        ctx2d.save();
        ctx2d.translate(CX, r.y);
        ctx2d.rotate(rot);
        ctx2d.strokeStyle = `rgba(90,210,255,${r.alpha})`;
        ctx2d.lineWidth = 1;
        ctx2d.beginPath();
        ctx2d.ellipse(0, 0, r.rx, r.ry, 0, 0, Math.PI * 2);
        ctx2d.stroke();
        ctx2d.restore();
      }
    }

    function drawSilhouette(ctx2d: CanvasRenderingContext2D, introProgress: number) {
      const path = pathFromPoints(SILHOUETTE);
      ctx2d.save();
      ctx2d.globalAlpha = 0.05 * introProgress;
      ctx2d.fillStyle = COLORS.cyan;
      ctx2d.fill(path);
      ctx2d.restore();
    }

    function drawStructuralLines(elapsed: number, ctx2d: CanvasRenderingContext2D, introProgress: number) {
      const flow = (elapsed * 0.05) % 40;
      const all = [
        ...STRUCTURAL_PATHS_LEFT.map((s) => ({ ...s, mirror: false })),
        ...STRUCTURAL_PATHS_LEFT.map((s) => ({ ...s, mirror: true })),
        ...STRUCTURAL_PATHS_CENTER.map((s) => ({ ...s, mirror: false })),
      ];

      for (const { path, closed, mirror } of all) {
        const pts = mirror ? mirrorPath(path) : path;
        const p2d = pathFromPoints(closed ? [...pts, pts[0]] : pts);

        ctx2d.save();
        ctx2d.globalAlpha = introProgress;
        ctx2d.strokeStyle = COLORS.cyanSoft;
        ctx2d.lineWidth = 1.1;
        ctx2d.setLineDash([]);
        ctx2d.stroke(p2d);
        ctx2d.restore();

        ctx2d.save();
        ctx2d.globalAlpha = introProgress * 0.9;
        ctx2d.strokeStyle = COLORS.cyan;
        ctx2d.shadowColor = COLORS.cyan;
        ctx2d.shadowBlur = 8;
        ctx2d.lineWidth = 1.4;
        ctx2d.setLineDash([18, 22]);
        ctx2d.lineDashOffset = -flow;
        ctx2d.stroke(p2d);
        ctx2d.restore();
      }
    }

    function particlePosition(p: Particle, elapsed: number): { pos: Vec; alpha: number } {
      // First-ever assembly (dramatic intro from wide scatter)
      const introDuration = 900;
      if (elapsed < p.introDelay) {
        return { pos: p.scatter, alpha: 0.15 };
      }
      const introT = elapsed - p.introDelay;
      if (introT < introDuration) {
        const e = easeOutCubic(introT / introDuration);
        return {
          pos: { x: lerp(p.scatter.x, p.target.x, e), y: lerp(p.scatter.y, p.target.y, e) },
          alpha: lerp(0.25, 1, e),
        };
      }

      // Idle phase: mostly settled, with periodic small "reform" flicker
      const cycleElapsed = (elapsed - p.introDelay - introDuration + p.cycleOffset) % p.cycleDuration;
      const reformDuration = 650;
      const jitterX = Math.sin(elapsed * 0.0016 + p.seed) * 1.1;
      const jitterY = Math.cos(elapsed * 0.0014 + p.seed * 1.3) * 1.1;

      if (cycleElapsed < reformDuration) {
        const e = easeOutCubic(cycleElapsed / reformDuration);
        const nearScatter: Vec = {
          x: p.target.x + Math.cos(p.seed) * 34,
          y: p.target.y + Math.sin(p.seed) * 34,
        };
        return {
          pos: {
            x: lerp(nearScatter.x, p.target.x + jitterX, e),
            y: lerp(nearScatter.y, p.target.y + jitterY, e),
          },
          alpha: lerp(0.35, 1, e),
        };
      }

      return {
        pos: { x: p.target.x + jitterX, y: p.target.y + jitterY },
        alpha: 1,
      };
    }

    function drawParticles(elapsed: number, ctx2d: CanvasRenderingContext2D) {
      const resolved: { pos: Vec; alpha: number; color: ParticleColor; size: number }[] = [];

      for (const p of PARTICLES) {
        const { pos, alpha } = particlePosition(p, elapsed);
        resolved.push({ pos, alpha, color: p.color, size: p.size });
      }

      // connective wireframe lines between nearby, mostly-assembled
      // structural particles only (mesh dust uses its own static edge list)
      ctx2d.lineWidth = 0.6;
      for (let i = 0; i < MESH_START; i++) {
        const a = resolved[i];
        if (a.alpha < 0.8) continue;
        let connections = 0;
        for (let j = i + 1; j < MESH_START && connections < 2; j++) {
          const b = resolved[j];
          if (b.alpha < 0.8) continue;
          const d = dist(a.pos, b.pos);
          if (d < 34) {
            const alpha = (1 - d / 34) * 0.22 * a.alpha;
            ctx2d.strokeStyle = `rgba(90,210,255,${alpha})`;
            ctx2d.beginPath();
            ctx2d.moveTo(a.pos.x, a.pos.y);
            ctx2d.lineTo(b.pos.x, b.pos.y);
            ctx2d.stroke();
            connections++;
          }
        }
      }

      // faint low-poly surface mesh texture (precomputed static edges)
      ctx2d.lineWidth = 0.5;
      for (const [i, j] of MESH_EDGES) {
        const a = resolved[MESH_START + i];
        const b = resolved[MESH_START + j];
        if (!a || !b) continue;
        const alpha = Math.min(a.alpha, b.alpha) * 0.09;
        if (alpha <= 0.005) continue;
        ctx2d.strokeStyle = `rgba(90,200,255,${alpha})`;
        ctx2d.beginPath();
        ctx2d.moveTo(a.pos.x, a.pos.y);
        ctx2d.lineTo(b.pos.x, b.pos.y);
        ctx2d.stroke();
      }

      for (const r of resolved) {
        ctx2d.save();
        ctx2d.globalAlpha = r.alpha;
        ctx2d.fillStyle = particleColor(r.color);
        ctx2d.shadowColor = particleColor(r.color);
        ctx2d.shadowBlur = r.color === "white" ? 6 : 4;
        ctx2d.beginPath();
        ctx2d.arc(r.pos.x, r.pos.y, r.size, 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.restore();
      }
    }


    function drawArmorPanels(elapsed: number, ctx2d: CanvasRenderingContext2D, introProgress: number) {
      // dark metallic helmet plates matching the reference cyber mask
      ctx2d.save();
      ctx2d.globalAlpha = introProgress * 0.72;
      ctx2d.fillStyle = "rgba(10,25,45,0.88)";
      ctx2d.strokeStyle = "rgba(80,220,255,0.45)";
      ctx2d.lineWidth = 1.2;

      const plates = [
        [[350,120],[250,175],[215,255],[350,350]],
        [[350,120],[450,175],[485,255],[350,350]],
        [[215,255],[300,300],[350,390],[260,430]],
        [[485,255],[400,300],[350,390],[440,430]],
        [[260,430],[315,520],[350,650],[285,700]],
        [[440,430],[385,520],[350,650],[415,700]],
      ];

      for (const plate of plates) {
        ctx2d.beginPath();
        plate.forEach((p, i) => {
          if (i === 0) ctx2d.moveTo(p[0], p[1]);
          else ctx2d.lineTo(p[0], p[1]);
        });
        ctx2d.closePath();
        ctx2d.fill();
        ctx2d.stroke();
      }

      // center forehead energy line
      const pulse = 0.5 + Math.sin(elapsed * 0.004) * 0.5;
      ctx2d.strokeStyle = `rgba(80,230,255,${0.35 + pulse * 0.4})`;
      ctx2d.shadowColor = COLORS.cyan;
      ctx2d.shadowBlur = 12;
      ctx2d.beginPath();
      ctx2d.moveTo(350,120);
      ctx2d.lineTo(350,390);
      ctx2d.stroke();
      ctx2d.restore();
    }

    function drawEyes(elapsed: number, ctx2d: CanvasRenderingContext2D, introProgress: number) {
      const pulse = 0.7 + Math.sin(elapsed * 0.004) * 0.3;
      for (const mirror of [false, true]) {
        const pts = mirror ? mirrorPath(eyeGlowLeft) : eyeGlowLeft;
        const p2d = pathFromPoints(pts);
        ctx2d.save();
        ctx2d.globalAlpha = introProgress;
        ctx2d.fillStyle = COLORS.cyan;
        ctx2d.shadowColor = COLORS.cyan;
        ctx2d.shadowBlur = 22 * pulse;
        ctx2d.fill(p2d);
        ctx2d.restore();

        ctx2d.save();
        ctx2d.globalAlpha = introProgress * 0.9;
        ctx2d.fillStyle = "rgba(255,255,255,0.85)";
        ctx2d.shadowBlur = 0;
        const center = pts[Math.floor(pts.length / 2)];
        ctx2d.beginPath();
        ctx2d.arc(center.x, center.y, 2.2, 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.restore();
      }
    }

    function drawCore(elapsed: number, ctx2d: CanvasRenderingContext2D, introProgress: number) {
      const pulse = 0.6 + Math.sin(elapsed * 0.0032) * 0.4;
      const rot = elapsed * 0.0006;
      ctx2d.save();
      ctx2d.globalAlpha = introProgress;
      ctx2d.translate(AI_CORE.x, AI_CORE.y);
      ctx2d.rotate(rot);

      const outerR = 16;
      ctx2d.beginPath();
      ctx2d.moveTo(0, -outerR);
      ctx2d.lineTo(outerR, 0);
      ctx2d.lineTo(0, outerR);
      ctx2d.lineTo(-outerR, 0);
      ctx2d.closePath();
      ctx2d.strokeStyle = COLORS.purple;
      ctx2d.shadowColor = COLORS.purple;
      ctx2d.shadowBlur = 16 * pulse;
      ctx2d.lineWidth = 1.4;
      ctx2d.stroke();

      const innerR = 5.5 * pulse;
      ctx2d.beginPath();
      ctx2d.arc(0, 0, innerR, 0, Math.PI * 2);
      ctx2d.fillStyle = COLORS.white;
      ctx2d.shadowColor = COLORS.cyan;
      ctx2d.shadowBlur = 12;
      ctx2d.fill();
      ctx2d.restore();

      // small orbiting motes
      for (let i = 0; i < 3; i++) {
        const a = rot * -1.6 + (i * Math.PI * 2) / 3;
        const ox = AI_CORE.x + Math.cos(a) * 26;
        const oy = AI_CORE.y + Math.sin(a) * 26;
        ctx2d.save();
        ctx2d.globalAlpha = introProgress * 0.9;
        ctx2d.fillStyle = COLORS.cyan;
        ctx2d.shadowColor = COLORS.cyan;
        ctx2d.shadowBlur = 6;
        ctx2d.beginPath();
        ctx2d.arc(ox, oy, 1.6, 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.restore();
      }
    }

    function drawScan(elapsed: number, ctx2d: CanvasRenderingContext2D, introProgress: number) {
      const clipPath = pathFromPoints(SILHOUETTE);
      ctx2d.save();
      ctx2d.clip(clipPath);

      const period = 3600;
      const t = (elapsed % period) / period;
      const yPos = -80 + t * (NORM_H + 160);
      const bandH = 90;

      const g = ctx2d.createLinearGradient(0, yPos - bandH, 0, yPos + bandH);
      g.addColorStop(0, "rgba(90,220,255,0)");
      g.addColorStop(0.5, `rgba(90,220,255,${0.12 * introProgress})`);
      g.addColorStop(1, "rgba(90,220,255,0)");
      ctx2d.fillStyle = g;
      ctx2d.fillRect(0, yPos - bandH, NORM_W, bandH * 2);

      ctx2d.strokeStyle = `rgba(150,235,255,${0.35 * introProgress})`;
      ctx2d.lineWidth = 1;
      ctx2d.beginPath();
      ctx2d.moveTo(0, yPos);
      ctx2d.lineTo(NORM_W, yPos);
      ctx2d.stroke();

      ctx2d.restore();
    }

    function drawHUD(elapsed: number, ctx2d: CanvasRenderingContext2D) {
      const introChars = Math.min(60, Math.floor(elapsed / 22));
      const lines = ["INITIALIZING...", "LOADING SYSTEMS...", "CALIBRATING VISION...", "CONNECTING MODULES..."];
      const readyAt = 2600;

      const baseSize = Math.max(10, Math.min(15, width * 0.011));
      const pad = Math.max(16, width * 0.03);
      ctx2d.save();
      ctx2d.font = `${baseSize}px "Courier New", monospace`;
      ctx2d.textBaseline = "top";
      ctx2d.fillStyle = "rgba(120,220,255,0.85)";

      let ty = pad;
      let shown = 0;
      for (const line of lines) {
        if (elapsed < shown) break;
        const remaining = Math.max(0, Math.min(line.length, Math.floor((elapsed - shown) / 24)));
        ctx2d.fillText(line.slice(0, remaining), pad, ty);
        ty += baseSize * 1.6;
        shown += 500;
      }
      if (elapsed > readyAt) {
        ctx2d.font = `bold ${baseSize * 1.3}px "Courier New", monospace`;
        ctx2d.fillStyle = "rgba(140,230,255,0.95)";
        ctx2d.shadowColor = COLORS.cyan;
        ctx2d.shadowBlur = 8;
        const alpha = clamp01((elapsed - readyAt) / 400);
        ctx2d.globalAlpha = alpha;
        ctx2d.fillText("READY.", pad, ty + 6);
        ctx2d.globalAlpha = 1;
        ctx2d.shadowBlur = 0;
      }

      // left label column
      const leftLabels = ["AI", "ROBOTICS", "CONTROL", "SIMULATION", "RESEARCH", "INNOVATION"];
      ctx2d.font = `${baseSize}px "Courier New", monospace`;
      ctx2d.fillStyle = "rgba(120,220,255,0.75)";
      let ly = height * 0.32;
      for (const label of leftLabels) {
        ctx2d.fillText(label, pad, ly);
        ly += baseSize * 1.7;
      }
      ctx2d.strokeStyle = "rgba(120,220,255,0.5)";
      ctx2d.beginPath();
      ctx2d.moveTo(pad, ly + 4);
      ctx2d.lineTo(pad + 46, ly + 4);
      ctx2d.stroke();

      // right label column
      const rightLabels = ["VISION", "PROCESSING", "LEARNING", "ADAPTATION", "AI CORE", "ONLINE"];
      ctx2d.textAlign = "right";
      let ry = height * 0.3;
      const rightX = width - pad;
      for (const label of rightLabels) {
        ctx2d.fillText(label, rightX, ry);
        ry += baseSize * 1.7;
      }
      ctx2d.beginPath();
      ctx2d.moveTo(rightX - 46, ry + 4);
      ctx2d.lineTo(rightX, ry + 4);
      ctx2d.stroke();
      ctx2d.textAlign = "left";

      // info box (model)
      const boxFont = Math.max(9, baseSize * 0.85);
      ctx2d.font = `${boxFont}px "Courier New", monospace`;
      const boxX = pad + width * 0.02;
      const boxY = height * 0.5;
      ctx2d.strokeStyle = "rgba(120,220,255,0.5)";
      ctx2d.strokeRect(boxX, boxY, width * 0.16, boxFont * 4.4);
      const boxLines = ["MODEL   R-01", "TYPE    AI MASK", "STATUS  ACTIVE"];
      boxLines.forEach((l, i) => {
        ctx2d.fillStyle = i === 2 ? "rgba(120,255,180,0.9)" : "rgba(150,225,255,0.85)";
        ctx2d.fillText(l, boxX + 10, boxY + 10 + i * boxFont * 1.5);
      });

      // info box (stats)
      const boxW = width * 0.2;
      const boxX2 = width - pad - width * 0.02 - boxW;
      const boxY2 = height * 0.66;
      ctx2d.strokeStyle = "rgba(120,220,255,0.5)";
      ctx2d.strokeRect(boxX2, boxY2, boxW, boxFont * 5.6);
      const statLines = [
        ["NEURAL SYNC", "100%"],
        ["VISUAL FEED", "ONLINE"],
        ["MOTION CORE", "STABLE"],
        ["AI LINK", "ESTABLISHED"],
      ];
      statLines.forEach((l, i) => {
        ctx2d.fillStyle = "rgba(150,225,255,0.85)";
        ctx2d.fillText(l[0], boxX2 + 10, boxY2 + 10 + i * boxFont * 1.5);
        ctx2d.fillStyle = "rgba(120,255,210,0.9)";
        ctx2d.fillText(l[1], boxX2 + boxW - 10 - ctx2d.measureText(l[1]).width, boxY2 + 10 + i * boxFont * 1.5);
      });

      ctx2d.restore();
    }

    /* -------------------------------------------------------------- */
    /*  Main loop                                                       */
    /* -------------------------------------------------------------- */

    function draw(now: number) {
      const elapsed = now - startTime;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      drawBackground(elapsed, ctx);

      const { scale, offsetX, offsetY } = getTransform();
      const introProgress = easeOutCubic(elapsed / 1600);

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      drawRings(elapsed, ctx);
      drawSilhouette(ctx, introProgress);
      drawStructuralLines(elapsed, ctx, introProgress);
      drawArmorPanels(elapsed, ctx, introProgress);
      drawParticles(elapsed, ctx);
      drawEyes(elapsed, ctx, introProgress);
      drawCore(elapsed, ctx, introProgress);
      drawScan(elapsed, ctx, introProgress);

      ctx.restore();

      drawHUD(elapsed, ctx);

      animationFrameId = requestAnimationFrame(draw);
    }

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "480px",
        position: "relative",
        background: "#030509",
        overflow: "hidden",
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

export default AnimatedRobotMask;
