import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export type SocialAccount = {
  label: string
  username: string
  href: string
  primary?: boolean
}

const InstagramIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
)

interface SocialIconsProps {
  accounts: SocialAccount[]
  theme?: 'dark' | 'light'
}

export function CinematicSocialIcons({ accounts, theme = 'dark' }: SocialIconsProps) {
  const [hovered,  setHovered]  = useState<number | null>(null)
  const [tapReady, setTapReady] = useState<number | null>(null)

  const isLight = theme === 'light'
  const isVisible = (i: number) => hovered === i || tapReady === i

  const handleClick = (index: number, href: string) => {
    const isTouch = window.matchMedia("(hover: none)").matches
    if (isTouch) {
      if (tapReady === index) {
        window.open(href, "_blank", "noopener,noreferrer")
        setTapReady(null)
      } else {
        setTapReady(index)
      }
    } else {
      window.open(href, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="flex items-end gap-6">
      {accounts.map((account, index) => {
        const active    = isVisible(index)
        const isPrimary = !!account.primary

        // colour tokens that flip between themes
        const iconRestColor   = isLight ? "rgba(0,0,0,0.48)"  : "rgba(255,255,255,0.25)"
        const iconActiveColor = active
          ? isPrimary ? "rgb(185,28,28)" : isLight ? "rgba(0,0,0,0.78)" : "rgb(240,240,240)"
          : iconRestColor

        const labelRestColor   = isLight ? "rgba(0,0,0,0.42)" : "rgba(255,255,255,0.15)"
        const labelActiveColor = active
          ? isPrimary ? "rgba(185,28,28,0.72)" : isLight ? "rgba(0,0,0,0.52)" : "rgba(255,255,255,0.42)"
          : labelRestColor

        const borderRestColor = isLight ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.07)"
        const borderActiveColor = active
          ? isPrimary ? "rgba(185,28,28,0.5)" : isLight ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.18)"
          : borderRestColor

        const bgActiveColor = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.025)"

        // tooltip palette
        const tooltipBg      = isLight ? "#ffffff" : "#0a0a0a"
        const tooltipBorder  = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)"
        const tooltipCaret   = isLight ? "#ffffff" : "#0a0a0a"
        const tooltipCaretBorder = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)"
        const usernameColor  = isPrimary ? "rgb(185,28,28)" : isLight ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.82)"
        const sublabelColor  = isLight ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.28)"

        return (
          <div key={account.username} className="relative flex flex-col items-center gap-2.5">
            {/* Tooltip */}
            <AnimatePresence>
              {active && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.94 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute bottom-full mb-3.5 left-1/2 -translate-x-1/2 pointer-events-none z-30"
                >
                  <div
                    className="relative px-3.5 py-2 text-center whitespace-nowrap"
                    style={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                    }}
                  >
                    <p className="text-[11px] font-semibold tracking-widest" style={{ color: usernameColor }}>
                      {account.username}
                    </p>
                    <p className="text-[8px] tracking-[0.38em] uppercase mt-0.5" style={{ color: sublabelColor }}>
                      {account.label}
                    </p>
                    {/* Caret */}
                    <div
                      className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45"
                      style={{
                        backgroundColor: tooltipCaret,
                        borderRight: `1px solid ${tooltipCaretBorder}`,
                        borderBottom: `1px solid ${tooltipCaretBorder}`,
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Icon button */}
            <motion.button
              className="relative flex items-center justify-center w-11 h-11 rounded-full overflow-visible"
              style={{ border: `1px solid ${borderActiveColor}` }}
              animate={{ backgroundColor: active ? bgActiveColor : "rgba(0,0,0,0)" }}
              transition={{ duration: 0.25 }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(index, account.href)}
              aria-label={`${account.label} (${account.username}) on Instagram`}
            >
              {/* Primary halo on dark theme only */}
              {!isLight && isPrimary && active && (
                <div className="absolute inset-0 rounded-full bg-red-900/20 blur-md pointer-events-none" />
              )}

              <motion.span
                animate={{ color: iconActiveColor, scale: active ? 1.1 : 1 }}
                transition={{ duration: 0.25 }}
                className="relative flex items-center justify-center"
              >
                <InstagramIcon size={17} />
              </motion.span>
            </motion.button>

            {/* Label under icon */}
            <motion.p
              animate={{ color: labelActiveColor }}
              transition={{ duration: 0.25 }}
              className="text-[8px] tracking-[0.32em] uppercase"
            >
              {account.label}
            </motion.p>
          </div>
        )
      })}
    </div>
  )
}
