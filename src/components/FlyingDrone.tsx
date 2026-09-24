import {
  motion,
  useMotionValue,
  useSpring
} from "framer-motion";

import { useEffect } from "react";


export function FlyingDrone() {

  /*
   * ONLY MOVEMENT SYSTEM ADDED
   * Drone model below is unchanged.
   */

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);


  // Smooth drone-like delayed movement
  const smoothX = useSpring(targetX, {
    stiffness: 45,
    damping: 18,
    mass: 0.8
  });

  const smoothY = useSpring(targetY, {
    stiffness: 45,
    damping: 18,
    mass: 0.8
  });


  useEffect(() => {

    const droneHalfSize = 60;


    // Start approximately in the center
    targetX.set(
      window.innerWidth / 2 - droneHalfSize
    );

    targetY.set(
      window.innerHeight / 2 - droneHalfSize
    );


    const handleMouseMove = (
      event: MouseEvent
    ) => {

      /*
       * Cursor becomes the drone's target.
       * -60 centers the 120x120 drone
       * around the cursor.
       */

      targetX.set(
        event.clientX - droneHalfSize
      );

      targetY.set(
        event.clientY - droneHalfSize
      );

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

  }, [targetX, targetY]);



  return (

    /*
     * CURSOR FOLLOWER
     */

    <motion.div

      className="
      absolute
      left-0
      top-0
      z-20
      pointer-events-none
      w-[120px]
      h-[120px]
      "

      style={{
        x: smoothX,
        y: smoothY
      }}

    >


      {/*
       * SMALL ORBIT AROUND CURSOR
       *
       * This does NOT modify the drone.
       * It only gives it a natural flying
       * movement around the cursor.
       */}

      <motion.div

        className="
        w-full
        h-full
        "

        animate={{

          x: [
            0,
            16,
            24,
            10,
            -14,
            -22,
            -8,
            0
          ],

          y: [
            -18,
            -10,
            8,
            20,
            16,
            2,
            -14,
            -18
          ],

          rotate: [
            0,
            1.5,
            0,
            -1.5,
            0
          ]

        }}

        transition={{

          x: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          },

          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          },

          rotate: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }

        }}

      >


        {/*
         * =================================================
         * EXACT SAME DRONE MODEL
         * NOTHING BELOW HAS BEEN REDESIGNED
         * =================================================
         */}


        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          fill="none"
        >


          <defs>

            <filter id="droneGlow">

              <feGaussianBlur
                stdDeviation="3"
                result="blur"
              />

              <feMerge>

                <feMergeNode in="blur"/>

                <feMergeNode in="SourceGraphic"/>

              </feMerge>

            </filter>


          </defs>



          {/* Drone body */}

          <motion.g
            filter="url(#droneGlow)"
            animate={{
              y:[0,-5,0]
            }}

            transition={{
              duration:2,
              repeat:Infinity
            }}

          >


            {/* center body */}

            <rect

              x="70"
              y="80"

              width="60"

              height="35"

              rx="12"

              stroke="#22d3ee"

              strokeWidth="3"

            />



            {/* left arm */}

            <line

              x1="75"
              y1="90"

              x2="35"
              y2="60"

              stroke="#22d3ee"

              strokeWidth="3"

            />


            {/* right arm */}

            <line

              x1="125"
              y1="90"

              x2="165"
              y2="60"

              stroke="#22d3ee"

              strokeWidth="3"

            />



            {/* back arms */}

            <line

              x1="75"
              y1="110"

              x2="40"
              y2="140"

              stroke="#22d3ee"

              strokeWidth="3"

            />


            <line

              x1="125"
              y1="110"

              x2="160"
              y2="140"

              stroke="#22d3ee"

              strokeWidth="3"

            />




            {/* Propellers */}

            {[

              [35,60],

              [165,60],

              [40,140],

              [160,140]

            ].map((p,i)=>(


              <motion.g

                key={i}

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
                  `${p[0]}px ${p[1]}px`

                }}

              >

                <circle

                  cx={p[0]}

                  cy={p[1]}

                  r="14"

                  stroke="#a855f7"

                  strokeWidth="2"

                />


                <line

                  x1={p[0]-10}

                  y1={p[1]}

                  x2={p[0]+10}

                  y2={p[1]}

                  stroke="#22d3ee"

                  strokeWidth="2"

                />


              </motion.g>


            ))}



            {/* Camera */}

            <circle

              cx="100"

              cy="115"

              r="7"

              fill="#22d3ee"

            />



          </motion.g>



          {/* scan beam */}

          <motion.line

            x1="100"

            y1="120"

            x2="100"

            y2="170"

            stroke="#22d3ee"

            strokeWidth="2"

            opacity="0.5"

            animate={{

              opacity:[
                0.2,
                0.8,
                0.2
              ]

            }}

            transition={{

              duration:2,

              repeat:Infinity

            }}

          />


        </svg>


      </motion.div>


    </motion.div>

  );

}
