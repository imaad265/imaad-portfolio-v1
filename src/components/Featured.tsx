import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const projects = [
  { title: "Travel Reel",     video: "/videos/video1.MP4" },
  { title: "Cinematic Story", video: "/videos/video2.MP4" },
  { title: "Visual Edit",     video: "/videos/video3.MP4" },
  { title: "Promo Edit",      video: "/videos/video4.MP4" },
]

function SoundOnIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}

function SoundOffIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

export default function Featured() {
  const [active, setActive]   = useState<number | null>(null)
  const [soundOn, setSoundOn] = useState<boolean[]>(projects.map(() => false))
  const videoRefs = useRef<HTMLVideoElement[]>([])

  const handleEnter = (index: number) => {
    setActive(index)
    videoRefs.current[index]?.play()
  }

  const handleLeave = (index: number) => {
    setActive(null)
    const video = videoRefs.current[index]
    if (video) { video.pause(); video.currentTime = 0; video.muted = true }
    setSoundOn(prev => prev.map((v, i) => (i === index ? false : v)))
  }

  const handleSoundToggle = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    const video = videoRefs.current[index]
    if (!video) return
    const nextSoundOn = !soundOn[index]
    videoRefs.current.forEach((v, i) => { if (v) v.muted = i !== index || !nextSoundOn })
    setSoundOn(prev => prev.map((_, i) => (i === index ? nextSoundOn : false)))
  }

  return (
    <div id="featured" className="bg-black text-white min-h-screen flex flex-col justify-center px-16">

      <h2 className="text-3xl font-semibold mb-12 tracking-wide">
        Selected Work
      </h2>

      <div className="flex w-full h-[65vh] gap-4">
        {projects.map((item, index) => (
          <div
            key={index}
            onMouseEnter={() => handleEnter(index)}
            onMouseLeave={() => handleLeave(index)}
            className={`relative overflow-hidden rounded-xl transition-all duration-500 ${
              active === index ? "flex-[3]" : "flex-[1]"
            }`}
          >
            <video
              ref={(el) => { if (el) videoRefs.current[index] = el }}
              src={item.video}
              muted
              loop
              playsInline
              className="w-full h-full object-contain bg-black"
            />

            <div className="absolute inset-0 bg-black/40" />

            <AnimatePresence>
              {active === index && (
                <motion.button
                  key="sound-btn"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  onClick={(e) => handleSoundToggle(e, index)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                  aria-label={soundOn[index] ? "Mute" : "Unmute"}
                >
                  <motion.span
                    key={soundOn[index] ? "on" : "off"}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {soundOn[index] ? <SoundOnIcon /> : <SoundOffIcon />}
                  </motion.span>
                </motion.button>
              )}
            </AnimatePresence>

            <div className="absolute bottom-6 left-6 text-sm font-medium tracking-wide">
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
