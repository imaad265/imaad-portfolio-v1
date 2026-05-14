import { useState } from "react"
import { motion, useMotionValue, useSpring, useTransform, type PanInfo } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"

const DRAG_MAX = 200
const THRESHOLD = 0.85

interface SlideButtonProps {
  onComplete?: () => void
  label?: string
}

export function SlideButton({ onComplete, label = "SLIDE TO EXPLORE" }: SlideButtonProps) {
  const [completed, setCompleted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const dragX = useMotionValue(0)
  const springX = useSpring(dragX, { stiffness: 400, damping: 40, mass: 0.8 })
  const progress = useTransform(springX, [0, DRAG_MAX], [0, 1])
  const fillWidth = useTransform(springX, [0, DRAG_MAX], ["4%", "100%"])
  const labelOpacity = useTransform(springX, [0, DRAG_MAX * 0.4], [1, 0])

  const handleDragEnd = (_: unknown, _info: PanInfo) => {
    setIsDragging(false)
    if (progress.get() >= THRESHOLD) {
      setCompleted(true)
      dragX.set(DRAG_MAX)
      setTimeout(() => onComplete?.(), 300)
    } else {
      dragX.set(0)
    }
  }

  return (
    <div className="relative w-80 h-14 rounded-full border border-white/15 bg-white/[0.03] select-none overflow-hidden">
      {/* Track fill */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white/8"
        style={{ width: fillWidth }}
      />

      {/* Ghost label */}
      {!completed && (
        <motion.span
          style={{ opacity: labelOpacity }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.35em] text-white/35 font-medium pl-14"
        >
          {label}
        </motion.span>
      )}

      {/* Drag handle */}
      {!completed && (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: DRAG_MAX }}
          dragElastic={0.04}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ x: springX }}
          whileDrag={{ scale: 1.06 }}
          className="absolute left-1 top-1 z-10 cursor-grab active:cursor-grabbing"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isDragging ? "bg-red-700" : "bg-white"
            }`}
          >
            <ArrowRight
              size={17}
              className={isDragging ? "text-white" : "text-black"}
            />
          </div>
        </motion.div>
      )}

      {/* Completed state */}
      {completed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center gap-2"
        >
          <Check size={14} className="text-white/60" />
          <span className="text-[10px] tracking-[0.35em] text-white/60 font-medium">
            NAVIGATING
          </span>
        </motion.div>
      )}
    </div>
  )
}
