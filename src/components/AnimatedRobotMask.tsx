import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function AnimatedRobotMask() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;


    let frame:number;


    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };


    resize();
    window.addEventListener("resize",resize);



    const particles = Array.from(
      {length:700},
      ()=>({
        x:(Math.random()-0.5)*300,
        y:(Math.random()-0.5)*420,
        r:Math.random()*1.8+0.4,
        c:Math.random()>0.5
        ? "#00eaff"
        :"#9b5cff"
      })
    );



    function line(points:number[][],color:string,width:number){

      ctx.beginPath();

      points.forEach((p,i)=>{

        if(i===0)
          ctx.moveTo(p[0],p[1]);
        else
          ctx.lineTo(p[0],p[1]);

      });


      ctx.strokeStyle=color;
      ctx.lineWidth=width;
      ctx.shadowBlur=20;
      ctx.shadowColor=color;

      ctx.stroke();

    }




    const draw=()=>{


      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );


      const w=canvas.width;
      const h=canvas.height;



      ctx.save();


      ctx.translate(
        w/2,
        h/2
      );


      const s=Math.min(w,h)/600;

      ctx.scale(s,s);



      // ===== OUTER MASK =====

      line(
        [
          [0,-230],
          [80,-180],
          [160,-170],
          [190,-60],
          [150,120],
          [80,210],
          [0,250],
          [-80,210],
          [-150,120],
          [-190,-60],
          [-160,-170],
          [-80,-180],
          [0,-230]
        ],
        "#00eaff",
        4
      );



      // ===== FOREHEAD V ARMOR =====


      line(
        [
          [-120,-120],
          [0,-40],
          [120,-120],
          [60,-160],
          [0,-100],
          [-60,-160],
          [-120,-120]
        ],
        "#5b8cff",
        5
      );



      // ===== EYES =====


      ctx.fillStyle="#00f5ff";

      ctx.shadowBlur=40;
      ctx.shadowColor="#00f5ff";


      ctx.beginPath();

      ctx.moveTo(-130,-40);
      ctx.lineTo(-25,-25);
      ctx.lineTo(-70,0);
      ctx.lineTo(-140,-5);

      ctx.closePath();


      ctx.fill();



      ctx.beginPath();

      ctx.moveTo(130,-40);
      ctx.lineTo(25,-25);
      ctx.lineTo(70,0);
      ctx.lineTo(140,-5);

      ctx.closePath();


      ctx.fill();




      // ===== NOSE BRIDGE =====


      line(
        [
          [0,-20],
          [25,50],
          [0,100],
          [-25,50],
          [0,-20]
        ],
        "#8b5cff",
        4
      );




      // ===== CHEEK ARMOR =====


      line(
        [
          [-150,20],
          [-80,70],
          [-100,150],
          [-150,110]
        ],
        "#00eaff",
        4
      );


      line(
        [
          [150,20],
          [80,70],
          [100,150],
          [150,110]
        ],
        "#00eaff",
        4
      );





      // ===== JAW =====


      line(
        [
          [-90,150],
          [-40,210],
          [0,230],
          [40,210],
          [90,150]
        ],
        "#9b5cff",
        5
      );





      // ===== PARTICLES =====


      particles.forEach(p=>{


        p.y +=0.25;


        if(p.y>220)
          p.y=-220;


        ctx.beginPath();

        ctx.arc(
          p.x,
          p.y,
          p.r,
          0,
          Math.PI*2
        );


        ctx.fillStyle=p.c;

        ctx.globalAlpha=0.7;

        ctx.fill();

      });


      ctx.globalAlpha=1;


      ctx.restore();



      frame=requestAnimationFrame(draw);

    };


    draw();



    return()=>{

      cancelAnimationFrame(frame);

      window.removeEventListener(
        "resize",
        resize
      );

    };


  },[]);



  return(

    <motion.div

      initial={{
        opacity:0,
        scale:.8
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
