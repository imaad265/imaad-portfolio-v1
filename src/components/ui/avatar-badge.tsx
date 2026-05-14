import icon from "../../assets/icon.png"

// Cinematic identity icon — static, no click, no animation.
// Plain circular image with persistent red glow. No Radix, no badge overlay.
export default function CinematicAvatarBadge() {
  return (
    <div
      className="select-none rounded-full overflow-hidden ring-[1px] ring-red-900/30 w-[36px] h-[36px] md:w-[42px] md:h-[42px] flex-shrink-0"
      style={{
        boxShadow:
          "0 0 10px 2px rgba(185,28,28,0.22), 0 2px 14px rgba(0,0,0,0.45)",
      }}
    >
      <img
        src={icon}
        alt="Imaad"
        className="w-full h-full object-cover object-[center_27%] brightness-[0.80] contrast-[1.08]"
      />
    </div>
  )
}
