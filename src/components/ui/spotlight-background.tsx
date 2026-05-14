import { motion } from "framer-motion"

// Self-contained background layer — place as first child inside a
// `relative overflow-hidden` parent. Absolutely fills the parent.
// pointer-events-none is set here; content above must be z-10+.
export function SpotlightBackground() {
  const spot = (
    opacity: number,
    size: string,
    blur: number,
    top: string,
    left: string,
    xPath: string[],
    yPath: string[],
    duration: number,
    delay: number,
  ) => ({
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, rgba(255,255,255,${opacity}) 0%, transparent 62%)`,
      filter: `blur(${blur}px)`,
      position: "absolute" as const,
      top,
      left,
      transform: "translate(-50%, -50%)",
      willChange: "transform",
    } as React.CSSProperties,
    animate: { x: xPath, y: yPath },
    transition: {
      duration,
      ease: "easeInOut" as const,
      repeat: Infinity,
      repeatType: "mirror" as const,
      delay,
    },
  })

  const s1 = spot(
    0.042,
    "clamp(480px, 68vw, 860px)",
    105,
    "28%", "35%",
    ["-8%", "6%", "-3%", "-8%"],
    ["-8%", "10%", "-4%", "-8%"],
    26,
    0,
  )

  const s2 = spot(
    0.030,
    "clamp(340px, 50vw, 640px)",
    120,
    "70%", "70%",
    ["0%", "-12%", "8%", "0%"],
    ["0%", "-8%", "12%", "0%"],
    34,
    7,
  )

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <motion.div style={s1.style} animate={s1.animate} transition={s1.transition} />
      <motion.div style={s2.style} animate={s2.animate} transition={s2.transition} />
    </div>
  )
}
