import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedText } from "./ui/animated-shiny-text"

import travelReelImg     from "../assets/travelreel.png"
import cinematicStoryImg from "../assets/cinematicstory.png"
import visualEditImg     from "../assets/visualedit.png"
import promoEditImg      from "../assets/promoedit.png"

const projects = [
  {
    title: "Travel Reel",
    description: "A cinematic journey through distant horizons.",
    image: travelReelImg,
    video: "/videos/Airporttransition.mp4",
    vertical: true,
  },
  {
    title: "Cinematic Story",
    description: "Visual narratives that move beyond the frame.",
    image: cinematicStoryImg,
    video: "/videos/Ideamoviereel.mp4",
    vertical: false,
  },
  {
    title: "Visual Edit",
    description: "Where visuals speak louder than words.",
    image: visualEditImg,
    video: "/videos/Visualfilm.mp4",
    vertical: false,
  },
  {
    title: "Promo Edit",
    description: "High-impact cuts crafted for the moment.",
    image: promoEditImg,
    video: "/videos/Shawafelfast.mp4",
    vertical: true,
  },
]

function startVideo(video: HTMLVideoElement | null) {
  // offsetParent is null when any ancestor has display:none — skip hidden layouts
  if (!video || video.offsetParent === null) return
  video.muted = false
  video.play().catch(() => {
    video.muted = true
    video.play().catch(() => {})
  })
}

function stopVideo(video: HTMLVideoElement | null) {
  if (!video) return
  video.pause()
  video.currentTime = 0
}

export default function Featured() {
  const [active, setActive] = useState<number | null>(null)

  // Two separate ref arrays: one for the desktop accordion, one for the mobile
  // grid. Both layouts live in the DOM (CSS hides the inactive one) so we need
  // separate refs. Browsers block audio on display:none elements, so only the
  // visible layout's video actually plays — the other call fails silently.
  const desktopRefs = useRef<(HTMLVideoElement | null)[]>([])
  const mobileRefs  = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    // Stop every video first — prevents any previous card from leaking audio
    desktopRefs.current.forEach(stopVideo)
    mobileRefs.current.forEach(stopVideo)

    if (active === null) return

    startVideo(desktopRefs.current[active])
    startVideo(mobileRefs.current[active])
  }, [active])

  const handleClick = (index: number) => {
    // Toggle: clicking the open card collapses; clicking any other card switches
    setActive(prev => (prev === index ? null : index))
  }

  return (
    <section
      id="featured"
      className="bg-black text-white min-h-screen flex flex-col justify-center px-6 md:px-16 py-20"
      style={{ overflowX: "clip" }}
    >
      <h2 className="text-3xl font-semibold mb-10 md:mb-12 tracking-wide">
        Selected Work
      </h2>

      {/* ── Desktop: Horizontal Accordion ────────────────────────────────── */}
      {/*
        Height formula: card_width = (100vw - 128px_padding - 30px_gaps) / 4
        For 9:16 collapsed cards: height = card_width × 16/9
                                         = (100vw - 158px) × 4/9
                                         ≈ 44.44vw - 70px
        This keeps all 4 collapsed cards in true 9:16 at any desktop viewport width.
      */}
      <div
        className="hidden md:flex w-full gap-2.5"
        style={{ height: "clamp(260px, calc(44.44vw - 70px), 720px)" }}
      >
        {projects.map((item, index) => {
          const isActive = active === index

          return (
            <div
              key={index}
              onClick={() => handleClick(index)}
              className="relative overflow-hidden rounded-2xl cursor-pointer bg-black"
              style={{
                flex: isActive ? "6 1 0%" : "1 1 0%",
                minWidth: isActive ? "0" : "44px",
                transition: "flex 0.72s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* Thumbnail poster — shown when card is collapsed */}
              <img
                src={item.image}
                alt={item.title}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                style={{
                  opacity: isActive ? 0 : 1,
                  filter: "contrast(1.06) brightness(0.78)",
                  transition: "opacity 0.52s ease",
                }}
              />

              {/* Video — hidden under the poster, fades in when active.
                  Vertical (9:16) videos use contain to preserve composition;
                  horizontal (16:9) videos use cover to fill the wide card. */}
              <video
                ref={(el) => { desktopRefs.current[index] = el }}
                src={item.video}
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  objectFit: "contain",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 0.52s ease 0.08s",
                }}
              />

              {/* Persistent dark gradient — heavier at bottom for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

              {/* Red baseline — matches the SelectedVisions accordion style */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
                animate={{
                  backgroundColor: isActive
                    ? "rgba(185,28,28,0.65)"
                    : "rgba(255,255,255,0)",
                }}
                transition={{ duration: 0.45 }}
              />

              {/* Active state: title + description slide in from the right */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute bottom-5 left-5 right-5 pointer-events-none"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{    opacity: 0, x: 20 }}
                    transition={{ duration: 0.38, delay: 0.18 }}
                  >
                    <p className="text-white/90 font-semibold text-base tracking-wide leading-tight">
                      {item.title}
                    </p>
                    <p className="text-white/40 text-[11px] mt-1 font-light tracking-wide">
                      {item.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsed state: vertical rotated title */}
              <AnimatePresence>
                {!isActive && (
                  <motion.div
                    className="absolute inset-0 flex items-end justify-center pb-5 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{    opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <span
                      className="text-white/35 tracking-[0.32em] uppercase font-light"
                      style={{
                        fontSize: "clamp(7px, 1.2vw, 9px)",
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                      }}
                    >
                      {item.title}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* ── Mobile: 2 × 2 portrait grid ──────────────────────────────────── */}
      {/* Each card plays the video inline when tapped — no accordion needed  */}
      <div className="grid md:hidden grid-cols-2 gap-3">
        {projects.map((item, index) => {
          const isActive = active === index

          return (
            <div
              key={`m-${index}`}
              onClick={() => handleClick(index)}
              className="relative overflow-hidden rounded-2xl cursor-pointer bg-black"
              style={{ aspectRatio: "9 / 16" }}
            >
              {/* Thumbnail */}
              <img
                src={item.image}
                alt={item.title}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                style={{
                  opacity: isActive ? 0 : 1,
                  filter: "contrast(1.06) brightness(0.82)",
                  transition: "opacity 0.45s ease",
                }}
              />

              {/* Video — vertical fills the 9:16 card exactly (cover);
                  horizontal letterboxes cleanly rather than over-cropping (contain). */}
              <video
                ref={(el) => { mobileRefs.current[index] = el }}
                src={item.video}
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  objectFit: item.vertical ? "cover" : "contain",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 0.45s ease",
                }}
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none" />

              {/* Play indicator (collapsed) */}
              <AnimatePresence>
                {!isActive && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{    opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/[0.13] flex items-center justify-center">
                      <svg width="12" height="14" viewBox="0 0 12 14" fill="white" className="ml-0.5 opacity-80">
                        <polygon points="0,0 12,7 0,14" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Card text */}
              <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                <p className="text-white/90 font-medium text-sm tracking-wide leading-tight">
                  {item.title}
                </p>
                <p className="text-white/40 text-[11px] mt-0.5 font-light">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Scroll invitation */}
      <AnimatedText
        text="Continue scrolling to watch the full collection"
        gradientColors="linear-gradient(90deg, #3a3a3a, #a0a0a0, #d8d8d8, #a0a0a0, #3a3a3a)"
        gradientAnimationDuration={3.5}
        hoverEffect
        className="mt-14"
        textClassName="text-[11px] md:text-xs font-light tracking-[0.22em] uppercase"
      />
    </section>
  )
}
