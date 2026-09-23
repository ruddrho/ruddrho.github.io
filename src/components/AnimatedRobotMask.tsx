import { useEffect, useRef } from "react";

export function AnimatedRobotMask() {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  useEffect(() => {

    const canvas = canvasRef.current;

    if (!canvas) return;


    const context = canvas.getContext("2d");

    if (!context) return;


    const ctx = context;


    let animationFrame = 0;
    let time = 0;


    const resize = () => {

      const ratio = window.devicePixelRatio || 1;

      canvas.width =
        canvas.clientWidth * ratio;

      canvas.height =
        canvas.clientHeight * ratio;


      ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
      );

    };


    resize();

    window.addEventListener(
      "resize",
      resize
    );


    // hologram particles

    const particles = Array.from(
      {length: 900},
      () => ({

        x: Math.random(),
        y: Math.random(),
        size:
          Math.random()*2+0.5,

        offset:
          Math.random()*Math.PI*2

      })
    );



    const draw = () => {


      const w = canvas.clientWidth;
      const h = canvas.clientHeight;



      ctx.clearRect(
        0,
        0,
        w,
        h
      );



      // PARTICLE AI FACE

      particles.forEach((p)=>{


        const px =
          w/2 +
          (p.x-0.5)*330;


        const py =
          h/2 +
          (p.y-0.5)*430;



        const faceMask =

          p.y > 0.10 &&
          p.y < 0.90 &&
          Math.abs(p.x-0.5)
          <
          0.40;



        if(faceMask){


          ctx.beginPath();


          const pulse =
            Math.sin(
              time+p.offset
            );


          ctx.fillStyle =
            pulse>0
            ?
            "#00eaff"
            :
            "#7b5cff";



          ctx.shadowBlur = 18;

          ctx.shadowColor =
            "#00eaff";



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



      ctx.shadowBlur = 30;



      // ======================
      // ROBOT HELMET OUTLINE
      // ======================


      ctx.strokeStyle =
        "#00eaff";

      ctx.lineWidth = 3;


      ctx.beginPath();


      ctx.moveTo(
        w*0.35,
        h*0.18
      );


      ctx.lineTo(
        w*0.65,
        h*0.18
      );


      ctx.lineTo(
        w*0.78,
        h*0.38
      );


      ctx.lineTo(
        w*0.70,
        h*0.72
      );


      ctx.lineTo(
        w*0.58,
        h*0.88
      );


      ctx.lineTo(
        w*0.42,
        h*0.88
      );


      ctx.lineTo(
        w*0.30,
        h*0.72
      );


      ctx.lineTo(
        w*0.22,
        h*0.38
      );


      ctx.closePath();


      ctx.stroke();




      // ======================
      // FOREHEAD ARMOR V
      // ======================


      ctx.strokeStyle =
        "#9b5cff";

      ctx.lineWidth = 4;


      ctx.beginPath();


      ctx.moveTo(
        w*0.34,
        h*0.30
      );


      ctx.lineTo(
        w*0.50,
        h*0.43
      );


      ctx.lineTo(
        w*0.66,
        h*0.30
      );


      ctx.stroke();




      // ======================
      // GLOWING EYES
      // ======================


      ctx.strokeStyle =
        "#ffffff";


      ctx.lineWidth = 8;


      ctx.shadowBlur = 40;


      ctx.shadowColor =
        "#00ffff";



      ctx.beginPath();


      // left eye

      ctx.moveTo(
        w*0.30,
        h*0.48
      );


      ctx.lineTo(
        w*0.45,
        h*0.45
      );


      ctx.lineTo(
        w*0.48,
        h*0.52
      );


      ctx.lineTo(
        w*0.32,
        h*0.55
      );


      ctx.closePath();



      // right eye


      ctx.moveTo(
        w*0.70,
        h*0.48
      );


      ctx.lineTo(
        w*0.55,
        h*0.45
      );


      ctx.lineTo(
        w*0.52,
        h*0.52
      );


      ctx.lineTo(
        w*0.68,
        h*0.55
      );


      ctx.closePath();



      ctx.stroke();




      // ======================
      // NOSE CORE
      // ======================


      ctx.strokeStyle =
        "#00ffff";

      ctx.lineWidth = 3;


      ctx.beginPath();


      ctx.moveTo(
        w*0.50,
        h*0.50
      );


      ctx.lineTo(
        w*0.50,
        h*0.68
      );


      ctx.lineTo(
        w*0.43,
        h*0.73
      );


      ctx.moveTo(
        w*0.50,
        h*0.68
      );


      ctx.lineTo(
        w*0.57,
        h*0.73
      );


      ctx.stroke();




      // ======================
      // CHEEK ARMOR
      // ======================


      ctx.strokeStyle =
        "#7b5cff";


      ctx.lineWidth = 3;


      ctx.beginPath();


      ctx.moveTo(
        w*0.30,
        h*0.58
      );


      ctx.lineTo(
        w*0.40,
        h*0.75
      );


      ctx.moveTo(
        w*0.70,
        h*0.58
      );


      ctx.lineTo(
        w*0.60,
        h*0.75
      );


      ctx.stroke();




      // ======================
      // CHIN MECHANICAL CORE
      // ======================


      ctx.strokeStyle =
        "#00eaff";


      for(
        let i=0;
        i<5;
        i++
      ){

        ctx.beginPath();


        ctx.moveTo(
          w*(0.42+i*0.04),
          h*0.78
        );


        ctx.lineTo(
          w*(0.42+i*0.04),
          h*0.87
        );


        ctx.stroke();

      }




      time +=0.04;


      animationFrame =
        requestAnimationFrame(draw);


    };



    draw();



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



  return (

    <canvas

      ref={canvasRef}

      className="
      w-full
      h-full
      "

    />

  );

}
