import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function AnimatedRobotMask() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let animationId: number;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    resize();
    window.addEventListener("resize", resize);


    const particles = Array.from(
      { length: 300 },
      () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 2 + 0.5,
        c: Math.random() > .5
          ? "#00eaff"
          : "#9b5cff"
      })
    );


    function draw(){

      if(!ctx) return;

      frame += 0.03;


      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );


      const w = canvas.width;
      const h = canvas.height;


      ctx.save();

      ctx.translate(
        w/2,
        h/2
      );


      const scale =
        Math.min(w,h)/650;


      ctx.scale(scale,scale);



      // ======================
      // ROTATING HUD CIRCLES
      // ======================


      ctx.rotate(frame);


      ctx.beginPath();
      ctx.arc(
        0,
        0,
        230,
        0,
        Math.PI*2
      );

      ctx.strokeStyle="#00eaff";
      ctx.lineWidth=5;
      ctx.shadowBlur=25;
      ctx.shadowColor="#00eaff";
      ctx.stroke();



      ctx.rotate(-frame*2);



      ctx.beginPath();

      ctx.arc(
        0,
        0,
        190,
        0,
        Math.PI*2
      );

      ctx.strokeStyle="#8b5cff";
      ctx.lineWidth=3;
      ctx.stroke();




      // ======================
      // ROBOT ARM
      // ======================


      ctx.shadowBlur=15;
      ctx.shadowColor="#00eaff";

      ctx.strokeStyle="#d8ffff";
      ctx.lineWidth=10;
      ctx.lineCap="round";



      // base

      ctx.beginPath();

      ctx.moveTo(
        -50,
        150
      );

      ctx.lineTo(
        50,
        150
      );

      ctx.stroke();



      // joint animation

      const elbow =
        Math.sin(frame)*25;


      const wrist =
        Math.cos(frame*1.5)*20;



      // first arm

      ctx.beginPath();

      ctx.moveTo(
        0,
        120
      );


      ctx.lineTo(
        -60,
        30 + elbow
      );

      ctx.stroke();



      // second arm

      ctx.beginPath();

      ctx.moveTo(
        -60,
        30 + elbow
      );


      ctx.lineTo(
        50,
        -70 + wrist
      );


      ctx.stroke();




      // joints

      const joints=[
        [0,120],
        [-60,30+elbow],
        [50,-70+wrist]
      ];


      joints.forEach(j=>{

        ctx.beginPath();

        ctx.arc(
          j[0],
          j[1],
          18,
          0,
          Math.PI*2
        );

        ctx.fillStyle="#06121c";
        ctx.fill();

        ctx.strokeStyle="#00eaff";
        ctx.stroke();


        ctx.beginPath();

        ctx.arc(
          j[0],
          j[1],
          6,
          0,
          Math.PI*2
        );

        ctx.fillStyle="#8b5cff";
        ctx.fill();

      });



      // gripper animation

      const grip =
        Math.sin(frame*2)*10;


      ctx.beginPath();

      ctx.moveTo(
        50,
        -70+wrist
      );

      ctx.lineTo(
        90,
        -90+grip
      );

      ctx.moveTo(
        50,
        -70+wrist
      );

      ctx.lineTo(
        90,
        -50-grip
      );


      ctx.stroke();



      // ======================
      // PARTICLES
      // ======================


      particles.forEach(p=>{

        p.y -=0.001;

        if(p.y<0)
          p.y=1;


        ctx.beginPath();

        ctx.arc(
          (p.x-.5)*500,
          (p.y-.5)*500,
          p.r,
          0,
          Math.PI*2
        );


        ctx.fillStyle=p.c;
        ctx.fill();

      });


      ctx.restore();


      animationId =
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
        scale:.85
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
