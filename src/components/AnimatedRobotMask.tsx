import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function AnimatedRobotMask() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const ctx = context;

    let frame = 0;
    let animationId: number;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;

      ctx.setTransform(
        window.devicePixelRatio,
        0,
        0,
        window.devicePixelRatio,
        0,
        0
      );
    };


    resize();

    window.addEventListener("resize", resize);


    const particles = Array.from(
      { length: 500 },
      () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random()*2+0.5,
        c:
          Math.random()>0.5
          ? "#00eaff"
          : "#8b5cff"
      })
    );


    function draw(){

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;


      ctx.clearRect(0,0,w,h);


      ctx.save();

      ctx.translate(
        w/2,
        h/2
      );


      const s =
        Math.min(w,h)/500;

      ctx.scale(s,s);



      // outer robotic head

      ctx.beginPath();

      ctx.moveTo(0,-210);
      ctx.lineTo(120,-170);
      ctx.lineTo(170,-60);
      ctx.lineTo(150,120);
      ctx.lineTo(70,190);
      ctx.lineTo(0,220);
      ctx.lineTo(-70,190);
      ctx.lineTo(-150,120);
      ctx.lineTo(-170,-60);
      ctx.lineTo(-120,-170);

      ctx.closePath();


      ctx.strokeStyle="#00eaff";
      ctx.lineWidth=3;

      ctx.shadowBlur=25;
      ctx.shadowColor="#00eaff";

      ctx.stroke();



      // helmet panels

      ctx.shadowBlur=10;
      ctx.strokeStyle="#8b5cff";


      ctx.beginPath();

      ctx.moveTo(-100,-120);
      ctx.lineTo(0,-170);
      ctx.lineTo(100,-120);

      ctx.moveTo(-130,50);
      ctx.lineTo(-70,110);

      ctx.moveTo(130,50);
      ctx.lineTo(70,110);

      ctx.stroke();



      // glowing eyes

      ctx.fillStyle="#00f5ff";

      ctx.shadowBlur=40;
      ctx.shadowColor="#00f5ff";


      ctx.beginPath();

      ctx.moveTo(-115,-35);
      ctx.lineTo(-20,-20);
      ctx.lineTo(-45,5);
      ctx.lineTo(-125,0);

      ctx.closePath();


      ctx.moveTo(115,-35);
      ctx.lineTo(20,-20);
      ctx.lineTo(45,5);
      ctx.lineTo(125,0);

      ctx.closePath();


      ctx.fill();



      // center face reactor

      ctx.shadowBlur=15;

      ctx.strokeStyle="#8b5cff";

      ctx.beginPath();

      ctx.moveTo(0,20);
      ctx.lineTo(45,80);
      ctx.lineTo(0,150);
      ctx.lineTo(-45,80);
      ctx.closePath();

      ctx.stroke();



      // particles inside mask


      particles.forEach(p=>{

        const px=(p.x-.5)*280;
        const py=(p.y-.5)*380;


        ctx.beginPath();

        ctx.arc(
          px,
          py,
          p.r,
          0,
          Math.PI*2
        );

        ctx.fillStyle=p.c;

        ctx.fill();


        p.y +=0.0008;

        if(p.y>1)
          p.y=0;


      });



      // scanning animation

      ctx.strokeStyle="rgba(0,234,255,.5)";
      ctx.lineWidth=1;


      const scan =
        Math.sin(frame*0.03)*120;


      ctx.beginPath();

      ctx.moveTo(-150,scan);
      ctx.lineTo(150,scan);

      ctx.stroke();



      ctx.restore();


      frame++;

      animationId=
        requestAnimationFrame(draw);

    }


    draw();



    return()=>{

      cancelAnimationFrame(animationId);

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
