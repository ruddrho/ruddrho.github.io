import { useEffect, useRef } from "react";

type Particle = {
  x:number;
  y:number;
  tx:number;
  ty:number;
  size:number;
  color:string;
  phase:number;
};

const COLORS = [
  "34,211,238",
  "59,130,246",
  "168,85,247"
];

function createMask(w:number,h:number):Particle[] {
  const pts:Particle[]=[];

  const add=(x:number,y:number,size=1.5)=>{
    pts.push({
      x:w/2,
      y:h/2,
      tx:x*w,
      ty:y*h,
      size,
      color:COLORS[Math.floor(Math.random()*COLORS.length)],
      phase:Math.random()*10
    });
  };

  const line=(a:number[],b:number[],n:number)=>{
    for(let i=0;i<n;i++){
      const t=i/(n-1);
      add(
        a[0]+(b[0]-a[0])*t,
        a[1]+(b[1]-a[1])*t,
        1.2
      );
    }
  };

  // helmet outer shell
  const shell=[
    [0.5,0.08],
    [0.68,0.16],
    [0.80,0.34],
    [0.78,0.65],
    [0.62,0.88],
    [0.5,0.94],
    [0.38,0.88],
    [0.22,0.65],
    [0.20,0.34],
    [0.32,0.16]
  ];

  for(let i=0;i<shell.length;i++){
    line(shell[i],shell[(i+1)%shell.length],50);
  }

  // eye visor
  line([0.27,0.40],[0.45,0.36],35);
  line([0.55,0.36],[0.73,0.40],35);
  line([0.45,0.36],[0.50,0.44],20);
  line([0.50,0.44],[0.55,0.36],20);

  // eye cores
  for(let i=0;i<120;i++){
    add(
      0.34+Math.random()*0.32,
      0.40+Math.random()*0.035,
      2
    );
  }

  // central AI reactor
  for(let i=0;i<500;i++){
    const a=Math.random()*Math.PI*2;
    const r=Math.random()*0.06;
    add(
      0.5+Math.cos(a)*r,
      0.58+Math.sin(a)*r,
      1.8
    );
  }

  // jaw vents
  for(let y=0.70;y<0.80;y+=0.018){
    line([0.38,y],[0.62,y],22);
  }

  // random inner neural points
  for(let i=0;i<1200;i++){
    const x=.28+Math.random()*.44;
    const y=.20+Math.random()*.58;
    add(x,y,.7);
  }

  return pts;
}

export function AnimatedHumanFace(){

  const ref=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const canvas=ref.current;
    if(!canvas)return;

    const ctx=canvas.getContext("2d");
    if(!ctx)return;

    let w=0,h=0;
    let particles:Particle[]=[];
    let raf=0;

    const mouse={x:0,y:0};

    const resize=()=>{
      w=canvas.clientWidth;
      h=canvas.clientHeight;

      canvas.width=w*devicePixelRatio;
      canvas.height=h*devicePixelRatio;

      ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);

      particles=createMask(w,h);
    };

    const move=(e:MouseEvent)=>{
      const rect=canvas.getBoundingClientRect();
      mouse.x=(e.clientX-rect.left-w/2)/w;
      mouse.y=(e.clientY-rect.top-h/2)/h;
    };

    const animate=(time:number)=>{

      ctx.clearRect(0,0,w,h);

      particles.forEach(p=>{

        p.x+=(p.tx-p.x)*0.035;
        p.y+=(p.ty-p.y)*0.035;

        const px=p.x+mouse.x*15;
        const py=p.y+mouse.y*10+
          Math.sin(time*.003+p.phase);

        const alpha=.45+
          Math.sin(time*.005+p.phase)*.3;

        ctx.beginPath();
        ctx.fillStyle=
          `rgba(${p.color},${alpha})`;

        ctx.shadowBlur=15;
        ctx.shadowColor=
          `rgb(${p.color})`;

        ctx.arc(
          px,
          py,
          p.size,
          0,
          Math.PI*2
        );

        ctx.fill();
      });

      raf=requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize",resize);
    window.addEventListener("mousemove",move);

    raf=requestAnimationFrame(animate);

    return()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",resize);
      window.removeEventListener("mousemove",move);
    };

  },[]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
