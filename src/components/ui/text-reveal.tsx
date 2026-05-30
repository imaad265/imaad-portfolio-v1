import { type FC, type ReactNode, useRef } from "react"
import { motion, type MotionValue, useScroll, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextRevealByWordProps {
  text: string
  className?: string
}

// Words finish revealing at 95% of scroll progress.
// The remaining 5% is a minimal reading buffer before the
// element exits, keeping the CTA visually connected to the paragraph.
const REVEAL_CUTOFF = 0.95

const TextRevealByWord: FC<TextRevealByWordProps> = ({ text, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null)

  // Computed once at mount — CSR-only Vite app, window is always present.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isMobile = useRef(window.innerWidth < 768).current

  // ── Offset strategy ────────────────────────────────────────────────────────
  //
  // Default ["start end", "end start"] (desktop):
  //   Progress runs from "element entering the bottom of the viewport" to
  //   "element leaving the top". With a 108vh container the sticky panel is
  //   only visible during ~48%–52% of the full progress range.  Words
  //   that haven't yet revealed when the panel exits continue to animate
  //   off-screen, which desktop users never notice because they scroll slowly.
  //
  // ["start start", "end end"] (mobile):
  //   Progress runs from "panel top at viewport top" (sticky starts) to
  //   "panel bottom at viewport bottom" (sticky ends). Progress 0→1 maps
  //   EXACTLY across the sticky period, so the last word always reveals
  //   before the panel exits — regardless of scroll speed.
  //   A taller container (250vh) gives a comfortable 150vh of sticky scroll.
  //
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: isMobile
      ? ["start start", "end end"]
      : ["start end", "end start"],
  })

  // Light spring reduces per-frame jitter on lower-performance mobile devices.
  // Stiffness 80 keeps it close to the raw scroll value with minimal lag.
  // Only applied on mobile; desktop uses the raw value to preserve existing feel.
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.3 })
  const progress = isMobile ? smoothProgress : scrollYProgress

  const words = text.split(" ")

  return (
    <div
      ref={targetRef}
      className={cn(
        "relative z-0",
        isMobile ? "h-[250vh]" : "h-[108vh]",
        className
      )}
    >
      {/* bg-black prevents the transparent panel from appearing as a blank/dark
          area while the sticky element is still below its lock point and words
          are not yet revealed (opacity 0 against a see-through background). */}
      <div className="sticky top-0 mx-auto flex h-screen max-w-4xl items-center bg-black px-4 py-10 md:px-8 md:py-[5rem]">
        <p className="flex flex-wrap p-4 text-lg font-medium leading-relaxed text-white/20 md:p-8 md:text-2xl lg:p-10 lg:text-3xl xl:text-4xl">
          {words.map((word, i) => {
            const start = (i / words.length) * REVEAL_CUTOFF
            const end   = start + REVEAL_CUTOFF / words.length
            return (
              <Word key={i} progress={progress} range={[start, end]}>
                {word}
              </Word>
            )
          })}
        </p>
      </div>
    </div>
  )
}

interface WordProps {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="relative mx-1 lg:mx-2">
      <span className="absolute text-white/20">{children}</span>
      <motion.span style={{ opacity }} className="text-white">
        {children}
      </motion.span>
    </span>
  )
}

export { TextRevealByWord }
