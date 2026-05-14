import { useId, useEffect, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import type { Container } from "@tsparticles/engine"
import { loadSlim } from "@tsparticles/slim"
import { cn } from "@/lib/utils"
import { motion, useAnimation } from "framer-motion"

type SparklesProps = {
  id?: string
  className?: string
  background?: string
  minSize?: number
  maxSize?: number
  speed?: number
  particleColor?: string
  particleDensity?: number
}

export function SparklesCore({
  id,
  className,
  background,
  minSize,
  maxSize,
  speed,
  particleColor,
  particleDensity,
}: SparklesProps) {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  const controls = useAnimation()
  const generatedId = useId()

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      controls.start({ opacity: 1, transition: { duration: 1 } })
    }
  }

  return (
    <motion.div animate={controls} className={cn("opacity-0", className)}>
      {init && (
        <Particles
          id={id ?? generatedId}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: background ?? "transparent" } },
            fullScreen: { enable: false, zIndex: 1 },
            // 60 fps cap — better mobile performance than the default 120
            fpsLimit: 60,
            interactivity: {
              events: {
                // Disabled — the layer is pointer-events-none anyway
                onClick: { enable: false },
                onHover: { enable: false },
                resize: true as unknown as boolean,
              },
            },
            particles: {
              color: { value: particleColor ?? "#ffffff" },
              move: {
                enable: true,
                direction: "none",
                random: true,
                straight: false,
                speed: { min: 0.05, max: speed ?? 0.3 },
                outModes: { default: "out" },
              },
              number: {
                density: { enable: true, width: 400, height: 400 },
                value: particleDensity ?? 22,
              },
              opacity: {
                value: { min: 0.08, max: 0.72 },
                animation: {
                  enable: true,
                  speed: speed ?? 0.25,
                  sync: false,
                  startValue: "random",
                  destroy: "none",
                  count: 0,
                  decay: 0,
                  delay: 0,
                  mode: "auto",
                },
              },
              size: {
                value: { min: minSize ?? 0.25, max: maxSize ?? 0.9 },
                animation: { enable: false, speed: 5, sync: false, count: 0, decay: 0, delay: 0, mode: "auto", startValue: "random", destroy: "none" },
              },
              shape: { type: "circle" },
              links: { enable: false },
              collisions: { enable: false },
              shadow: { enable: false, blur: 0, color: { value: "#000" } },
              stroke: { width: 0 },
            },
            detectRetina: true,
          }}
        />
      )}
    </motion.div>
  )
}
