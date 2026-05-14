import { type FC, type ReactNode, useRef } from "react"
import { motion, type MotionValue, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextRevealByWordProps {
  text: string
  className?: string
}

// Words finish revealing at 80% of scroll progress.
// The remaining 20% is a comfortable reading buffer before the
// element exits, so the last sentence is never cut off mid-reveal.
const REVEAL_CUTOFF = 0.80

const TextRevealByWord: FC<TextRevealByWordProps> = ({ text, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: targetRef })
  const words = text.split(" ")

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[250vh]", className)}>
      {/* h-screen keeps the sticky panel exactly one viewport tall on every device */}
      <div className="sticky top-0 mx-auto flex h-screen max-w-4xl items-center bg-transparent px-4 py-10 md:px-8 md:py-[5rem]">
        <p className="flex flex-wrap p-4 text-lg font-medium leading-relaxed text-white/20 md:p-8 md:text-2xl lg:p-10 lg:text-3xl xl:text-4xl">
          {words.map((word, i) => {
            const start = (i / words.length) * REVEAL_CUTOFF
            const end   = start + REVEAL_CUTOFF / words.length
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
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
