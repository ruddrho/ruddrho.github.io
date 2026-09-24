import {
  motion,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";

import { useEffect, useState } from "react";

const NODE_COUNT = 7;
const TRACK_HEIGHT = 330;

export function ScrollProgress() {

  const { scrollYProgress } = useScroll();

  const [progress, setProgress] = useState(0);

  /*
   * Smooth page-scroll tracking
   */
  const smoothProgress = useSpring(
    scrollYProgress,
    {
      stiffness: 85,
      damping: 24,
      mass: 0.55
    }
  );

  /*
   * Active orb position
   */
  const orbY = useTransform(
    smoothProgress,
    [0, 1],
    [0, TRACK_HEIGHT]
  );

  /*
   * Solid purple progress line
   */
  const progressScale = useTransform(
    smoothProgress,
    [0, 1],
    [0, 1]
  );

  useEffect(() => {

    const unsubscribe = smoothProgress.on(
      "change",
      (latest) => {
        setProgress(latest);
      }
    );

    return unsubscribe;

  }, [smoothProgress]);

  /*
   * Nodes already passed by scroll
   */
  const passedNode = Math.floor(
    progress * (NODE_COUNT - 1)
  );

  return (

    /*
     * FIXED CENTER POSITION
     */
    <div
      className="
        fixed
        right-5
        top-1/2
        -translate-y-1/2
        z-[999]
        hidden
        md:block
        pointer-events-none
      "
    >

      {/*
       * Entrance animation
       */}
      <motion.div

        initial={{
          opacity: 0,
          x: 18
        }}

        animate={{
          opacity: 1,
          x: 0
        }}

        transition={{
          duration: 0.8,
          delay: 0.35,
          ease: "easeOut"
        }}

        className="
          relative
          rounded-full
          border
          border-violet-300/[0.12]
          bg-[#060912]/65
          px-[15px]
          py-[18px]
          backdrop-blur-md
          shadow-[0_0_30px_rgba(0,0,0,0.35)]
        "
      >

        <div
          className="relative w-[34px]"
          style={{
            height: `${TRACK_HEIGHT}px`
          }}
        >

          {/*
           * =====================================
           * DOTTED / DASHED BACK TRACK
           * =====================================
           */}

          <div
            className="
              absolute
              left-1/2
              top-0
              h-full
              w-[2px]
              -translate-x-1/2
              opacity-60
            "
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(148,163,184,0.30) 0px, rgba(148,163,184,0.30) 7px, transparent 7px, transparent 14px)"
            }}
          />


          {/*
           * =====================================
           * ACTIVE SOLID PURPLE LINE
           * =====================================
           */}

          <motion.div

            style={{
              scaleY: progressScale,
              transformOrigin: "top"
            }}

            className="
              absolute
              left-1/2
              top-0
              h-full
              w-[2px]
              -translate-x-1/2

              bg-violet-300

              shadow-[0_0_5px_rgba(196,181,253,0.85),0_0_12px_rgba(139,92,246,0.45)]
            "
          />


          {/*
           * =====================================
           * 7 TIMELINE NODES
           * =====================================
           */}

          {Array.from({
            length: NODE_COUNT
          }).map((_, index) => {

            const position =
              (index / (NODE_COUNT - 1)) *
              TRACK_HEIGHT;

            const passed =
              index <= passedNode;

            return (

              <motion.div

                key={index}

                animate={{
                  scale: passed ? 1 : 0.95,
                  opacity: passed ? 1 : 0.75
                }}

                transition={{
                  duration: 0.25
                }}

                className={`
                  absolute
                  left-1/2

                  h-[14px]
                  w-[14px]

                  -translate-x-1/2
                  -translate-y-1/2

                  rounded-full

                  ${
                    passed
                      ? `
                        border-2
                        border-violet-300
                        bg-violet-300
                        shadow-[0_0_7px_rgba(196,181,253,0.55)]
                      `
                      : `
                        border-2
                        border-slate-400/30
                        bg-[#060912]
                      `
                  }
                `}

                style={{
                  top: `${position}px`
                }}

              />

            );

          })}


          {/*
           * =====================================
           * LARGE ACTIVE SCROLL ORB
           * =====================================
           */}

          <motion.div

            style={{
              y: orbY
            }}

            className="
              absolute
              left-1/2
              top-0

              h-[32px]
              w-[32px]

              -translate-x-1/2
              -translate-y-1/2

              rounded-full

              border-[7px]
              border-violet-400/30

              bg-violet-300

              shadow-[0_0_8px_rgba(196,181,253,0.9),0_0_20px_rgba(139,92,246,0.55)]
            "
          >

            {/*
             * INNER CORE
             */}
            <div
              className="
                absolute
                left-1/2
                top-1/2

                h-[12px]
                w-[12px]

                -translate-x-1/2
                -translate-y-1/2

                rounded-full

                bg-violet-200

                shadow-[0_0_8px_rgba(221,214,254,0.9)]
              "
            />


            {/*
             * SUBTLE PULSE
             */}
            <motion.div

              className="
                absolute
                inset-[-4px]
                rounded-full
                border
                border-violet-300/25
              "

              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.35, 0, 0.35]
              }}

              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeOut"
              }}

            />

          </motion.div>


        </div>

      </motion.div>

    </div>

  );
}
