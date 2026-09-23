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


    let frame:number;


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
      {length:500},
      ()=>({

        x:(Math.random()-0.5)*220,
        y:(Math.random()-0.5)*320,

        size:
          Math.random()*1.8+0.3,

        speed:
          Math.random()*0.4+0.15,

        color:
          Math.random()>0.5
          ? "#00eaff"
          :"#8b5cff"

      })
    );



    const stroke = (
      pts:number[][],
      color:string,
      width:number
    )=>{

      ctx.beginPath();

      pts.forEach((p,i)=>{

        if(i===0)
          ctx.moveTo(
            p[0],
            p[1]
          );
        else
          ctx.lineTo(
            p[0],
            p[1]
          );

      });


      ctx.strokeStyle=color;
      ctx.lineWidth=width;

      ctx.shadowBlur=25;
      ctx.shadowColor=color;

      ctx.stroke();

    };





    const draw = ()=>{


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




      // DARK INNER HELMET

      ctx.beginPath();

      ctx.moveTo(0,-230);

      ctx.lineTo(110,-170);

      ctx.lineTo(170,-50);

      ctx.lineTo(120,170);

      ctx.lineTo(0,230);

      ctx.lineTo(-120,170);

      ctx.lineTo(-170,-50);

      ctx.lineTo(-110,-170);

      ctx.closePath();


      ctx.fillStyle =
        "rgba(5,15,30,0.75)";


      ctx.fill();




      // OUTER ARMOR

      stroke(
        [
          [0,-240],
          [120,-180],
          [175,-50],
          [130,170],
          [0,240],
          [-130,170],
          [-175,-50],
          [-120,-180],
          [0,-240]
        ],
        "#00eaff",
        4
      );






      // FOREHEAD 3 LAYER ARMOR


      stroke(
        [
          [-130,-140],
          [0,-45],
          [130,-140]
        ],
        "#3da5ff",
        5
      );


      stroke(
        [
          [-80,-165],
          [0,-95],
          [80,-165]
        ],
        "#8b5cff",
        3
      );






      // LEFT EYE

      ctx.beginPath();

      ctx.moveTo(-125,-35);
      ctx.lineTo(-35,-25);
      ctx.lineTo(-80,5);
      ctx.lineTo(-145,-5);

      ctx.closePath();


      ctx.fillStyle="#00f5ff";

      ctx.shadowBlur=35;
      ctx.shadowColor="#00eaff";

      ctx.fill();




      // RIGHT EYE


      ctx.beginPath();

      ctx.moveTo(125,-35);
      ctx.lineTo(35,-25);
      ctx.lineTo(80,5);
      ctx.lineTo(145,-5);

      ctx.closePath();


      ctx.fill();






      // NOSE CORE


      stroke(
        [
          [0,-30],
          [28,55],
          [0,120],
          [-28,55],
          [0,-30]
        ],
        "#9b5cff",
        4
      );






      // CHEEK MECHANICAL PLATES


      stroke(
        [
          [-145,15],
          [-75,65],
          [-110,145],
          [-155,95]
        ],
        "#00eaff",
        4
      );


      stroke(
        [
          [145,15],
          [75,65],
          [110,145],
          [155,95]
        ],
        "#00eaff",
        4
      );






      // JAW ARMOR


      stroke(
        [
          [-95,150],
          [-45,210],
          [0,235],
          [45,210],
          [95,150]
        ],
        "#8b5cff",
        5
      );






      // PARTICLE SCAN INSIDE MASK


      particles.forEach(p=>{


        p.y += p.speed;


        if(p.y>170)
          p.y=-170;



        ctx.beginPath();


        ctx.arc(
          p.x,
          p.y,
          p.size,
          0,
          Math.PI*2
        );


        ctx.fillStyle=p.color;

        ctx.globalAlpha=0.6;

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
