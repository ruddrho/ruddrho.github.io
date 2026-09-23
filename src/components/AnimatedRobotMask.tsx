import { motion } from "framer-motion";

export function AnimatedRobotMask() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2 }}
      className="relative w-full h-full flex items-center justify-center"
    >

      <svg
        viewBox="0 0 500 500"
        className="w-full h-full"
        fill="none"
      >

        <defs>
          <filter id="robotGlow">
            <feGaussianBlur
              stdDeviation="4"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>


        {/* Base rotating hologram ring */}

        <motion.ellipse
          cx="250"
          cy="420"
          rx="150"
          ry="35"
          stroke="#00eaff"
          strokeWidth="3"
          filter="url(#robotGlow)"
          animate={{
            rotate:360
          }}
          transition={{
            duration:15,
            repeat:Infinity,
            ease:"linear"
          }}
          style={{
            transformOrigin:"250px 420px"
          }}
        />


        {/* Robot base */}

        <rect
          x="205"
          y="350"
          width="90"
          height="70"
          rx="10"
          stroke="#00eaff"
          strokeWidth="3"
          filter="url(#robotGlow)"
        />


        {/* Shoulder */}

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
            transformOrigin:"250px 350px"
          }}
        >

          <circle
            cx="250"
            cy="350"
            r="35"
            stroke="#00eaff"
            strokeWidth="4"
          />


          {/* First link */}

          <line
            x1="250"
            y1="320"
            x2="150"
            y2="220"
            stroke="#00eaff"
            strokeWidth="5"
          />


          {/* Elbow */}

          <circle
            cx="150"
            cy="220"
            r="18"
            stroke="#9b5cff"
            strokeWidth="3"
          />


          {/* second link */}

          <motion.g
            animate={{
              rotate:[-25,25,-25]
            }}
            transition={{
              duration:3,
              repeat:Infinity
            }}
            style={{
              transformOrigin:"150px 220px"
            }}
          >

            <line
              x1="150"
              y1="220"
              x2="300"
              y2="150"
              stroke="#00eaff"
              strokeWidth="5"
            />


            {/* wrist */}

            <circle
              cx="300"
              cy="150"
              r="16"
              stroke="#9b5cff"
              strokeWidth="3"
            />


            {/* end effector */}

            <motion.g
              animate={{
                rotate:[-30,30,-30]
              }}
              transition={{
                duration:2,
                repeat:Infinity
              }}
              style={{
                transformOrigin:"300px 150px"
              }}
            >

              <line
                x1="300"
                y1="150"
                x2="390"
                y2="180"
                stroke="#00eaff"
                strokeWidth="5"
              />


              {/* gripper */}

              <line
                x1="390"
                y1="180"
                x2="430"
                y2="160"
                stroke="#00eaff"
                strokeWidth="4"
              />

              <line
                x1="390"
                y1="180"
                x2="430"
                y2="200"
                stroke="#00eaff"
                strokeWidth="4"
              />

            </motion.g>


          </motion.g>

        </motion.g>


        {/* AI scan particles */}

        {[1,2,3,4,5].map((i)=>(
          <motion.circle
            key={i}
            cx="250"
            cy="250"
            r="3"
            fill="#00eaff"
            animate={{
              y:[-80,80],
              opacity:[0,1,0]
            }}
            transition={{
              duration:2+i*0.3,
              repeat:Infinity
            }}
          />
        ))}


      </svg>

    </motion.div>
  );
}
