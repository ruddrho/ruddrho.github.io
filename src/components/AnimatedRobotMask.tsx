import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function AnimatedRobotMask() {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  useEffect(() => {

    const canvas = canvasRef.current;

    if (!canvas) return;


    const ctx = canvas.getContext("2d");

    if (!ctx) return;


    let animationFrame = 0;
    let frame = 0;


    const resize = () => {

      const rect = canvas.getBoundingClientRect();

      canvas.width =
        rect.width * window.devicePixelRatio;

      canvas.height =
        rect.height * window.devicePixelRatio;


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


    window.addEventListener(
      "resize",
      resize
    );



    const particles = Array.from(
      { length: 700 },
      () => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 0.5,
        color:
          Math.random() > 0.5
          ? "#00eaff"
          : "#9b5cff"
      })
    );



    const draw = () => {


      const width =
        canvas.clientWidth;

      const height =
        canvas.clientHeight;



      ctx.clearRect(
        0,
        0,
        width,
        height
      );



      ctx.save();



      ctx.translate(
        width / 2,
        height / 2
      );



      const scale =
        Math.min(width,height) / 520;


      ctx.scale(
        scale,
        scale
      );



      // ROBOT HEAD OUTLINE

      ctx.beginPath();

      ctx.moveTo(0,-220);

      ctx.lineTo(115,-185);

      ctx.lineTo(175,-70);

      ctx.lineTo(150,120);

      ctx.lineTo(70,190);

      ctx.lineTo(0,220);

      ctx.lineTo(-70,190);

      ctx.lineTo(-150,120);

      ctx.lineTo(-175,-70);

      ctx.lineTo(-115,-185);

      ctx.closePath();



      ctx.strokeStyle =
        "#00eaff";

      ctx.lineWidth = 4;

      ctx.shadowBlur = 30;

      ctx.shadowColor =
        "#00eaff";


      ctx.stroke();



      // TOP ARMOR

      ctx.shadowBlur = 15;

      ctx.strokeStyle =
        "#8b5cff";


      ctx.beginPath();

      ctx.moveTo(
        -120,
        -130
      );

      ctx.lineTo(
        0,
        -175
      );

      ctx.lineTo(
        120,
        -130
      );


      ctx.stroke();




      // EYES


      ctx.fillStyle =
        "#00f5ff";

      ctx.shadowBlur =
        45;

      ctx.shadowColor =
        "#00f5ff";



      ctx.beginPath();


      ctx.moveTo(
        -125,
        -35
      );

      ctx.lineTo(
        -30,
        -25
      );

      ctx.lineTo(
        -55,
        10
      );

      ctx.lineTo(
        -135,
        0
      );

      ctx.closePath();



      ctx.moveTo(
        125,
        -35
      );

      ctx.lineTo(
        30,
        -25
      );

      ctx.lineTo(
        55,
        10
      );

      ctx.lineTo(
        135,
        0
      );

      ctx.closePath();


      ctx.fill();




      // FACE CORE


      ctx.shadowBlur = 20;

      ctx.strokeStyle =
        "#b26cff";


      ctx.beginPath();

      ctx.moveTo(
        0,
        25
      );

      ctx.lineTo(
        45,
        85
      );

      ctx.lineTo(
        0,
        160
      );

      ctx.lineTo(
        -45,
        85
      );

      ctx.closePath();


      ctx.stroke();




      // PARTICLE SYSTEM


      particles.forEach(
        (p)=>{


          const x =
            (p.x-0.5)*300;


          const y =
            (p.y-0.5)*400;



          ctx.beginPath();


          ctx.arc(
            x,
            y,
            p.size,
            0,
            Math.PI*2
          );


          ctx.fillStyle =
            p.color;


          ctx.fill();



          p.y += 0.0007;


          if(p.y>1)
          {
            p.y=0;
          }


        }
      );




      // SCANNER LINE


      const scan =
        Math.sin(frame*0.04)*150;


      ctx.strokeStyle =
        "rgba(0,234,255,0.5)";


      ctx.lineWidth=1;


      ctx.beginPath();


      ctx.moveTo(
        -160,
        scan
      );


      ctx.lineTo(
        160,
        scan
      );


      ctx.stroke();



      ctx.restore();



      frame++;


      animationFrame =
        requestAnimationFrame(draw);

    };



    draw();



    return ()=>{

      cancelAnimationFrame(
        animationFrame
      );


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
