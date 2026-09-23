import { motion } from "framer-motion";

export function AnimatedRobotMask() {

  return (

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
      w-full
      h-full
      flex
      items-center
      justify-center
      "

    >

      <svg
        viewBox="0 0 600 600"
        className="
        w-full
        h-full
        "
        fill="none"
      >


        <defs>

          <filter id="glow">

            <feGaussianBlur
              stdDeviation="5"
              result="blur"
            />

            <feMerge>

              <feMergeNode in="blur"/>

              <feMergeNode in="SourceGraphic"/>

            </feMerge>

          </filter>

        </defs>



        {/* OUTER HUD RING */}

        <motion.circle

          cx="300"
          cy="300"
          r="250"

          stroke="#00eaff"
          strokeWidth="2"

          strokeDasharray="20 15"

          filter="url(#glow)"

          animate={{
            rotate:360
          }}

          transition={{
            duration:20,
            repeat:Infinity,
            ease:"linear"
          }}

          style={{
            transformOrigin:"300px 300px"
          }}

        />



        <motion.circle

          cx="300"
          cy="300"
          r="210"

          stroke="#8b5cff"
          strokeWidth="2"

          strokeDasharray="5 20"

          animate={{
            rotate:-360
          }}

          transition={{
            duration:15,
            repeat:Infinity,
            ease:"linear"
          }}

          style={{
            transformOrigin:"300px 300px"
          }}

        />





        {/* ROBOT BASE */}


        <ellipse

          cx="300"
          cy="500"

          rx="90"
          ry="25"

          stroke="#00eaff"
          strokeWidth="4"

          filter="url(#glow)"

        />


        <rect

          x="240"
          y="430"

          width="120"
          height="70"

          rx="15"

          stroke="#00eaff"

          strokeWidth="5"

        />





        {/* SHOULDER JOINT */}


        <motion.g

          animate={{
            rotate:[-18,18,-18]
          }}

          transition={{
            duration:4,
            repeat:Infinity,
            ease:"easeInOut"
          }}

          style={{
            transformOrigin:"300px 430px"
          }}

        >


          <circle

            cx="300"
            cy="420"
            r="35"

            stroke="#00eaff"

            strokeWidth="6"

          />



          {/* ARM 1 */}


          <line

            x1="300"
            y1="390"

            x2="170"
            y2="260"

            stroke="#00eaff"

            strokeWidth="12"

          />



          {/* ELBOW */}


          <motion.g

            animate={{
              rotate:[-25,25,-25]
            }}

            transition={{
              duration:3,
              repeat:Infinity
            }}

            style={{
              transformOrigin:"170px 260px"
            }}

          >


            <circle

              cx="170"
              cy="260"

              r="25"

              stroke="#9b5cff"

              strokeWidth="6"

            />



            {/* ARM 2 */}


            <line

              x1="170"
              y1="260"

              x2="360"
              y2="160"

              stroke="#00eaff"

              strokeWidth="12"

            />





            {/* WRIST */}


            <motion.g

              animate={{
                rotate:[-20,20,-20]
              }}

              transition={{
                duration:2.5,
                repeat:Infinity
              }}

              style={{
                transformOrigin:"360px 160px"
              }}

            >


              <circle

                cx="360"
                cy="160"

                r="22"

                stroke="#9b5cff"

                strokeWidth="5"

              />




              {/* END TOOL */}



              <line

                x1="360"
                y1="160"

                x2="450"
                y2="190"

                stroke="#00eaff"

                strokeWidth="10"

              />



              {/* GRIPPER */}



              <motion.g

                animate={{
                  rotate:[-15,15,-15]
                }}

                transition={{
                  duration:1.8,
                  repeat:Infinity
                }}

                style={{
                  transformOrigin:"450px 190px"
                }}

              >


                <line

                  x1="450"
                  y1="190"

                  x2="510"
                  y2="150"

                  stroke="#00eaff"

                  strokeWidth="7"

                />



                <line

                  x1="450"
                  y1="190"

                  x2="510"
                  y2="230"

                  stroke="#00eaff"

                  strokeWidth="7"

                />


              </motion.g>



            </motion.g>



          </motion.g>



        </motion.g>





        {/* SCAN PARTICLES */}


        {[...Array(12)].map((_,i)=>(

          <motion.circle

            key={i}

            cx="300"

            cy="300"

            r="4"

            fill="#00eaff"


            animate={{

              y:[
                -180,
                180
              ],

              opacity:[
                0,
                1,
                0
              ]

            }}

            transition={{

              duration:2+i*0.2,

              repeat:Infinity,

              delay:i*0.15

            }}

          />

        ))}


      </svg>


    </motion.div>

  );
}
