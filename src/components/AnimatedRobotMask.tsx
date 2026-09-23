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


    let animationFrame:number;



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
      {length:900},
      ()=>({

        x:(Math.random()-0.5)*280,

        y:(Math.random()-0.5)*420,

        size:
          Math.random()*2+0.5,

        speed:
          Math.random()*0.6+0.2,

        color:
          Math.random()>0.5
          ? "#00eaff"
          : "#9b5cff"

      })
    );




    const drawLine = (
      points:number[][],
      color:string,
      width:number
    )=>{


      ctx.beginPath();


      points.forEach(
        (p,index)=>{

          if(index===0)
            ctx.moveTo(
              p[0],
              p[1]
            );
          else
            ctx.lineTo(
              p[0],
              p[1]
            );

        }
      );


      ctx.strokeStyle=color;

      ctx.lineWidth=width;

      ctx.shadowBlur=20;

      ctx.shadowColor=color;

      ctx.stroke();

    };






    const animate = ()=>{


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


      const scale =
        Math.min(w,h)/600;


      ctx.scale(
        scale,
        scale
      );





      // OUTER ROBOT MASK

      drawLine(
        [
          [0,-230],
          [85,-180],
          [160,-150],
          [185,-40],
          [150,140],
          [70,220],
          [0,250],
          [-70,220],
          [-150,140],
          [-185,-40],
          [-160,-150],
          [-85,-180],
          [0,-230]
        ],
        "#00eaff",
        4
      );






      // FOREHEAD ARMOR V

      drawLine(
        [
          [-120,-130],
          [0,-40],
          [120,-130],
          [55,-160],
          [0,-100],
          [-55,-160],
          [-120,-130]
        ],
        "#5b8cff",
        5
      );







      // LEFT EYE

      ctx.beginPath();

      ctx.moveTo(-130,-35);

      ctx.lineTo(-25,-25);

      ctx.lineTo(-70,10);

      ctx.lineTo(-140,0);

      ctx.closePath();



      ctx.fillStyle="#00f5ff";

      ctx.shadowBlur=40;

      ctx.shadowColor="#00f5ff";

      ctx.fill();






      // RIGHT EYE

      ctx.beginPath();

      ctx.moveTo(130,-35);

      ctx.lineTo(25,-25);

      ctx.lineTo(70,10);

      ctx.lineTo(140,0);

      ctx.closePath();


      ctx.fill();







      // NOSE ARMOR


      drawLine(
        [
          [0,-20],
          [35,60],
          [0,125],
          [-35,60],
          [0,-20]
        ],
        "#9b5cff",
        5
      );







      // CHEEK PLATES


      drawLine(
        [
          [-150,20],
          [-80,70],
          [-100,150],
          [-150,110]
        ],
        "#00eaff",
        4
      );



      drawLine(
        [
          [150,20],
          [80,70],
          [100,150],
          [150,110]
        ],
        "#00eaff",
        4
      );







      // JAW


      drawLine(
        [
          [-90,150],
          [-45,210],
          [0,235],
          [45,210],
          [90,150]
        ],
        "#9b5cff",
        5
      );






      // PARTICLE AI CORE


      particles.forEach(p=>{


        p.y += p.speed;


        if(p.y>230)
          p.y=-230;



        ctx.beginPath();


        ctx.arc(
          p.x,
          p.y,
          p.size,
          0,
          Math.PI*2
        );


        ctx.fillStyle=p.color;

        ctx.globalAlpha=0.75;


        ctx.fill();


      });



      ctx.globalAlpha=1;


      ctx.restore();



      animationFrame =
        requestAnimationFrame(
          animate
        );


    };



    animate();




    return()=>{

      cancelAnimationFrame(
        animationFrame
      );


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
        scale:0.85
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
