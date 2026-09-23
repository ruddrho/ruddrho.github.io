import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function FlyingDrone() {

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);


  const x = useSpring(mouseX, {
    stiffness: 40,
    damping: 15
  });

  const y = useSpring(mouseY, {
    stiffness: 40,
    damping: 15
  });



  useEffect(()=>{

    const move = (e:MouseEvent)=>{

      const xPos =
        (e.clientX - window.innerWidth/2) * 0.15;

      const yPos =
        (e.clientY - window.innerHeight/2) * 0.15;


      mouseX.set(xPos);
      mouseY.set(yPos);

    };


    window.addEventListener(
      "mousemove",
      move
    );


    return()=>{
      window.removeEventListener(
        "mousemove",
        move
      );
    };


  },[mouseX,mouseY]);



  return (

    <motion.div

      style={{
        x,
        y
      }}

      className="
      absolute
      top-[20%]
      left-[45%]
      w-[90px]
      h-[90px]
      "
    >


      <motion.svg

        viewBox="0 0 200 200"

        className="
        w-full
        h-full
        drop-shadow-[0_0_25px_rgba(34,211,238,.8)]
        "

        animate={{
          y:[0,-10,0]
        }}

        transition={{
          duration:3,
          repeat:Infinity,
          ease:"easeInOut"
        }}

      >


        <defs>

          <linearGradient
            id="droneGlow"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >

            <stop stopColor="#22d3ee"/>

            <stop
              offset="1"
              stopColor="#a855f7"
            />

          </linearGradient>

        </defs>



        {/* drone body */}

        <circle

          cx="100"
          cy="100"
          r="32"

          fill="#07101f"

          stroke="url(#droneGlow)"

          strokeWidth="5"

        />



        {/* arms */}

        <g

          stroke="url(#droneGlow)"

          strokeWidth="5"

          fill="none"

        >

          <path d="M75 85 L35 55"/>

          <path d="M125 85 L165 55"/>

          <path d="M75 115 L35 145"/>

          <path d="M125 115 L165 145"/>


        </g>




        {/* rotating propellers */}

        <motion.g

          animate={{
            rotate:360
          }}

          transition={{
            duration:0.8,
            repeat:Infinity,
            ease:"linear"
          }}

          style={{
            transformOrigin:"100px 100px"
          }}

        >


          <ellipse

            cx="35"
            cy="55"

            rx="22"
            ry="5"

            stroke="#22d3ee"

            fill="none"

          />


          <ellipse

            cx="165"
            cy="55"

            rx="22"
            ry="5"

            stroke="#22d3ee"

            fill="none"

          />



          <ellipse

            cx="35"
            cy="145"

            rx="22"
            ry="5"

            stroke="#22d3ee"

            fill="none"

          />



          <ellipse

            cx="165"
            cy="145"

            rx="22"
            ry="5"

            stroke="#22d3ee"

            fill="none"

          />


        </motion.g>




        {/* AI sensor */}

        <circle

          cx="100"
          cy="100"

          r="9"

          fill="#22d3ee"

        />


      </motion.svg>


    </motion.div>

  );
}
