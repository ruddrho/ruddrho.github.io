import { useEffect, useRef } from "react";

type Particle = {
  x:number;
  y:number;
  z:number;
  tx:number;
  ty:number;
  tz:number;
  size:number;
  color:number;
  phase:number;
};

const colors = [
  "34,211,238",
  "59,130,246",
  "168,85,247",
  "236,72,153"
];

function generateAIHead(w:number,h:number):Particle[]{
  const pts:Particle[]=[];

  for(let i=0;i<4200;i++){
    const theta=Math.random()*Math.PI*2;
    const y=Math.random()*2-1;

    const radius=Math.sqrt(1-y*y);

    // 3D head volume
    let x=radius*Math.cos(theta);
    let z=radius*Math.sin(theta);

    let yy=y;

    // face shaping
    x*=0.48;
    yy*=0.75;

    if(yy< -0.45){
      x*=0.72;
    }

    // front face projection
    const px=w*0.32 + x*w*0.85;
    const py=h*0.50 + yy*h*0.75;

    pts.push({
      x:w/2,
      y:h/2,
      z:0,
      tx:px,
      ty:py,
      tz:z,
      size:Math.random()*1.8+0.4,
      color:Math.floor(Math.random()*colors.length),
      phase:Math.random()*10
    });
  }

  return pts;
}

export function AnimatedHumanFace(){

  const canvasRef=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{

    const canvas=canvasRef.current;
    if(!canvas)return;

    const ctx=canvas.getContext("2d");
    if(!ctx)return;

    let w=0;
    let h=0;
    let particles:Particle[]=[];
    let raf=0;

    const mouse={x:0,y:0};

    const resize=()=>{
      w=canvas.clientWidth;
      h=canvas.clientHeight;

      canvas.width=w*devicePixelRatio;
      canvas.height=h*devicePixelRatio;

      ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);

      particles=generateAIHead(w,h);
    };

    const move=(e:MouseEvent)=>{
      const r=canvas.getBoundingClientRect();
      mouse.x=(e.clientX-r.left-w/2)/w;
      mouse.y=(e.clientY-r.top-h/2)/h;
    };

    const render=(time:number)=>{

      ctx.clearRect(0,0,w,h);

      particles.forEach(p=>{

        const float=Math.sin(time*0.002+p.phase)*2;

        p.x+=(p.tx-p.x)*0.025;
        p.y+=(p.ty-p.y)*0.025;

        const rotateX=mouse.y*20;
        const rotateY=mouse.x*30;

        const depth=p.z+rotateY;

        const px=p.x + Math.sin(depth)*rotateX;
        const py=p.y + float;

        const glow=0.45+
          Math.sin(time*0.004+p.phase)*0.35;

        ctx.beginPath();
        ctx.fillStyle=
        `rgba(${colors[p.color]},${glow})`;

        ctx.shadowBlur=18;
        ctx.shadowColor=
        `rgb(${colors[p.color]})`;

        ctx.arc(
          px,
          py,
          p.size*(1+depth*0.1),
          0,
          Math.PI*2
        );

        ctx.fill();
      });

      raf=requestAnimationFrame(render);
    };

    resize();

    window.addEventListener("resize",resize);
    window.addEventListener("mousemove",move);

    raf=requestAnimationFrame(render);

    return()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",resize);
      window.removeEventListener("mousemove",move);
    };

  },[]);


  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
