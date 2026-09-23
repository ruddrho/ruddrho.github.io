import { useEffect, useRef } from "react";

export function AnimatedRobotMask() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(
        window.devicePixelRatio,
        window.devicePixelRatio
      );
    };

    resize();
    window.addEventListener("resize", resize);

    let t = 0;

    const particles = Array.from({ length: 900 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2 + 0.5,
      phase: Math.random() * Math.PI * 2,
    }));

    function draw() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0,0,w,h);

      particles.forEach(p => {

        const px =
          w * 0.5 +
          (p.x - 0.5) * 260 +
          Math.sin(t + p.phase) * 4;

        const py =
          h * 0.5 +
          (p.y - 0.5) * 380 +
          Math.cos(t + p.phase) * 4;


        // robotic mask shape
        const mask =
          Math.abs(p.x - 0.5) < 0.35 &&
          p.y > 0.15 &&
          p.y < 0.85;


        if(mask){

          ctx.beginPath();

          ctx.fillStyle =
            p.phase % 2
            ? "#00d9ff"
            : "#9b5cff";

          ctx.shadowBlur = 12;
          ctx.shadowColor = "#00d9ff";

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


      // glowing mask lines

      ctx.strokeStyle="#00eaff";
      ctx.lineWidth=2;

      ctx.shadowBlur=20;
      ctx.shadowColor="#00eaff";


      ctx.beginPath();

      ctx.moveTo(w*0.32,h*0.32);
      ctx.lineTo(w*0.68,h*0.32);
      ctx.lineTo(w*0.76,h*0.55);
      ctx.lineTo(w*0.5,h*0.78);
      ctx.lineTo(w*0.24,h*0.55);
      ctx.closePath();

      ctx.stroke();


      // eyes

      ctx.strokeStyle="#ffffff";
      ctx.lineWidth=5;

      ctx.beginPath();
      ctx.moveTo(w*.34,h*.48);
      ctx.lineTo(w*.46,h*.48);

      ctx.moveTo(w*.54,h*.48);
      ctx.lineTo(w*.66,h*.48);

      ctx.stroke();


      t +=0.02;

      requestAnimationFrame(draw);
    }

    draw();

    return()=>{
      window.removeEventListener("resize",resize);
    };

  },[]);


  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  );
}
