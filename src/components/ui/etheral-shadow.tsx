import { useRef, useId, useEffect, type CSSProperties } from 'react'
import { animate, useMotionValue, type AnimationPlaybackControls } from 'framer-motion'

interface AnimationConfig {
  scale: number
  speed: number
}

interface NoiseConfig {
  opacity: number
  scale: number
}

export interface EtherealShadowProps {
  sizing?: 'fill' | 'stretch'
  color?: string
  animation?: AnimationConfig
  noise?: NoiseConfig
  style?: CSSProperties
  className?: string
}

function mapRange(v: number, a: number, b: number, c: number, d: number): number {
  if (a === b) return c
  return c + ((v - a) / (b - a)) * (d - c)
}

export function EtherealShadow({
  sizing = 'fill',
  color = 'rgba(128, 128, 128, 1)',
  animation,
  noise,
  style,
  className,
}: EtherealShadowProps) {
  const rawId = useId()
  const id = `ethereal-${rawId.replace(/:/g, '')}`
  const enabled = !!animation && animation.scale > 0
  const feRef = useRef<SVGFEColorMatrixElement>(null)
  const hue = useMotionValue(180)
  const animRef = useRef<AnimationPlaybackControls | null>(null)

  const dispScale = animation ? mapRange(animation.scale, 1, 100, 20, 100) : 0
  const duration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) / 25 : 1

  useEffect(() => {
    if (!feRef.current || !enabled) return
    animRef.current?.stop()
    hue.set(0)
    animRef.current = animate(hue, 360, {
      duration,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'linear',
      onUpdate: (v) => feRef.current?.setAttribute('values', String(v)),
    })
    return () => animRef.current?.stop()
  }, [enabled, duration, hue])

  return (
    <div
      className={className}
      style={{ overflow: 'hidden', position: 'relative', width: '100%', height: '100%', ...style }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -dispScale,
          filter: enabled ? `url(#${id}) blur(4px)` : 'none',
        }}
      >
        {enabled && (
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <filter id={id}>
                <feTurbulence
                  result="undulation"
                  numOctaves="2"
                  baseFrequency={`${mapRange(animation.scale, 0, 100, 0.001, 0.0005)},${mapRange(animation.scale, 0, 100, 0.004, 0.002)}`}
                  seed="0"
                  type="turbulence"
                />
                <feColorMatrix ref={feRef} in="undulation" type="hueRotate" values="180" />
                <feColorMatrix
                  in="dist"
                  result="circulation"
                  type="matrix"
                  values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                />
                <feDisplacementMap in="SourceGraphic" in2="circulation" scale={dispScale} result="dist" />
                <feDisplacementMap in="dist" in2="undulation" scale={dispScale} result="output" />
              </filter>
            </defs>
          </svg>
        )}
        <div
          style={{
            backgroundColor: color,
            maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
            maskSize: sizing === 'stretch' ? '100% 100%' : 'cover',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {noise && noise.opacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
            backgroundSize: `${noise.scale * 200}px`,
            backgroundRepeat: 'repeat',
            opacity: noise.opacity / 2,
          }}
        />
      )}
    </div>
  )
}
