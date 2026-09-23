import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function AnimatedRobotMask() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;


    let animationFrame: number;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    resize();

    window.addEventListener("resize", resize);


    const particles = Array.from(
      { length: 900 },
      () => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.002 + 0.001,
        color:
          Math.random() > 0.5
            ? "#00eaff"
            : "#9b5cff"
      })
    );


    const draw = () => {

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );


      const w = canvas.width;
      const h = canvas.height;


      // helmet silhouette
      ctx.save();

      ctx.translate(
        w / 2,
        h / 2
      );


      const scale = Math.min(w,h)/600;

      ctx.scale(scale,scale);


      // outer cyber helmet
      ctx.beginPath();

      ctx.moveTo(0,-230);

      ctx.lineTo(150,-180);
      ctx.lineTo(190,-50);

      ctx.lineTo(130,180);

      ctx.lineTo(0,230);

      ctx.lineTo(-130,180);

      ctx.lineTo(-190,-50);

      ctx.lineTo(-150,-180);

      ctx.closePath();


      ctx.strokeStyle =
        "#00eaff";

      ctx.lineWidth = 3;

      ctx.shadowBlur = 20;

      ctx.shadowColor =
        "#00eaff";

      ctx.stroke();



      // eye visor

      ctx.beginPath();

      ctx.moveTo(-110,-30);
      ctx.lineTo(-25,-15);
      ctx.lineTo(-10,0);
      ctx.lineTo(-110,15);

      ctx.closePath();


      ctx.moveTo(110,-30);
      ctx.lineTo(25,-15);
      ctx.lineTo(10,0);
      ctx.lineTo(110,15);

      ctx.closePath();


      ctx.fillStyle =
        "#00f5ff";

      ctx.shadowBlur = 35;

      ctx.fill();



      // center armor

      ctx.beginPath();

      ctx.moveTo(0,20);

      ctx.lineTo(45,80);

      ctx.lineTo(0,160);

      ctx.lineTo(-45,80);

      ctx.closePath();


      ctx.strokeStyle =
        "#8b5cff";

      ctx.stroke();


      // particles

      particles.forEach(p=>{

        const px =
          (p.x-0.5)*300;

        const py =
          (p.y-0.5)*420;


        const inside =
          Math.abs(px)<180 &&
          Math.abs(py)<220;


        if(inside){

          ctx.beginPath();

          ctx.arc(
            px,
            py,
            p.size,
            0,
            Math.PI*2
          );


          ctx.fillStyle =
            p.color;


          ctx.fill();


          p.y += p.speed;


          if(p.y>1)
            p.y=0;
        }

      });


      ctx.restore();


      animationFrame =
        requestAnimationFrame(draw);
    };


    draw();


    return()=>{

      cancelAnimationFrame(animationFrame);

      window.removeEventListener(
        "resize",
        resize
      );

    };


  },[]);



  return (

    <motion.div

      initial={{
        opacity:0,
        scale:0.9
      }}

      animate={{
        opacity:1,
        scale:1
      }}

      transition={{
        duration:1.2
      }}

      className="
      relative
      w-full
      h-full
      flex
      items-center
      justify-center
      "
    >

      <canvas

        ref={canvasRef}

        className="
        absolute
        inset-0
        w-full
        h-full
        "
      />


    </motion.div>

  );
}
