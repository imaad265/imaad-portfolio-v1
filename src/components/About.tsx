import { motion } from "framer-motion"
import { ContainerScroll } from "./ui/container-scroll-animation"
import { TextRevealByWord } from "./ui/text-reveal"
import { MobileTextReveal } from "./ui/mobile-text-reveal"
import { FlowButton } from "./ui/flow-button"
import { SparklesCore } from "./ui/sparkles"

const ABOUT_TEXT =
  "I'm Abdul Khadir Imaad, a 21-year-old university student obsessed with cinematic storytelling and visual emotion. I didn't enter editing through industry experience or traditional pathways. I entered through curiosity, experimentation, and the constant desire to create something that feels alive. Every project becomes an opportunity to push atmosphere, pacing, tension, and emotion further. From raw visuals to immersive edits, my focus is building work that people don't just watch, they feel. I'm constantly learning, refining, and evolving my craft with the goal of creating visuals that leave lasting impact."

const pillars = [
  { label: "FOCUS", value: "Cinematic Storytelling" },
  { label: "STYLE", value: "Raw & Immersive" },
  { label: "MISSION", value: "Work That People Feel" },
]

export default function About() {
  const scrollToWork = () => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="about" className="bg-black text-white relative">

      {/* ── Sparkles background ───────────────────────────────────────────────
          absolute inset-0 z-0 — stays below every z-10 content layer.
          pointer-events-none so it never intercepts clicks or scroll.
          No overflow:hidden on the section — that would break the sticky
          text-reveal panel inside TextRevealByWord.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none"
        style={{ opacity: 0.62 }}
        aria-hidden="true"
      >
        <SparklesCore
          id="about-sparkles"
          background="transparent"
          minSize={0.3}
          maxSize={1.2}
          speed={0.35}
          particleColor="#ffffff"
          particleDensity={38}
          className="w-full h-full"
        />
      </div>

      {/* Cinematic section divider */}
      <div className="relative z-10 h-px w-full">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[2px] w-24 bg-red-800/50 blur-[2px]" />
      </div>

      {/* Ambient top glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[700px] w-[700px] max-w-full -translate-x-1/2 rounded-full bg-red-950 opacity-10 blur-[220px]" />

      {/* ── ContainerScroll entry ── */}
      <div className="relative z-10">
        <ContainerScroll
          titleComponent={
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="mb-5 text-[10px] tracking-[0.5em] text-white/25 uppercase">
                ABOUT
              </p>
              <h2 className="text-4xl font-extrabold leading-none tracking-tight text-white md:text-7xl lg:text-8xl">
                THE CRAFT
                <br />
                <span className="text-red-700">BEHIND</span>
                <br />
                THE EDIT
              </h2>
            </motion.div>
          }
        >
          {/* Card interior
              Mobile:  flex-col, items-start, justify-start — natural top-to-bottom stack
                       with mt-auto on the footer to pin it to the card bottom.
              Desktop: flex-row, items-center, justify-center — unchanged from before.
          */}
          <div className="relative flex h-full w-full flex-col items-start justify-start bg-[#080808] p-6 md:flex-row md:items-center md:justify-center md:p-16">
            {/* Corner glows */}
            <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-red-900 opacity-15 blur-[90px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-red-950 opacity-10 blur-[60px]" />

            {/* Left: identity */}
            <div className="z-10 md:flex-1">
              <p className="mb-2 md:mb-5 text-[10px] tracking-[0.5em] text-white/25 uppercase">
                Cinematic Editor
              </p>
              <h3 className="mb-3 md:mb-5 text-3xl md:text-5xl font-black leading-[1.05] tracking-tight text-white">
                ABDUL
                <br />
                KHADIR
                <br />
                IMAAD
              </h3>
              <p className="max-w-[220px] text-sm leading-[1.9] tracking-wide text-white/35">
                21 years old · University Student
                <br />
                Obsessed with visual emotion.
              </p>
            </div>

            {/* Vertical divider — desktop only */}
            <div className="hidden md:block h-40 w-px bg-gradient-to-b from-transparent via-red-900/30 to-transparent mx-12" />

            {/* Right: pillars — stacks below identity on mobile */}
            <div className="z-10 flex md:flex-1 flex-col gap-5 md:gap-7 mt-7 md:mt-0">
              {pillars.map((item) => (
                <div key={item.label} className="border-l border-red-900/40 pl-5 md:pl-6">
                  <p className="mb-1 text-[9px] tracking-[0.4em] text-white/20 uppercase">
                    {item.label}
                  </p>
                  <p className="text-sm md:text-lg font-semibold tracking-wider text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Cinematic subtext
                Mobile:  mt-auto pushes it to the bottom of the flex column naturally —
                         no overlap with content above.
                Desktop: absolute bottom-7, unchanged.
            */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.6, delay: 0.7 }}
              viewport={{ once: true }}
              className="mt-auto pt-5 md:mt-0 md:pt-0 md:absolute md:bottom-7 md:left-0 md:right-0 md:px-10 text-center text-[10px] font-light leading-[2.2] tracking-[0.18em] text-white/[0.38]"
            >
              Built with an iPhone 14 Pro&nbsp;&middot;&nbsp;driven by obsession, emotion, and the need to create something real.
            </motion.p>
          </div>
        </ContainerScroll>
      </div>

      {/* ── Text Reveal — desktop uses sticky scroll-progress, mobile uses scroll-driven ── */}
      <div className="relative z-10 hidden md:block">
        <TextRevealByWord text={ABOUT_TEXT} />
      </div>
      <div className="relative z-10 block md:hidden">
        <MobileTextReveal text={ABOUT_TEXT} />
      </div>

      {/* ── Flow Button CTA ── */}
      <div className="relative z-10 flex flex-col items-center gap-6 pb-32 pt-2 md:pt-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-[9px] tracking-[0.5em] text-white/20 uppercase"
        >
          Explore the work
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <FlowButton text="See My Work" onClick={scrollToWork} />
        </motion.div>
      </div>

      {/* Bottom ambient glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[400px] max-w-full -translate-x-1/2 rounded-full bg-red-950 opacity-[0.08] blur-[160px]" />
    </section>
  )
}
