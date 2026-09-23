import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function FlyingDrone() {

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);


  const x = useSpring(mouseX, {
    stiffness: 35,
    damping: 18
  });


  const y = useSpring(mouseY, {
    stiffness: 35,
    damping: 18
  });



  useEffect(() => {

    const handleMouseMove = (e: MouseEvent) => {

      const moveX =
        (e.clientX - window.innerWidth / 2) * 0.12;


      const moveY =
        (e.clientY - window.innerHeight / 2) * 0.12;


      mouseX.set(moveX);
      mouseY.set(moveY);

    };


    window.addEventListener(
      "mousemove",
      handleMouseMove
    );


    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };


  }, [mouseX, mouseY]);




  return (

    <motion.div

      style={{
        x,
        y
      }}

      className="
      absolute
      w-[90px]
      h-[90px]
      "

    >


      <motion.svg

        viewBox="0 0 200 200"

        className="
        w-full
        h-full
        drop-shadow-[0_0_20px_rgba(34,211,238,.8)]
        "


        animate={{
          y:[0,-8,0]
        }}


        transition={{
          duration:3,
          repeat:Infinity,
          ease:"easeInOut"
        }}

      >



        <defs>

          <linearGradient 
          id="drone"
          x1="0"
          y1="0"
          x2="1"
          y2="1">

            <stop stopColor="#22d3ee"/>

            <stop 
            offset="1"
            stopColor="#a855f7"/>

          </linearGradient>


        </defs>





        {/* body */}

        <circle

          cx="100"
          cy="100"
          r="35"

          fill="#07101f"

          stroke="url(#drone)"

          strokeWidth="5"

        />





        {/* arms */}

        <g

          stroke="url(#drone)"

          strokeWidth="5"

          fill="none"

        >

          <path d="M70 85 L30 60"/>

          <path d="M130 85 L170 60"/>

          <path d="M70 115 L30 140"/>

          <path d="M130 115 L170 140"/>


        </g>






        {/* propellers */}

        <motion.g

          animate={{
            rotate:360
          }}

          transition={{

            duration:1,

            repeat:Infinity,

            ease:"linear"

          }}


          style={{

            transformOrigin:
            "100px 100px"

          }}

        >



          <ellipse

            cx="30"
            cy="60"

            rx="22"
            ry="5"

            stroke="#22d3ee"

            fill="none"

          />



          <ellipse

            cx="170"
            cy="60"

            rx="22"
            ry="5"

            stroke="#22d3ee"

            fill="none"

          />



          <ellipse

            cx="30"
            cy="140"

            rx="22"
            ry="5"

            stroke="#22d3ee"

            fill="none"

          />



          <ellipse

            cx="170"
            cy="140"

            rx="22"
            ry="5"

            stroke="#22d3ee"

            fill="none"

          />



        </motion.g>






        {/* AI light */}

        <circle

          cx="100"

          cy="100"

          r="10"

          fill="#22d3ee"

        />



      </motion.svg>


    </motion.div>


  );

}
