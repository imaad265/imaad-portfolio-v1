import FlowArt, { FlowSection } from "./ui/story-scroll"
import { FlowButton } from "./ui/flow-button"
import { CinematicSocialIcons } from "./ui/social-icons"

const WHATSAPP_URL =
  "https://wa.me/971567759885?text=Hey%20Imaad,%20I%20saw%20your%20portfolio%20and%20wanted%20to%20connect."

const instagramAccounts = [
  {
    label: "Visual Archive",
    username: "@imaad.visuals",
    href: "https://instagram.com/imaad.visuals",
    primary: true,
  },
]

// ── Divider ───────────────────────────────────────────────────────────────────
const Divider = ({ color = "rgba(0,0,0,0.11)" }: { color?: string }) => (
  <div className="w-full h-px flex-shrink-0" style={{ backgroundColor: color }} />
)

// ── Contact ───────────────────────────────────────────────────────────────────
export default function Contact() {
  return (
    <FlowArt id="contact" aria-label="Contact">

      {/* ── Section 1: Dark bridge (pinned, visually extends the portfolio) ─── */}
      <FlowSection
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
        aria-label="Transition to Contact"
      >
        <Divider color="rgba(255,255,255,0.04)" />

        {/* Ghost heading — almost invisible, atmospheric */}
        <div className="flex-1 flex items-center">
          <h2
            className="font-black leading-none tracking-tighter select-none"
            style={{
              fontSize: "clamp(5rem,20vw,22rem)",
              color: "rgba(255,255,255,0.15)",
              letterSpacing: "-0.04em",
            }}
          >
            LET'S<br />TALK.
          </h2>
        </div>

        <Divider color="rgba(255,255,255,0.04)" />

        <p className="text-[9px] tracking-[0.45em] uppercase" style={{ color: "rgba(255,255,255,0.28)" }}>
          Scroll to connect
        </p>
      </FlowSection>

      {/* ── Section 2: Light editorial contact ──────────────────────────────── */}
      <FlowSection
        style={{ backgroundColor: "#f3f1ec", color: "#111111" }}
        aria-label="Contact information"
      >
        {/* IMAAD background watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
          aria-hidden="true"
        >
          <span
            className="font-black leading-none"
            style={{
              fontSize: "clamp(120px,26vw,400px)",
              opacity: 0.028,
              color: "#000",
              letterSpacing: "-0.03em",
            }}
          >
            IMAAD
          </span>
        </div>

        {/* Subtle top-center warm glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[180px] z-0"
          style={{ backgroundColor: "rgba(185,28,28,0.06)" }}
        />

        <Divider />

        {/* ── Main heading ── */}
        <div className="relative z-10">
          <h2
            className="font-black leading-[0.92] tracking-tighter"
            style={{
              fontSize: "clamp(2.6rem,8vw,9.5rem)",
              color: "#111111",
            }}
          >
            DON&apos;T JUST
            <br />
            WATCH.
            <br />
            <span style={{ color: "rgb(185,28,28)" }}>LET&apos;S CREATE</span>
            <br />
            <span style={{ color: "rgb(185,28,28)" }}>SOMETHING.</span>
          </h2>
        </div>

        <Divider />

        {/* ── Supporting text + CTA ── */}
        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p
            className="max-w-[34ch] font-light leading-[1.9] tracking-wide"
            style={{
              fontSize: "clamp(0.875rem,1.4vw,1.05rem)",
              color: "rgba(0,0,0,0.58)",
            }}
          >
            Tell me about your vision, your idea, or just say hi.
          </p>
          <FlowButton
            text="SEND A MESSAGE"
            href={WHATSAPP_URL}
            theme="light"
          />
        </div>

        <Divider />

        {/* ── Info grid: left labels / right values ── */}
        <div
          className="relative z-10 flex flex-col"
          style={{ borderColor: "rgba(0,0,0,0.07)" }}
        >
          {/* CONTACT */}
          <div
            className="flex flex-col gap-2 py-7 md:flex-row md:items-center md:justify-between md:gap-0"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
          >
            <h3
              className="font-extrabold tracking-tight"
              style={{
                fontSize: "clamp(1.5rem,3.5vw,3.2rem)",
                color: "rgba(0,0,0,0.18)",
              }}
            >
              CONTACT
            </h3>
            <a
              href="tel:+971567759885"
              className="font-light tracking-[0.18em] transition-colors duration-300"
              style={{
                fontSize: "clamp(0.85rem,1.2vw,1.05rem)",
                color: "rgba(0,0,0,0.65)",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(0,0,0,0.85)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(0,0,0,0.52)")}
            >
              +971 56 775 9885
            </a>
          </div>

          {/* LOCATION */}
          <div
            className="flex flex-col gap-2 py-7 md:flex-row md:items-center md:justify-between md:gap-0"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
          >
            <h3
              className="font-extrabold tracking-tight"
              style={{
                fontSize: "clamp(1.5rem,3.5vw,3.2rem)",
                color: "rgba(0,0,0,0.18)",
              }}
            >
              LOCATION
            </h3>
            <p
              className="font-light tracking-[0.18em]"
              style={{
                fontSize: "clamp(0.85rem,1.2vw,1.05rem)",
                color: "rgba(0,0,0,0.65)",
              }}
            >
              Dubai, UAE
            </p>
          </div>

          {/* SOCIALS */}
          <div className="flex flex-col gap-5 py-7 md:flex-row md:items-center md:justify-between md:gap-0">
            <h3
              className="font-extrabold tracking-tight"
              style={{
                fontSize: "clamp(1.5rem,3.5vw,3.2rem)",
                color: "rgba(0,0,0,0.18)",
              }}
            >
              SOCIALS
            </h3>
            <CinematicSocialIcons accounts={instagramAccounts} theme="light" />
          </div>
        </div>

        {/* ── Footer: copyright only ── */}
        <div className="relative z-10 flex justify-center pt-2">
          <p
            className="text-[9px] tracking-[0.42em] uppercase text-center"
            style={{ color: "rgba(0,0,0,0.30)" }}
          >
            © {new Date().getFullYear()} Abdul Khadir Imaad · All rights reserved
          </p>
        </div>
      </FlowSection>

    </FlowArt>
  )
}
