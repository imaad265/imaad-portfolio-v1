import { motion, useMotionValue, useMotionTemplate } from "framer-motion"
import profile from "../assets/imaad.png"

export default function Hero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const maskImage = useMotionTemplate`
    radial-gradient(420px at ${mouseX}px ${mouseY}px, white, transparent)
  `

  return (
    <div
      onMouseMove={handleMouseMove}
      className="bg-black text-white relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* GRID */}
      <motion.div
        className="absolute inset-0 opacity-[0.22]"
        style={{ WebkitMaskImage: maskImage, maskImage }}
      >
        <div className="w-full h-full bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:40px_40px]" />
      </motion.div>

      {/* Mobile: solid black layer at the bottom of the hero section
          z-5 → above the grid (z-auto) but below all content (z-10).
          Through the transparent content div, this blocks the mouse-reactive
          grid from lighting up behind the description text on mobile. */}
      <div
        className="md:hidden absolute bottom-0 left-0 right-0 bg-black pointer-events-none"
        style={{ zIndex: 5, height: "28%" }}
      />

{/* CONTENT ─────────────────────────────────────────────────────────────
          Mobile:  flex-col, items stacked vertically (heading → image → desc)
          Desktop: flex-row, three-column layout (unchanged, perfect as-is)
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:justify-between px-6 md:px-16 gap-3 md:gap-0 pt-20 md:pt-0">

        {/* HEADING ── order-1 on mobile, right column on desktop */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="order-1 md:order-3 w-full md:w-[40%] text-center md:text-right md:pr-12"
        >
          {/*
            Mobile font reduced one step (30px) so the heading breathes
            on 320-375px screens. sm: and above restore the full sizes.
            Desktop (md:+) is untouched.
          */}
          <h1 className="text-[30px] sm:text-[44px] md:text-[58px] lg:text-[68px] font-extrabold leading-[1.05] tracking-tight md:whitespace-nowrap">
            RAW. CINEMATIC.
            <br />
            STORY DRIVEN.
          </h1>
        </motion.div>

        {/* CENTER IMAGE ── order-2 on both layouts
            Mobile fix: the container gets an explicit height cap (48vh / 54vh).
            This limits how much vertical space the portrait occupies in the
            flex column, keeping heading + description on-screen simultaneously.
            overflow-hidden clips the bottom of the portrait naturally —
            the same cinematic "clipped at the bottom" effect as desktop.

            Desktop: h-screen, absolute image, unchanged.
        */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className={[
            "order-2 w-full relative flex justify-center",
            // Mobile: fixed height so the column fits in one viewport
            "items-start overflow-hidden h-[48vh] sm:h-[54vh]",
            // Desktop: full height, image bleeds below (overflow clipped by section)
            "md:items-end md:overflow-visible md:h-screen",
          ].join(" ")}
        >
          {/* Red rim / glow — cinematic lighting under the portrait */}
          <div className="absolute bottom-0 w-[200px] h-[200px] md:w-[500px] md:h-[500px] bg-[#ff3b3b] rounded-full blur-[90px] md:blur-[140px] opacity-25 md:opacity-30 pointer-events-none" />

          {/*
            Mobile:  w-full h-full object-cover object-top
              → fills the 48vh container edge-to-edge, anchors the top of the
                image (face) to the top of the container so the face is always
                fully visible. Body clips into the section naturally.

            Desktop: md:absolute md:bottom-[-50px] md:w-[1000px] md:h-auto md:object-contain
              → original absolute positioning, unchanged.
          */}
          <img
            src={profile}
            alt="Imaad — cinematic editor"
            className="w-full h-full object-cover object-top md:w-[1000px] md:h-auto md:object-contain md:object-center md:absolute md:bottom-[-50px] max-w-none"
          />

          {/* Mobile: gradient fade over the portrait's bottom half.
              Sits inside the overflow-hidden container so it clips cleanly.
              absolute elements paint above in-flow content (the img) with no
              z-index needed. Fades transparent → near-black → pure black so
              the portrait dissolves into the section rather than hard-clipping. */}
          <div
            className="md:hidden absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: "58%",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 42%, rgba(0,0,0,0.85) 68%, #000 88%)",
            }}
          />
        </motion.div>

        {/* DESCRIPTION ── order-3 on mobile, left column on desktop */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="order-3 md:order-1 w-full md:w-[25%] text-center md:text-left text-white/38 text-[13px] sm:text-[14px] leading-[1.92] tracking-[0.07em] px-5 md:px-0"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
        >
          I'm Abdul Khadir Imaad, a video editor focused on cinematic storytelling,
          visual flow, and impactful content creation.
        </motion.div>

      </div>
    </div>
  )
}
