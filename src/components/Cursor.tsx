import { motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useState } from "react"

export default function Cursor() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 150 })
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 150 })

  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX - 10)
      mouseY.set(e.clientY - 10)
    }

    const handleMouseOver = (e: any) => {
      if (e.target.closest("a, button, img")) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseover", handleMouseOver)

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseover", handleMouseOver)
    }
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full bg-white pointer-events-none z-50 mix-blend-difference"
      animate={{
        width: isHovering ? 40 : 20,
        height: isHovering ? 40 : 20,
      }}
      style={{
        x: smoothX,
        y: smoothY,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    />
  )
}