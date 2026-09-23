import { useEffect, useRef } from "react";

type P = {
  x:number;y:number;tx:number;ty:number;
  size:number; color:string; phase:number;
};

const C = [
  "34,211,238",
  "59,130,246",
  "168,85,247",
  "236,72,153"
];

function makeMask(w:number,h:number):P[] {
  const pts:P[] = [];

  const add = (x:number,y:number,s=1)=>{
    pts.push({
      x:w/2,
      y:h/2,
      tx:w*x,
      ty:h*y,
      size:s,
      color:C[Math.floor(Math.random()*C.length)],
      phase:Math.random()*20
    });
  };

  const line=(a:number[],b:number[],n:number)=>{
    for(let i=0;i<n;i++){
      const t=i/(n-1);
      add(
        a[0]+(b[0]-a[0])*t,
        a[1]+(b[1]-a[1])*t,
        1.5
      );
    }
  };

  // helmet shell
  const shell=[
    [0.50,0.08],[0.72,0.18],[0.82,0.42],
    [0.76,0.72],[0.60,0.88],
    [0.50,0.94],[0.40,0.88],
    [0.24,0.72],[0.18,0.42],
    [0.28,0.18]
  ];

  for(let i=0;i<shell.length;i++)
    line(shell[i],shell[(i+1)%shell.length],45);

  // visor
  line([0.28,0.38],[0.46,0.34],35);
  line([0.54,0.34],[0.72,0.38],35);
  line([0.46,0.34],[0.50,0.42],20);
  line([0.50,0.42],[0.54,0.34],20);

  // eyes
  for(let i=0;i<120;i++){
    add(0.34+Math.random()*0.32,0.40+Math.random()*0.04,2);
  }

  // reactor
  for(let i=0;i<350;i++){
    const a=Math.random()*Math.PI*2;
    const r=Math.random()*0.07;
    add(0.5+Math.cos(a)*r,0.58+Math.sin(a)*r,2);
  }

  // jaw vents
  for(let y=0.70;y<0.80;y+=0.018){
    line([0.38,y],[0.62,y],20);
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
    let particles:P[]=[];
    let raf=0;
    const mouse={x:0,y:0};

    const resize=()=>{
      w=canvas.clientWidth;
      h=canvas.clientHeight;
      canvas.width=w*devicePixelRatio;
      canvas.height=h*devicePixelRatio;
      ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
      particles=makeMask(w,h);
    };

    const move=(e:MouseEvent)=>{
      mouse.x=e.clientX/w-0.5;
      mouse.y=e.clientY/h-0.5;
    };

    const draw=(t:number)=>{
      ctx.clearRect(0,0,w,h);

      particles.forEach(p=>{
        p.x+=(p.tx-p.x)*0.04;
        p.y+=(p.ty-p.y)*0.04;

        const px=p.x+mouse.x*18*Math.sin(p.phase);
        const py=p.y+mouse.y*12;

        ctx.beginPath();
        ctx.shadowBlur=18;
        ctx.shadowColor=`rgb(${p.color})`;
        ctx.fillStyle=`rgba(${p.color},${0.55+Math.sin(t*.004+p.phase)*.35})`;
        ctx.arc(px,py,p.size,0,Math.PI*2);
        ctx.fill();
      });

      raf=requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize",resize);
    window.addEventListener("mousemove",move);
    raf=requestAnimationFrame(draw);

    return()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",resize);
      window.removeEventListener("mousemove",move);
    };
  },[]);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none"/>;
}
