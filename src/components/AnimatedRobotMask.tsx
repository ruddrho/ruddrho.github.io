import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function AnimatedRobotMask() {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  useEffect(() => {

    const canvas = canvasRef.current;

    if (!canvas) return;


    const context = canvas.getContext("2d");

    if (!context) return;


    const ctx = context;


    let animationId:number;
    let time = 0;



    const resize = () => {

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

    };


    resize();

    window.addEventListener(
      "resize",
      resize
    );



    const particles = Array.from(
      {length:350},
      ()=>({

        x:Math.random(),
        y:Math.random(),
        size:Math.random()*2+0.5,

        color:
          Math.random()>0.5
          ? "#00eaff"
          : "#8b5cff"

      })
    );




    const draw = () => {


      time += 0.03;



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
        Math.min(w,h)/600;


      ctx.scale(
        scale,
        scale
      );



      // =========================
      // ROTATING HUD RINGS
      // =========================


      ctx.rotate(time);


      ctx.beginPath();

      ctx.arc(
        0,
        0,
        230,
        0,
        Math.PI*2
      );


      ctx.strokeStyle="#00eaff";
      ctx.lineWidth=4;

      ctx.shadowBlur=25;
      ctx.shadowColor="#00eaff";

      ctx.stroke();



      ctx.rotate(-time*2);



      ctx.beginPath();

      ctx.arc(
        0,
        0,
        190,
        0,
        Math.PI*2
      );


      ctx.strokeStyle="#8b5cff";
      ctx.lineWidth=2;

      ctx.stroke();





      // =========================
      // ROBOT ARM
      // =========================


      ctx.shadowBlur=18;
      ctx.shadowColor="#00eaff";

      ctx.strokeStyle="#e8ffff";
      ctx.lineWidth=10;
      ctx.lineCap="round";



      // base

      ctx.beginPath();

      ctx.moveTo(
        -55,
        150
      );

      ctx.lineTo(
        55,
        150
      );

      ctx.stroke();




      const jointMove =
        Math.sin(time)*25;


      const wristMove =
        Math.cos(time*1.5)*18;




      // lower arm

      ctx.beginPath();

      ctx.moveTo(
        0,
        120
      );


      ctx.lineTo(
        -65,
        25 + jointMove
      );


      ctx.stroke();




      // upper arm


      ctx.beginPath();


      ctx.moveTo(
        -65,
        25 + jointMove
      );


      ctx.lineTo(
        55,
        -75 + wristMove
      );


      ctx.stroke();





      // joints


      const joints = [

        [0,120],

        [-65,25+jointMove],

        [55,-75+wristMove]

      ];



      joints.forEach(([x,y])=>{


        ctx.beginPath();


        ctx.arc(
          x,
          y,
          18,
          0,
          Math.PI*2
        );


        ctx.fillStyle="#07131f";

        ctx.fill();



        ctx.strokeStyle="#00eaff";

        ctx.lineWidth=3;

        ctx.stroke();




        ctx.beginPath();


        ctx.arc(
          x,
          y,
          6,
          0,
          Math.PI*2
        );


        ctx.fillStyle="#8b5cff";

        ctx.fill();


      });






      // =========================
      // GRIPPER
      // =========================


      const grip =
        Math.sin(time*3)*12;



      ctx.beginPath();


      ctx.moveTo(
        55,
        -75+wristMove
      );


      ctx.lineTo(
        95,
        -95+grip
      );


      ctx.moveTo(
        55,
        -75+wristMove
      );


      ctx.lineTo(
        95,
        -55-grip
      );


      ctx.stroke();






      // =========================
      // PARTICLES
      // =========================


      particles.forEach(p=>{


        p.y -=0.001;


        if(p.y<0)
          p.y=1;



        ctx.beginPath();


        ctx.arc(

          (p.x-0.5)*450,

          (p.y-0.5)*450,

          p.size,

          0,

          Math.PI*2

        );


        ctx.fillStyle=p.color;

        ctx.fill();


      });





      ctx.restore();



      animationId =
        requestAnimationFrame(draw);


    };



    draw();



    return()=>{

      cancelAnimationFrame(
        animationId
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
