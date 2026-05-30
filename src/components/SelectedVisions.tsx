import { useState, useRef, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion"
import {
  ChevronLeft, ChevronRight, ChevronDown,
  Play, Pause, Volume2, VolumeX, Maximize, X,
} from "lucide-react"

import thumbRadissonfilm  from "../assets/radissonfilm.png"
import thumbIdeafilmcom   from "../assets/Ideafilmcom.png"
import thumbVisualfilm    from "../assets/Visualfilm.png"
import thumbHorrorfilmcom from "../assets/Horrorfilcom.png"
import thumbAirport       from "../assets/airport.png"
import thumbCar           from "../assets/car.png"
import thumbCCD           from "../assets/CCD.png"
import thumbEatRoute      from "../assets/EatRoute.png"
import thumbFarmhouse     from "../assets/farmhouse.png"
import thumbGv            from "../assets/gv.png"
import thumbShawafelfast  from "../assets/Shawafelfast.png"
import thumbShawafelslow  from "../assets/shawafelslow.png"
import thumbTravelcom     from "../assets/Travelcom.png"
import thumbRadissonshort from "../assets/radissonshort.png"
import thumbJali          from "../assets/jali.png"
import thumbLovestorycom  from "../assets/Lovestorycom.png"
import thumbTakeaBreak    from "../assets/TakeaBreak.png"

const thumbnailMap: Record<string, string> = {
  "/videos/radissonfilm.mp4":  thumbRadissonfilm,
  "/videos/Ideafilmcom.mp4":   thumbIdeafilmcom,
  "/videos/Visualfilm.mp4":    thumbVisualfilm,
  "/videos/Horrorfilmcom.mp4": thumbHorrorfilmcom,
  "/videos/airport.mp4":       thumbAirport,
  "/videos/car.mp4":           thumbCar,
  "/videos/CCD.mp4":           thumbCCD,
  "/videos/EatRoute.mp4":      thumbEatRoute,
  "/videos/farmhouse.mp4":     thumbFarmhouse,
  "/videos/gv.mp4":            thumbGv,
  "/videos/Shawafelfast.mp4":  thumbShawafelfast,
  "/videos/shawafelslow.mp4":  thumbShawafelslow,
  "/videos/Travelcom.mp4":     thumbTravelcom,
  "/videos/radissonshort.mp4": thumbRadissonshort,
  "/videos/jali.MP4":          thumbJali,
  "/videos/Lovestorycom.mp4":  thumbLovestorycom,
  "/videos/TakeaBreak.mp4":    thumbTakeaBreak,
}

const horizontalVideos = new Set([
  "/videos/Ideafilmcom.mp4",
  "/videos/Horrorfilmcom.mp4",
  "/videos/radissonfilm.mp4",
  "/videos/Visualfilm.mp4",
  "/videos/jali.MP4",
  "/videos/TakeaBreak.mp4",
])

// ── Global video registry ─────────────────────────────────────────────────────
const videoRegistry = new Set<HTMLVideoElement>()
function regVideo(v: HTMLVideoElement)   { videoRegistry.add(v) }
function unregVideo(v: HTMLVideoElement) { videoRegistry.delete(v) }
function pauseAllExcept(except?: HTMLVideoElement | null) {
  videoRegistry.forEach(v => { if (v !== except) v.pause() })
}

// ── Data ──────────────────────────────────────────────────────────────────────
const cinematicItems = [
  { src: "/videos/radissonfilm.mp4", title: "Afterglow",    desc: "Cinematic living through atmosphere and motion."  },
  { src: "/videos/Ideafilmcom.mp4",  title: "Silence",      desc: "A story-driven cinematic short focused on emotion." },
  { src: "/videos/Visualfilm.mp4",   title: "Fragments",    desc: "Experimental visuals captured on iPhone 14 Pro."  },
  { src: "/videos/Horrorfilmcom.mp4",title: "Presence",     desc: "Psychological tension built through cinematic framing." },
]

const fastPacedItems = [
  { src: "/videos/airport.mp4",      title: "Velocity" },
  { src: "/videos/EatRoute.mp4",     title: "Impact"   },
  { src: "/videos/CCD.mp4",          title: "Rush"     },
  { src: "/videos/Shawafelfast.mp4", title: "Surge"    },
  { src: "/videos/gv.mp4",           title: "Drift"    },
]

const atmosphereItems = [
  { src: "/videos/radissonshort.mp4", title: "Haze"     },
  { src: "/videos/Travelcom.mp4",     title: "Euphoria" },
  { src: "/videos/shawafelslow.mp4",  title: "Fade"     },
  { src: "/videos/farmhouse.mp4",     title: "Void"     },
  { src: "/videos/car.mp4",           title: "Obsidian" },
]

const archiveItems = [
  { title: "Fragments from the early days.", year: "2024", src: "/videos/jali.MP4" },
  { title: "An early directing experiment.",    year: "2024", src: "/videos/Lovestorycom.mp4" },
  { title: "Early frames. The beginning of the vision.",   year: "2024", src: "/videos/TakeaBreak.mp4" },
]

// ── VideoControls ─────────────────────────────────────────────────────────────
interface VCProps {
  playing: boolean; muted: boolean
  onPlay: () => void; onMute: () => void; onFs: () => void
  className?: string
}
function VideoControls({ playing, muted, onPlay, onMute, onFs, className = "" }: VCProps) {
  const btn = "w-[28px] h-[28px] flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
  return (
    <div className={`flex items-center gap-[6px] ${className}`} onClick={e => e.stopPropagation()}>
      <button className={btn} onClick={onPlay}>{playing ? <Pause size={9}/> : <Play size={9}/>}</button>
      <button className={btn} onClick={onMute}>{muted  ? <VolumeX size={9}/> : <Volume2 size={9}/>}</button>
      <button className={btn} onClick={onFs}><Maximize size={9}/></button>
    </div>
  )
}

// ── FullscreenPortal ──────────────────────────────────────────────────────────
interface FSProps {
  isOpen: boolean; onClose: () => void
  items: { src: string; title: string }[]
  initialIndex: number; showNav?: boolean; initMuted?: boolean
}
function FullscreenPortal({ isOpen, onClose, items, initialIndex, showNav = false, initMuted = true }: FSProps) {
  const [fsIdx,   setFsIdx]   = useState(initialIndex)
  const [fsPlay,  setFsPlay]  = useState(false)
  const [fsMuted, setFsMuted] = useState(initMuted)
  const vRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => { if (isOpen) setFsIdx(initialIndex) }, [isOpen, initialIndex])

  useEffect(() => {
    if (!isOpen) return
    const v = vRef.current
    if (!v) return
    pauseAllExcept(v)
    v.muted = fsMuted
    v.load()
    v.play().then(() => setFsPlay(true)).catch(() => {})
  }, [isOpen, fsIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) return
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (showNav && e.key === "ArrowLeft")  setFsIdx(p => (p - 1 + items.length) % items.length)
      if (showNav && e.key === "ArrowRight") setFsIdx(p => (p + 1) % items.length)
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [isOpen, showNav, onClose, items.length])

  useEffect(() => {
    if (!isOpen && vRef.current) vRef.current.pause()
  }, [isOpen])

  const navBtn = "absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/50 hover:text-white hover:border-white/30 transition-all duration-200 backdrop-blur-sm"

  const toggleFsPlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    const v = vRef.current; if (!v) return
    if (v.paused) { pauseAllExcept(v); v.play(); setFsPlay(true) }
    else          { v.pause(); setFsPlay(false) }
  }
  const toggleFsMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const v = vRef.current; if (!v) return
    v.muted = !v.muted; setFsMuted(v.muted)
  }

  if (!isOpen) return null

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <button
        onClick={e => { e.stopPropagation(); onClose() }}
        className="absolute top-5 right-5 z-30 w-9 h-9 flex items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/50 hover:text-white transition-all backdrop-blur-sm"
      >
        <X size={14}/>
      </button>

      {showNav && (
        <>
          <button
            onClick={e => { e.stopPropagation(); setFsIdx(p => (p - 1 + items.length) % items.length) }}
            className={`${navBtn} left-4 md:left-8`}
          ><ChevronLeft size={18}/></button>
          <button
            onClick={e => { e.stopPropagation(); setFsIdx(p => (p + 1) % items.length) }}
            className={`${navBtn} right-4 md:right-8`}
          ><ChevronRight size={18}/></button>
        </>
      )}

      <video
        ref={vRef}
        src={items[fsIdx].src}
        muted={fsMuted}
        loop playsInline
        className="max-h-[88vh] max-w-[88vw] object-contain cursor-pointer"
        onClick={toggleFsPlay}
      />

      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={toggleFsPlay}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/60 hover:text-white transition-all backdrop-blur-sm"
        >{fsPlay ? <Pause size={11}/> : <Play size={11}/>}</button>
        <button
          onClick={toggleFsMute}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/60 hover:text-white transition-all backdrop-blur-sm"
        >{fsMuted ? <VolumeX size={11}/> : <Volume2 size={11}/>}</button>
        <span className="text-[8px] tracking-[0.45em] text-white/25 uppercase px-2">{items[fsIdx].title}</span>
        {showNav && (
          <div className="flex items-center gap-[6px]">
            {items.map((_, i) => (
              <button
                key={i} onClick={() => setFsIdx(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === fsIdx ? "18px" : "4px", height: "4px",
                  backgroundColor: i === fsIdx ? "rgba(185,28,28,0.9)" : "rgba(255,255,255,0.18)"
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>,
    document.body
  )
}

// ── CinematicStories ──────────────────────────────────────────────────────────
function CinematicStories() {
  const [active,  setActive]  = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted,   setMuted]   = useState(true)
  const [fsOpen,  setFsOpen]  = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const setRef = useCallback((i: number) => (el: HTMLVideoElement | null) => {
    const prev = videoRefs.current[i]
    if (prev) unregVideo(prev)
    if (el)   regVideo(el)
    videoRefs.current[i] = el
  }, [])

  const select = (i: number) => {
    const prev = videoRefs.current[active]
    if (prev) { prev.pause(); prev.currentTime = 0 }
    setActive(i); setPlaying(false)
  }

  const togglePlay = useCallback(() => {
    const v = videoRefs.current[active]; if (!v) return
    if (v.paused) { pauseAllExcept(v); v.play().catch(() => {}); setPlaying(true) }
    else          { v.pause(); setPlaying(false) }
  }, [active])

  const toggleMute = useCallback(() => {
    setMuted(m => {
      const next = !m
      videoRefs.current.forEach(v => { if (v) v.muted = next })
      return next
    })
  }, [])

  return (
    <>
      <FullscreenPortal
        isOpen={fsOpen} onClose={() => setFsOpen(false)}
        items={cinematicItems} initialIndex={active}
        showNav initMuted={muted}
      />
      <div
        className="flex w-full overflow-hidden"
        style={{ height: "clamp(300px, 54vh, 520px)" }}
      >
        {cinematicItems.map((item, i) => {
          const isAct = i === active
          const brightVal = isAct ? 0.68 : 0.28
          return (
            <div
              key={i}
              className="relative overflow-hidden cursor-pointer"
              style={{
                flex: isAct ? "4 1 0%" : "1 1 0%",
                transition: "flex 0.7s cubic-bezier(0.4,0,0.2,1)",
                borderLeft: i > 0 ? "1px solid rgba(127,29,29,0.18)" : "none",
                minWidth: "36px",
              }}
              onClick={() => isAct ? togglePlay() : select(i)}
            >
              {/* Video — only loads when this panel is active */}
              <video
                ref={setRef(i)}
                src={isAct ? item.src : undefined}
                muted={muted} loop playsInline preload="none"
                className="w-full h-full object-cover pointer-events-none"
                style={{
                  filter: `brightness(${brightVal})`,
                  transition: "filter 0.7s ease",
                }}
                onPause={() => { if (isAct) setPlaying(false) }}
              />

              {/* Thumbnail — covers video, fades out only when playing */}
              <motion.img
                src={thumbnailMap[item.src]}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{
                  filter: `brightness(${brightVal})`,
                  transition: "filter 0.7s ease",
                }}
                animate={{ opacity: isAct && playing ? 0 : 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none"/>

              {/* inactive: vertical label */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-end pb-6 pointer-events-none"
                animate={{ opacity: isAct ? 0 : 0.45 }}
                transition={{ duration: 0.35 }}
              >
                <span
                  className="text-[7px] tracking-[0.42em] text-white uppercase"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >{item.title}</span>
              </motion.div>

              {/* active: info */}
              <motion.div
                className="absolute bottom-5 left-5 right-5 pointer-events-none"
                animate={{ opacity: isAct ? 1 : 0, x: isAct ? 0 : 18 }}
                transition={{ duration: 0.42, delay: isAct ? 0.18 : 0 }}
              >
                <p className="mb-1 text-[8px] tracking-[0.48em] text-white/35 uppercase">0{i + 1}</p>
                <h4 className="text-xl font-bold tracking-tight text-white leading-none">{item.title}</h4>
                <p className="mt-[6px] text-[11px] tracking-wider text-white/38">{item.desc}</p>
              </motion.div>

              {/* active: controls */}
              <motion.div
                className="absolute top-4 right-4"
                animate={{ opacity: isAct ? 1 : 0 }}
                transition={{ duration: 0.3, delay: isAct ? 0.25 : 0 }}
              >
                <VideoControls
                  playing={playing} muted={muted}
                  onPlay={togglePlay}
                  onMute={toggleMute}
                  onFs={() => setFsOpen(true)}
                />
              </motion.div>

              {/* active: red baseline */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
                animate={{ backgroundColor: isAct ? "rgba(185,28,28,0.65)" : "transparent" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}

// ── CarouselSection ───────────────────────────────────────────────────────────
interface CarouselProps {
  items: { src: string; title: string }[]
  speed: number
  filterStyle: string
}

function CarouselSection({ items, speed, filterStyle }: CarouselProps) {
  const count = items.length
  const [activeIdx, setActiveIdx] = useState(Math.floor(count / 2))
  const [playing,   setPlaying]   = useState(false)
  const [muted,     setMuted]     = useState(true)
  const [fsOpen,    setFsOpen]    = useState(false)
  const videoRefs    = useRef<(HTMLVideoElement | null)[]>([])
  const touchStartX  = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)
  const slideX       = useMotionValue(0)

  // Spring config: snappier for fast-paced, floatier for atmosphere
  const trackSpring = speed < 0.6
    ? { type: "spring" as const, stiffness: 340, damping: 36, mass: 0.9 }
    : { type: "spring" as const, stiffness: 190, damping: 26, mass: 1.1 }

  const cardSpring = speed < 0.6
    ? { type: "spring" as const, stiffness: 340, damping: 36, mass: 0.9 }
    : { type: "spring" as const, stiffness: 190, damping: 26, mass: 1.1 }

  const setRef = useCallback((i: number) => (el: HTMLVideoElement | null) => {
    const prev = videoRefs.current[i]
    if (prev) unregVideo(prev)
    if (el)   regVideo(el)
    videoRefs.current[i] = el
  }, [])

  const computeTargetX = useCallback(() => {
    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return null
    const cards = Array.from(track.children) as HTMLElement[]
    const card = cards[activeIdx]
    if (!card) return null
    return container.offsetWidth / 2 - (card.offsetLeft + card.offsetWidth / 2)
  }, [activeIdx])

  // Spring-slide track whenever active card changes
  useEffect(() => {
    const target = computeTargetX()
    if (target === null) return
    animate(slideX, target, trackSpring)
  }, [activeIdx]) // eslint-disable-line

  // Snap to correct position on first render (no animation)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const target = computeTargetX()
      if (target !== null) slideX.set(target)
    })
    return () => cancelAnimationFrame(id)
  }, []) // eslint-disable-line

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (v && i !== activeIdx) { v.pause(); v.currentTime = 0 }
    })
    setPlaying(false)
  }, [activeIdx])

  const goTo = (i: number) => setActiveIdx((i + count) % count)

  const togglePlay = useCallback(() => {
    const v = videoRefs.current[activeIdx]; if (!v) return
    if (v.paused) { pauseAllExcept(v); v.play().catch(() => {}); setPlaying(true) }
    else          { v.pause(); setPlaying(false) }
  }, [activeIdx])

  const toggleMute = useCallback(() => {
    setMuted(m => {
      const next = !m
      videoRefs.current.forEach(v => { if (v) v.muted = next })
      return next
    })
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd   = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 45) goTo(activeIdx + (dx > 0 ? -1 : 1))
  }

  const dist = (i: number) => {
    const raw = Math.abs(i - activeIdx)
    return Math.min(raw, count - raw)
  }

  return (
    <>
      <FullscreenPortal
        isOpen={fsOpen} onClose={() => setFsOpen(false)}
        items={items} initialIndex={activeIdx}
        showNav initMuted={muted}
      />

      <div className="flex flex-col items-center gap-6 py-8 md:py-12">
        {/* Clipping container — track slides inside */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            ref={trackRef}
            className="flex items-center"
            style={{ x: slideX, gap: "clamp(8px, 1.5vw, 20px)" }}
          >
            {items.map((item, i) => {
              const d = dist(i)
              const isAct = d === 0
              const scale   = isAct ? 1 : d === 1 ? 0.74 : 0.56
              const opacity = isAct ? 1 : d === 1 ? 0.52 : 0.22
              const blur    = isAct ? "blur(0px)" : d === 1 ? "blur(1px)" : "blur(2.5px)"

              return (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-sm flex-shrink-0 cursor-pointer"
                  style={{
                    width: "clamp(88px, 11vw, 148px)",
                    aspectRatio: "9/16",
                    zIndex: isAct ? 10 : 5 - d,
                  }}
                  animate={{ scale, opacity, filter: blur }}
                  transition={cardSpring}
                  onClick={() => isAct ? togglePlay() : setActiveIdx(i)}
                >
                  {/* Video — only loads for the active card */}
                  <video
                    ref={setRef(i)}
                    src={isAct ? item.src : undefined}
                    muted={muted} loop playsInline preload="none"
                    className="w-full h-full object-cover pointer-events-none"
                    style={{ filter: filterStyle }}
                    onPause={() => { if (isAct) setPlaying(false) }}
                  />

                  {/* Thumbnail — fades out when active card is playing */}
                  <motion.img
                    src={thumbnailMap[item.src]}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ filter: filterStyle }}
                    animate={{ opacity: isAct && playing ? 0 : 1 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>

                  {/* border */}
                  <div
                    className="absolute inset-0 rounded-sm pointer-events-none"
                    style={{ border: isAct ? "1px solid rgba(185,28,28,0.38)" : "1px solid rgba(255,255,255,0.05)" }}
                  />

                  {/* active: title + controls */}
                  <AnimatePresence>
                    {isAct && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                        className="absolute bottom-3 left-0 right-0 px-3"
                      >
                        <p className="text-center text-[7px] tracking-[0.45em] text-white/45 uppercase mb-2">
                          {item.title}
                        </p>
                        <div className="flex justify-center">
                          <VideoControls
                            playing={playing} muted={muted}
                            onPlay={togglePlay}
                            onMute={toggleMute}
                            onFs={() => setFsOpen(true)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Navigation row */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => goTo(activeIdx - 1)}
            className="w-8 h-8 rounded-full border border-red-950/40 flex items-center justify-center text-white/30 hover:text-white hover:border-red-800/55 transition-colors duration-200"
          ><ChevronLeft size={13}/></button>

          <div className="flex items-center gap-[7px]">
            {items.map((_, i) => (
              <button
                key={i} onClick={() => setActiveIdx(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === activeIdx ? "20px" : "4px", height: "4px",
                  backgroundColor: i === activeIdx ? "rgb(185,28,28)" : "rgba(255,255,255,0.16)"
                }}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(activeIdx + 1)}
            className="w-8 h-8 rounded-full border border-red-950/40 flex items-center justify-center text-white/30 hover:text-white hover:border-red-800/55 transition-colors duration-200"
          ><ChevronRight size={13}/></button>
        </div>
      </div>
    </>
  )
}

function FastPacedCarousel() {
  return <CarouselSection items={fastPacedItems} speed={0.45} filterStyle="brightness(0.78) contrast(1.08)" />
}

function AtmosphereSlider() {
  return <CarouselSection items={atmosphereItems} speed={1.1} filterStyle="brightness(0.55) contrast(1.12) saturate(0.6)" />
}

// ── ArchiveSection ────────────────────────────────────────────────────────────
function ArchiveSection() {
  const [openItem, setOpenItem] = useState<number | null>(null)
  const [playing,  setPlaying]  = useState<Record<number, boolean>>({})
  const [muted,    setMuted]    = useState(true)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const setRef = useCallback((i: number) => (el: HTMLVideoElement | null) => {
    const prev = videoRefs.current[i]
    if (prev) unregVideo(prev)
    if (el)   regVideo(el)
    videoRefs.current[i] = el
  }, [])

  const toggle = (i: number) => {
    if (openItem === i) {
      const v = videoRefs.current[i]
      if (v) { v.pause(); v.currentTime = 0 }
      setPlaying(p => ({ ...p, [i]: false }))
      setOpenItem(null)
    } else {
      if (openItem !== null) {
        const prev = videoRefs.current[openItem]
        if (prev) { prev.pause(); prev.currentTime = 0 }
        setPlaying(p => ({ ...p, [openItem]: false }))
      }
      setOpenItem(i)
    }
  }

  const togglePlay = (i: number) => {
    const v = videoRefs.current[i]; if (!v) return
    if (v.paused) { pauseAllExcept(v); v.play().catch(() => {}); setPlaying(p => ({ ...p, [i]: true })) }
    else          { v.pause(); setPlaying(p => ({ ...p, [i]: false })) }
  }

  const toggleMute = () => {
    setMuted(m => {
      const next = !m
      videoRefs.current.forEach(v => { if (v) v.muted = next })
      return next
    })
  }

  const [fsOpen,   setFsOpen]   = useState(false)
  const [fsTarget, setFsTarget] = useState(0)

  return (
    <>
      <FullscreenPortal
        isOpen={fsOpen} onClose={() => setFsOpen(false)}
        items={archiveItems} initialIndex={fsTarget}
        showNav initMuted={muted}
      />
      <div className="py-3 px-1">
        <div className="divide-y divide-red-950/22">
          {archiveItems.map((item, i) => {
            const isOpen = openItem === i
            const isPlay = playing[i] ?? false
            const thumb  = thumbnailMap[item.src]
            const fitStyle: React.CSSProperties["objectFit"] =
              horizontalVideos.has(item.src) ? "cover" : "contain"
            return (
              <div key={i}>
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <div className="flex items-center gap-5">
                    <span className="text-[9px] tracking-[0.45em] text-white/40 w-5 flex-shrink-0">0{i + 1}</span>
                    <span
                      className="text-sm tracking-[0.18em] uppercase transition-colors duration-300"
                      style={{ color: isOpen ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.38)" }}
                    >{item.title}</span>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-[9px] text-white/20 tracking-wider">{item.year}</span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown size={12} className="text-white/22"/>
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8">
                        <div
                          className="relative overflow-hidden border border-red-950/18 cursor-pointer"
                          style={{ maxWidth: "480px", aspectRatio: "16/9" }}
                          onClick={() => togglePlay(i)}
                        >
                          <video
                            ref={setRef(i)}
                            src={item.src}
                            muted={muted} loop playsInline preload="none"
                            className="w-full h-full object-cover pointer-events-none"
                            style={{ filter: "brightness(0.55)" }}
                            onPause={() => setPlaying(p => ({ ...p, [i]: false }))}
                          />

                          {/* Thumbnail — fades out when playing */}
                          <motion.img
                            src={thumb}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            style={{
                              objectFit: fitStyle,
                              filter: "brightness(0.55)",
                            }}
                            animate={{ opacity: isPlay ? 0 : 1 }}
                            transition={{ duration: 0.4 }}
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent pointer-events-none"/>
                          <div className="absolute bottom-3 left-4">
                            <p className="text-[8px] tracking-[0.4em] text-white/28 uppercase">{item.year}</p>
                          </div>
                          <div className="absolute top-3 right-3">
                            <VideoControls
                              playing={isPlay} muted={muted}
                              onPlay={() => togglePlay(i)}
                              onMute={toggleMute}
                              onFs={() => { setFsTarget(i); setFsOpen(true) }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

// ── Categories ────────────────────────────────────────────────────────────────
const categories = [
  { id: 1, label: "01", title: "CINEMATIC STORIES", Component: CinematicStories },
  { id: 2, label: "02", title: "FAST PACED",        Component: FastPacedCarousel },
  { id: 3, label: "03", title: "ATMOSPHERE",        Component: AtmosphereSlider  },
  { id: 4, label: "04", title: "ARCHIVE",           Component: ArchiveSection    },
]

// ── SelectedVisions ───────────────────────────────────────────────────────────
export default function SelectedVisions() {
  const [openId, setOpenId] = useState<number | null>(null)
  const toggle = (id: number) => setOpenId(prev => prev === id ? null : id)

  return (
    <section id="work" className="bg-black text-white relative overflow-hidden">
      <div className="relative h-px w-full">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-900/40 to-transparent"/>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[2px] w-24 bg-red-800/50 blur-[2px]"/>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-24 h-[400px] w-[500px] max-w-full -translate-x-1/2 rounded-full bg-red-950 opacity-[0.07] blur-[180px]"/>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
          className="pt-20 pb-14"
        >
          <h2 className="text-5xl font-extrabold leading-none tracking-tight text-white md:text-7xl lg:text-8xl">
            SELECTED<br/>
            <span className="text-red-700">VISIONS</span>
          </h2>
        </motion.div>

        <div className="border-t border-red-950/38">
          {categories.map((cat, idx) => {
            const isOpen = openId === cat.id
            return (
              <div key={cat.id} className="border-b border-red-950/38">
                <motion.button
                  className="w-full flex items-center justify-between py-7 md:py-9 text-left group"
                  onClick={() => toggle(cat.id)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-5 md:gap-10 min-w-0">
                    <span className="text-[10px] tracking-[0.5em] text-white/45 font-light flex-shrink-0">
                      {cat.label}
                    </span>
                    <h3
                      className="font-extrabold tracking-tight leading-none transition-colors duration-300 truncate"
                      style={{
                        fontSize: "clamp(1.4rem, 4vw, 3.5rem)",
                        color: isOpen ? "rgb(255,255,255)" : "rgba(255,255,255,0.40)",
                      }}
                    >{cat.title}</h3>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
                    className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 ml-4 transition-colors duration-300"
                    style={{
                      borderColor: isOpen ? "rgba(185,28,28,0.6)"  : "rgba(255,255,255,0.12)",
                      color:       isOpen ? "rgb(185,28,28)"        : "rgba(255,255,255,0.25)",
                    }}
                  >
                    <span className="text-xl font-thin select-none" style={{ lineHeight: 0.9 }}>+</span>
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      key={cat.id}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-10">
                        <cat.Component />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        <div className="py-20"/>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[200px] w-[400px] max-w-full -translate-x-1/2 rounded-full bg-red-950 opacity-[0.06] blur-[140px]"/>
    </section>
  )
}
