import { useEffect, useRef } from 'react'

type Particle = {
  x:number;y:number;tx:number;ty:number;vx:number;vy:number;
  size:number;color:number;phase:number;
}

const colors = [
  [34,211,238],
  [59,130,246],
  [168,85,247],
  [236,72,153]
]

function createMask(w:number,h:number){
  const pts:{x:number;y:number}[]=[]

  const addLine=(a:[number,number],b:[number,number],n:number)=>{
    for(let i=0;i<=n;i++){
      const t=i/n
      pts.push({
        x:a[0]+(b[0]-a[0])*t,
        y:a[1]+(b[1]-a[1])*t
      })
    }
  }

  const addPoly=(p:number[][])=>{
    for(let i=0;i<p.length;i++){
      addLine(
        [p[i][0],p[i][1]],
        [p[(i+1)%p.length][0],p[(i+1)%p.length][1]],
        40
      )
    }
  }

  // futuristic symmetric robotic mask
  addPoly([
    [0.50,0.08],[0.72,0.25],[0.66,0.42],
    [0.82,0.55],[0.65,0.88],
    [0.50,0.98],[0.35,0.88],
    [0.18,0.55],[0.34,0.42],
    [0.28,0.25]
  ])

  // eye visor
  addPoly([
    [0.28,0.43],[0.45,0.38],[0.50,0.43],
    [0.55,0.38],[0.72,0.43],
    [0.58,0.55],[0.42,0.55]
  ])

  // center core
  for(let i=0;i<2500;i++){
    const x=.22+Math.random()*.56
    const y=.18+Math.random()*.68
    const dx=(x-.5)/.35
    const dy=(y-.55)/.45
    if(dx*dx+dy*dy<1) pts.push({x,y})
  }

  return pts.map(p=>({
    x:w/2,
    y:h/2,
    tx:p.x*w*.75+w*.02,
    ty:p.y*h*.75+h*.08,
    vx:0,vy:0,
    size:Math.random()*1.8+.4,
    color:Math.floor(Math.random()*colors.length),
    phase:Math.random()*6.28
  }))
}

export function AnimatedHumanFace(){
  const ref=useRef<HTMLCanvasElement|null>(null)

  useEffect(()=>{
    const canvas=ref.current
    if(!canvas)return
    const ctx=canvas.getContext('2d')
    if(!ctx)return

    let particles:Particle[]=[]
    let w=0,h=0
    let raf=0
    const mouse={x:-999,y:-999}

    const resize=()=>{
      w=canvas.clientWidth
      h=canvas.clientHeight
      canvas.width=w*devicePixelRatio
      canvas.height=h*devicePixelRatio
      ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)
      particles=createMask(w,h)
    }

    const move=(e:MouseEvent)=>{
      const r=canvas.getBoundingClientRect()
      mouse.x=e.clientX-r.left
      mouse.y=e.clientY-r.top
    }

    const animate=(time:number)=>{
      ctx.clearRect(0,0,w,h)

      particles.forEach((p)=>{
        p.x+=(p.tx-p.x)*.035
        p.y+=(p.ty-p.y)*.035

        const dx=p.x-mouse.x
        const dy=p.y-mouse.y
        const d=Math.sqrt(dx*dx+dy*dy)

        if(d<130){
          p.x+=dx/d*8
          p.y+=dy/d*8
        }

        const c=colors[p.color]
        const pulse=0.65+Math.sin(time*.003+p.phase)*.35

        ctx.beginPath()
        ctx.shadowBlur=12
        ctx.shadowColor=`rgb(${c[0]},${c[1]},${c[2]})`
        ctx.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${pulse})`
        ctx.arc(p.x,p.y,p.size,0,Math.PI*2)
        ctx.fill()
      })

      ctx.shadowBlur=0
      raf=requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize',resize)
    window.addEventListener('mousemove',move)
    raf=requestAnimationFrame(animate)

    return()=>{
      cancelAnimationFrame(raf)
      window.removeEventListener('resize',resize)
      window.removeEventListener('mousemove',move)
    }
  },[])

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none"/>
}
