import { useState, useEffect, useCallback } from "react"
import CinematicAvatarBadge from "./ui/avatar-badge"

const navLinks = [
  { label: "ABOUT",   target: "about"   },
  { label: "WORK",    target: "work"    },
  { label: "CONTACT", target: "contact" },
] as const

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active,   setActive]   = useState("")

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32)

      // Walk sections in reverse; first whose top has cleared the
      // navbar baseline (~88px) becomes the active link.
      let found = ""
      for (const { target } of [...navLinks].reverse()) {
        const el = document.getElementById(target)
        if (el && el.getBoundingClientRect().top <= 88) {
          found = target
          break
        }
      }
      setActive(found)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }, [])

  return (
    <header
      className={[
        "fixed top-0 left-0 w-full z-40 text-white",
        "transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-out",
        scrolled
          ? "bg-black/55 backdrop-blur-[10px] border-b border-white/[0.05] shadow-[0_1px_28px_rgba(0,0,0,0.28)]"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      <div className="relative w-full flex items-center justify-between px-6 md:px-12 py-6 text-sm tracking-widest">
        {/* Wordmark */}
        <span className="font-bold select-none">IMAAD.</span>

        {/* Avatar — mobile: flex child aligned to the right
                     desktop: absolute, horizontally centred */}
        <div className="md:hidden flex-shrink-0">
          <CinematicAvatarBadge />
        </div>
        <div className="hidden md:block absolute left-1/2 top-3 -translate-x-1/2">
          <CinematicAvatarBadge />
        </div>

        {/* Nav links — desktop only */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Portfolio navigation">
          {navLinks.map(({ label, target }) => (
            <button
              key={target}
              onClick={() => scrollTo(target)}
              className={[
                "bg-transparent border-0 p-0 cursor-pointer text-sm tracking-widest text-white",
                "transition-opacity duration-300 hover:opacity-100",
                active === target ? "opacity-100" : "opacity-55",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
