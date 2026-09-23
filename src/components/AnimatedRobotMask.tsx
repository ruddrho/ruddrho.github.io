import { motion } from 'framer-motion'

export function RobotScene() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[680px] select-none">

      {/* HUD BACKGROUND */}

      <div className="
        absolute inset-[5%]
        rounded-full
        border border-cyan-300/10
        bg-cyan-300/[.015]
        shadow-[inset_0_0_100px_rgba(34,211,238,.06)]
      " />


      <motion.div
        className="
        absolute inset-[12%]
        rounded-full
        border border-dashed border-cyan-300/20
        "
        animate={{
          rotate:360
        }}
        transition={{
          duration:35,
          repeat:Infinity,
          ease:"linear"
        }}
      />


      <motion.div
        className="
        absolute inset-[22%]
        rounded-full
        border border-dashed border-purple-400/20
        "
        animate={{
          rotate:-360
        }}
        transition={{
          duration:22,
          repeat:Infinity,
          ease:"linear"
        }}
      />



      <svg
        viewBox="0 0 600 600"
        className="
        absolute inset-0
        h-full w-full
        drop-shadow-[0_0_30px_rgba(34,211,238,.25)]
        "
      >

        <defs>

          <linearGradient
            id="arm"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >

            <stop stopColor="#67e8f9"/>

            <stop
              offset="1"
              stopColor="#a855f7"
            />

          </linearGradient>


        </defs>



        <g
          fill="none"
          stroke="url(#arm)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >


          <motion.g

            animate={{
              rotate:[
                0,
                2,
                -1,
                0
              ]
            }}

            transition={{
              duration:8,
              repeat:Infinity,
              ease:"easeInOut"
            }}

            style={{
              transformOrigin:
              "300px 480px"
            }}

          >


            <path
              d="M210 500h180l-22-50H232z"
              opacity=".85"
            />


            <circle
              cx="300"
              cy="430"
              r="46"
            />


            <motion.path

              d="M300 384l55-120"

              animate={{
                rotate:[
                  0,
                  3,
                  -2,
                  0
                ]
              }}

              transition={{
                duration:5,
                repeat:Infinity
              }}

              style={{
                transformOrigin:
                "300px 384px"
              }}

            />


            <circle
              cx="360"
              cy="250"
              r="36"
            />



            <motion.path
              d="M389 229l83-64"

              animate={{
                rotate:[
                  0,
                  4,
                  -3,
                  0
                ]
              }}

              transition={{
                duration:4,
                repeat:Infinity
              }}

              style={{
                transformOrigin:
                "389px 229px"
              }}

            />


            <circle
              cx="486"
              cy="153"
              r="25"
            />



            {/* GRIPPER */}

            <motion.g

              animate={{
                rotate:[
                  -5,
                  5,
                  -5
                ]
              }}

              transition={{
                duration:2.5,
                repeat:Infinity
              }}

              style={{
                transformOrigin:
                "486px 153px"
              }}

            >

              <path
                d="
                M500 133l28-38m-20 50l46-5m-58 24l28 34
                "
              />

            </motion.g>



            <path
              d="
              M279 394l52-115
              M329 396l59-116
              M389 223l75-78
              M404 245l78-66
              "
              opacity=".35"
            />


          </motion.g>


        </g>




        {/* JOINT LIGHT */}

        <g fill="#67e8f9">

          <circle
            cx="300"
            cy="430"
            r="7"
          />

          <circle
            cx="360"
            cy="250"
            r="6"
          />

          <circle
            cx="486"
            cy="153"
            r="5"
          />

        </g>




        {/* DATA */}

        <g
          fontFamily="monospace"
          fontSize="12"
          fill="#94a3b8"
        >

          <text x="70" y="160">
            JOINT_03 // 42.8°
          </text>


          <text x="390" y="380">
            CTRL: CLOSED_LOOP
          </text>


          <text x="80" y="440">
            STATE: NOMINAL
          </text>


        </g>




        {/* SCAN POINT */}

        <motion.div
          animate={{
            scale:[
              1,
              1.2,
              1
            ]
          }}
          transition={{
            duration:3,
            repeat:Infinity
          }}
        />



      </svg>



      <motion.div

        animate={{
          scale:[
            1,
            1.15,
            1
          ],

          opacity:[
            .35,
            .9,
            .35
          ]
        }}

        transition={{
          duration:3,
          repeat:Infinity
        }}

        className="
        absolute
        right-[4%]
        top-[44%]
        h-2
        w-2
        rounded-full
        bg-cyan-300
        shadow-[0_0_25px_#22d3ee]
        "

      />



      <div
        className="
        absolute
        bottom-[5%]
        left-1/2
        -translate-x-1/2
        rounded-full
        border border-white/10
        bg-[#07101f]/80
        px-5
        py-2
        font-mono
        text-[11px]
        uppercase
        tracking-[.24em]
        text-cyan-200
        backdrop-blur
        "
      >

        Robotic Manipulator // Live Model

      </div>


    </div>
  )
}
