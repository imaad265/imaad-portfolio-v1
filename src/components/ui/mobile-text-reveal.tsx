import { type FC, type ReactNode, useRef } from "react"
import { motion, type MotionValue, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

// Last word reveals at this fraction of scroll progress, giving a buffer before
// the element exits the viewport on real mobile devices.
const REVEAL_CUTOFF = 0.82

interface MobileTextRevealProps {
  text: string
  className?: string
}

// Scroll-driven word-by-word reveal for mobile.
// No sticky container, no artificial height — progress is derived from the
// natural scroll distance as the paragraph traverses the viewport.
//
// offset ["start 88%", "end 12%"] maps:
//   progress = 0  →  top edge enters at 88% down the viewport
//   progress = 1  →  bottom edge reaches 12% from the top
// On a 800px viewport with a ~200px element, that spans ≈840px of scrolling.
const MobileTextReveal: FC<MobileTextRevealProps> = ({ text, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 88%", "end 12%"],
  })

  const words = text.split(" ")

  return (
    <div ref={targetRef} className={cn("mx-auto max-w-4xl px-4 py-10", className)}>
      <p className="flex flex-wrap p-4 text-lg font-medium leading-relaxed text-white/20">
        {words.map((word, i) => {
          const start = (i / words.length) * REVEAL_CUTOFF
          const end = start + REVEAL_CUTOFF / words.length
          return (
            <MobileWord key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </MobileWord>
          )
        })}
      </p>
    </div>
  )
}

interface MobileWordProps {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
}

const MobileWord: FC<MobileWordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="relative mx-1">
      <span className="absolute text-white/20">{children}</span>
      <motion.span style={{ opacity }} className="text-white">
        {children}
      </motion.span>
    </span>
  )
}

export { MobileTextReveal }
