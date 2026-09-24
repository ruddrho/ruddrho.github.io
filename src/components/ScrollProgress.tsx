import {
  motion,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";

import { useEffect, useState } from "react";

const NODE_COUNT = 7;
const TRACK_HEIGHT = 336;

export function ScrollProgress() {

  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.5
  });

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
        duration: 1,
        delay: 0.8
      }}
      className="
        fixed
        right-6
        top-1/2
        -translate-y-1/2
        z-[999]
        hidden
        md:block
        pointer-events-none
      "
    >
      <div
        className="relative w-[34px]"
        style={{
          height: `${TRACK_HEIGHT}px`
        }}
      >

        {/* Base track */}
        <div
          className="
            absolute
            left-1/2
            top-0
            h-full
            w-px
            -translate-x-1/2
            bg-white/15
          "
        />

        {/* Active purple track */}
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
            to-purple-500
            shadow-[0_0_12px_rgba(167,139,250,0.55)]
          "
        />

        {/* Nodes */}
        {Array.from({
          length: NODE_COUNT
        }).map((_, index) => {

          const position =
            (index / (NODE_COUNT - 1)) *
            TRACK_HEIGHT;

          const passed = index <= activeNode;

          return (
            <motion.div
              key={index}
              animate={{
                scale:
                  index === activeNode
                    ? 1.15
                    : 1,

                opacity:
                  passed
                    ? 1
                    : 0.45
              }}
              transition={{
                duration: 0.3
              }}
              className={`
                absolute
                left-1/2
                h-[14px]
                w-[14px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border-2

                ${
                  passed
                    ? `
                      border-violet-300
                      bg-violet-300
                      shadow-[0_0_10px_rgba(167,139,250,.45)]
                    `
                    : `
                      border-white/25
                      bg-[#070b12]
                    `
                }
              `}
              style={{
                top: `${position}px`
              }}
            />
          );
        })}

        {/* Moving glowing orb */}
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
            border-[7px]
            border-violet-400/35
            bg-violet-300
            shadow-[0_0_18px_rgba(167,139,250,.75)]
          "
        >
          <motion.div
            animate={{
              scale: [1, 1.7, 1],
              opacity: [0.35, 0, 0.35]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="
              absolute
              inset-[-5px]
              rounded-full
              border
              border-violet-300/50
            "
          />
        </motion.div>

      </div>
    </motion.div>
  );
}
