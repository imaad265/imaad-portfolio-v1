import { type FC, type ReactNode, useRef } from "react"
import { motion, type MotionValue, useScroll, useTransform, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextRevealByWordProps {
  text: string
  className?: string
}

// Words finish revealing at 95% of scroll progress (desktop only).
const REVEAL_CUTOFF = 0.95

// Thin dispatcher — checks viewport width once at mount and renders either the
// desktop sticky implementation or the mobile viewport-triggered implementation.
// Both are separate components so each has its own unconditional hook calls.
const TextRevealByWord: FC<TextRevealByWordProps> = ({ text, className }) => {
  const isMobile = useRef(window.innerWidth < 768).current
  return isMobile
    ? <MobileReveal text={text} className={className} />
    : <DesktopReveal text={text} className={className} />
}

// ── Desktop: sticky scroll-progress reveal ───────────────────────────────────
// Completely unchanged from the original implementation.
const DesktopReveal: FC<TextRevealByWordProps> = ({ text, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })

  const words = text.split(" ")

  return (
    <div
      ref={targetRef}
      className={cn("relative z-0 h-[108vh]", className)}
    >
      <div className="sticky top-0 mx-auto flex h-screen max-w-4xl items-center bg-black px-4 py-10 md:px-8 md:py-[5rem]">
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

// ── Mobile: viewport-triggered staggered reveal ───────────────────────────────
// No sticky container, no artificial scroll height, no scroll-progress tracking.
// Words reveal progressively via staggered opacity transitions once the paragraph
// enters the viewport. `once: true` keeps them visible after the first trigger.
const MobileReveal: FC<TextRevealByWordProps> = ({ text, className }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true })
  const words = text.split(" ")

  return (
    <div ref={ref} className={cn("mx-auto max-w-4xl px-4 py-10", className)}>
      <p className="flex flex-wrap p-4 text-lg font-medium leading-relaxed text-white/20">
        {words.map((word, i) => (
          <MobileWord key={i} delay={i * 0.03} triggered={inView}>
            {word}
          </MobileWord>
        ))}
      </p>
    </div>
  )
}

// ── Desktop word ──────────────────────────────────────────────────────────────

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

// ── Mobile word ───────────────────────────────────────────────────────────────

interface MobileWordProps {
  children: ReactNode
  delay: number
  triggered: boolean
}

const MobileWord: FC<MobileWordProps> = ({ children, delay, triggered }) => {
  return (
    <span className="relative mx-1">
      <span className="absolute text-white/20">{children}</span>
      <motion.span
        animate={{ opacity: triggered ? 1 : 0 }}
        transition={{ duration: 0.45, delay, ease: "easeOut" }}
        style={{ opacity: 0 }}
        className="text-white"
      >
        {children}
      </motion.span>
    </span>
  )
}

export { TextRevealByWord }
