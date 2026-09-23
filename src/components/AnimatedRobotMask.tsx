import { useEffect, useRef } from "react";

export function AnimatedRobotMask() {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {

    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    const ctx: CanvasRenderingContext2D = context;


    const resize = () => {

      const dpr = window.devicePixelRatio || 1;

      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
    };


    resize();

    window.addEventListener(
      "resize",
      resize
    );


    const particles = Array.from(
      { length: 1200 },
      () => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random()*2+0.5,
        speed: Math.random()*0.02+0.005
      })
    );


    let time = 0;


    const animate = () => {

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;


      ctx.clearRect(
        0,
        0,
        w,
        h
      );


      particles.forEach((p)=>{


        const px =
          w/2 +
          (p.x-0.5)*260;


        const py =
          h/2 +
          (p.y-0.5)*360;


        // robot mask area

        const mask =
          Math.abs(p.x-0.5)<0.42 &&
          p.y>0.12 &&
          p.y<0.88;


        if(mask){

          ctx.beginPath();


          ctx.fillStyle =
            Math.sin(time+p.x*10)>0
            ? "#00eaff"
            : "#9b5cff";


          ctx.shadowBlur = 15;
          ctx.shadowColor="#00eaff";


          ctx.arc(
            px,
            py,
            p.size,
            0,
            Math.PI*2
          );


          ctx.fill();

        }

      });



      // angular robot mask outline

      ctx.strokeStyle="#00eaff";
      ctx.lineWidth=2;
      ctx.shadowBlur=25;
      ctx.shadowColor="#00eaff";


      ctx.beginPath();

      ctx.moveTo(w*.35,h*.25);
      ctx.lineTo(w*.65,h*.25);

      ctx.lineTo(w*.78,h*.45);

      ctx.lineTo(w*.65,h*.75);

      ctx.lineTo(w*.5,h*.88);

      ctx.lineTo(w*.35,h*.75);

      ctx.lineTo(w*.22,h*.45);

      ctx.closePath();

      ctx.stroke();



      // glowing eyes

      ctx.strokeStyle="#ffffff";
      ctx.lineWidth=6;


      ctx.beginPath();

      ctx.moveTo(
        w*.32,
        h*.48
      );

      ctx.lineTo(
        w*.45,
        h*.48
      );


      ctx.moveTo(
        w*.55,
        h*.48
      );

      ctx.lineTo(
        w*.68,
        h*.48
      );


      ctx.stroke();



      time +=0.03;


      requestAnimationFrame(
        animate
      );

    };


    animate();


    return()=>{

      window.removeEventListener(
        "resize",
        resize
      );

    };


  },[]);



  return (

    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />

  );

}
