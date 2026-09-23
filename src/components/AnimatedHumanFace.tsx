import { useEffect, useRef } from "react";

type Dot = {
  x:number;
  y:number;
  tx:number;
  ty:number;
  s:number;
  c:number;
  p:number;
};

const palette = [
  "34,211,238",
  "59,130,246",
  "168,85,247",
  "236,72,153"
];

function buildRobotMask(w:number,h:number):Dot[]{
  const points:{x:number,y:number}[]=[];

  const line=(x1:number,y1:number,x2:number,y2:number,count:number)=>{
    for(let i=0;i<count;i++){
      const t=i/(count-1);
      points.push({
        x:x1+(x2-x1)*t,
        y:y1+(y2-y1)*t
      });
    }
  };

  const poly=(arr:number[][])=>{
    for(let i=0;i<arr.length;i++){
      const a=arr[i];
      const b=arr[(i+1)%arr.length];
      line(a[0],a[1],b[0],b[1],35);
    }
  };

  // sharp cyber mask outer armor
  poly([
    [0.50,0.08],
    [0.78,0.22],
    [0.86,0.50],
    [0.72,0.82],
    [0.50,0.94],
    [0.28,0.82],
    [0.14,0.50],
    [0.22,0.22]
  ]);

  // eye visor
  poly([
    [0.22,0.40],
    [0.42,0.34],
    [0.50,0.40],
    [0.58,0.34],
    [0.78,0.40],
    [0.60,0.50],
    [0.40,0.50]
  ]);

  // central reactor
  for(let i=0;i<800;i++){
    const a=Math.random()*Math.PI*2;
    const r=Math.random()*0.10;
    points.push({
      x:0.5+Math.cos(a)*r,
      y:0.56+Math.sin(a)*r
    });
  }

  // circuit lines
  for(let i=0;i<25;i++){
    const y=.18+i*.025;
    line(.28,y,.72,y+Math.sin(i)*.02,20);
  }

  return points.map(pt=>({
    x:w/2,
    y:h/2,
    tx:w*(pt.x*.65+.15),
    ty:h*(pt.y*.72+.12),
    s:Math.random()*2+0.5,
    c:Math.floor(Math.random()*palette.length),
    p:Math.random()*10
  }));
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
    let dots:Dot[]=[];
    let frame=0;

    const resize=()=>{
      w=canvas.clientWidth;
      h=canvas.clientHeight;
      canvas.width=w*devicePixelRatio;
      canvas.height=h*devicePixelRatio;
      ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
      dots=buildRobotMask(w,h);
    };

    const animate=(t:number)=>{
      ctx.clearRect(0,0,w,h);

      dots.forEach(d=>{
        d.x+=(d.tx-d.x)*0.045;
        d.y+=(d.ty-d.y)*0.045;

        const pulse=0.65+Math.sin(t*0.004+d.p)*0.35;
        ctx.beginPath();
        ctx.fillStyle=`rgba(${palette[d.c]},${pulse})`;
        ctx.shadowBlur=14;
        ctx.shadowColor=`rgb(${palette[d.c]})`;
        ctx.arc(d.x,d.y,d.s,0,Math.PI*2);
        ctx.fill();
      });

      frame=requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize",resize);
    frame=requestAnimationFrame(animate);

    return()=>{
      cancelAnimationFrame(frame);
      window.removeEventListener("resize",resize);
    };
  },[]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
