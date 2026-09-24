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

  const smoothProgress = useSpring(
    scrollYProgress,
    {
      stiffness: 90,
      damping: 24,
      mass: 0.5
    }
  );

  const orbY = useTransform(
    smoothProgress,
    [0, 1],
    [0, TRACK_HEIGHT]
  );

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

  const activeNode = Math.round(
    progress * (NODE_COUNT - 1)
  );

  return (

    /*
     * OUTER WRAPPER
     *
     * This wrapper controls the TRUE vertical centering.
     * Framer Motion cannot override this transform.
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
       * INNER MOTION WRAPPER
       * Animation is separated from positioning.
       */}

      <motion.div

        initial={{
          opacity: 0,
          x: 20
        }}

        animate={{
          opacity: 1,
          x: 0
        }}

        transition={{
          duration: 0.8,
          delay: 0.4
        }}

        className="
          relative
          flex
          items-center
          justify-center
          rounded-full
          bg-[#070910]/80
          px-[14px]
          py-[10px]
          backdrop-blur-sm
          border
          border-white/[0.035]
          shadow-[0_0_30px_rgba(0,0,0,.35)]
        "
      >

        <div
          className="relative w-[32px]"
          style={{
            height: `${TRACK_HEIGHT}px`
          }}
        >


          {/* BASE TRACK */}

          <div
            className="
              absolute
              left-1/2
              top-0
              h-full
              w-[2px]
              -translate-x-1/2
              bg-white/[0.10]
            "
          />


          {/* ACTIVE PURPLE TRACK */}

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

              bg-gradient-to-b
              from-violet-300
              via-violet-400
              to-violet-500

              shadow-[0_0_8px_rgba(167,139,250,.60)]
            "
          />


          {/* NODES */}

          {Array.from({
            length: NODE_COUNT
          }).map((_, index) => {

            const position =
              (index / (NODE_COUNT - 1)) *
              TRACK_HEIGHT;

            const passed =
              index <= activeNode;

            const isActive =
              index === activeNode;

            return (

              <motion.div

                key={index}

                animate={{
                  scale: isActive ? 1.08 : 1
                }}

                transition={{
                  duration: 0.25
                }}

                className={`
                  absolute
                  left-1/2

                  -translate-x-1/2
                  -translate-y-1/2

                  rounded-full

                  ${
                    passed
                      ? `
                        h-[14px]
                        w-[14px]

                        bg-violet-300
                        border-2
                        border-violet-300

                        shadow-[0_0_8px_rgba(167,139,250,.40)]
                      `
                      : `
                        h-[14px]
                        w-[14px]

                        bg-[#080a10]

                        border-2
                        border-white/[0.18]
                      `
                  }
                `}

                style={{
                  top: `${position}px`
                }}

              />

            );

          })}


          {/* MOVING ACTIVE ORB */}

          <motion.div

            style={{
              y: orbY
            }}

            className="
              absolute
              left-1/2
              top-0

              h-[30px]
              w-[30px]

              -translate-x-1/2
              -translate-y-1/2

              rounded-full

              bg-violet-300

              border-[7px]
              border-violet-400/30

              shadow-[
                0_0_8px_rgba(196,181,253,.9),
                0_0_18px_rgba(139,92,246,.45)
              ]
            "
          >

            {/* soft pulse */}

            <motion.div

              className="
                absolute
                inset-[-5px]
                rounded-full
                border
                border-violet-300/30
              "

              animate={{
                scale: [1, 1.35, 1],
                opacity: [0.25, 0, 0.25]
              }}

              transition={{
                duration: 2,
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
