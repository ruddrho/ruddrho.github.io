import { motion } from "framer-motion";

export function AnimatedRobotMask() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full flex items-center justify-center"
    >

      <svg
        viewBox="0 0 600 600"
        className="w-full h-full drop-shadow-[0_0_25px_rgba(34,211,238,.25)]"
        fill="none"
      >

        <defs>
          <linearGradient id="robotArm" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#22d3ee" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>


        {/* rotating HUD */}

        <motion.circle
          cx="300"
          cy="300"
          r="250"
          stroke="#22d3ee"
          strokeWidth="2"
          strokeDasharray="12 18"
          animate={{ rotate: 360 }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            transformOrigin:"300px 300px"
          }}
        />


        <motion.circle
          cx="300"
          cy="300"
          r="210"
          stroke="#a855f7"
          strokeWidth="2"
          strokeDasharray="5 20"
          animate={{ rotate:-360 }}
          transition={{
            duration:18,
            repeat:Infinity,
            ease:"linear"
          }}
          style={{
            transformOrigin:"300px 300px"
          }}
        />



        {/* Robot arm */}

        <motion.g
          stroke="url(#robotArm)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        >


          {/* base */}

          <path d="M180 500 H420 L390 450 H210 Z" />

          <circle
            cx="300"
            cy="420"
            r="45"
          />



          {/* shoulder movement */}

          <motion.g

            animate={{
              rotate:[0,4,-3,0]
            }}

            transition={{
              duration:6,
              repeat:Infinity,
              ease:"easeInOut"
            }}

            style={{
              transformOrigin:"300px 420px"
            }}

          >

            <path d="M300 380 L360 250" />


            <circle
              cx="360"
              cy="250"
              r="32"
            />



            {/* elbow */}

            <motion.g

              animate={{
                rotate:[0,-6,5,0]
              }}

              transition={{
                duration:4,
                repeat:Infinity
              }}

              style={{
                transformOrigin:"360px 250px"
              }}

            >

              <path d="M385 230 L480 150" />

              <circle
                cx="480"
                cy="150"
                r="25"
              />


              {/* wrist + gripper */}

              <motion.g

                animate={{
                  rotate:[-8,8,-8]
                }}

                transition={{
                  duration:2,
                  repeat:Infinity
                }}

                style={{
                  transformOrigin:"480px 150px"
                }}

              >

                <path d="M500 130 L540 95" />

                <path d="M505 150 L555 150" />

                <path d="M500 170 L540 205" />


              </motion.g>


            </motion.g>


          </motion.g>


        </motion.g>



        {/* joint lights */}

        <g fill="#22d3ee">

          <circle cx="300" cy="420" r="7"/>
          <circle cx="360" cy="250" r="6"/>
          <circle cx="480" cy="150" r="5"/>

        </g>



        {/* scanning particles */}

        {[...Array(15)].map((_,i)=>(

          <motion.circle
            key={i}
            cx={250 + Math.random()*100}
            cy="300"
            r="2"
            fill="#22d3ee"
            animate={{
              cy:[180,420,180],
              opacity:[0,1,0]
            }}
            transition={{
              duration:2+i*0.2,
              repeat:Infinity
            }}
          />

        ))}



      </svg>


      <div
        className="
        absolute
        bottom-8
        rounded-full
        border
        border-cyan-300/20
        bg-[#07101f]/80
        px-5
        py-2
        text-[10px]
        font-mono
        tracking-[.25em]
        text-cyan-200
        "
      >
        ROBOTIC MANIPULATOR // LIVE MODEL
      </div>


    </motion.div>
  );
}
