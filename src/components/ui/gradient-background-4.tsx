// Cinematic dark gradient backdrop for the Selected Work section.
// Drop inside any `relative overflow-hidden` parent as the first child.
// pointer-events-none keeps it fully transparent to interaction.
export function CinematicGradient() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none"
      style={{
        zIndex: 0,
        // Top-center radial bloom — ultra dark gray fading to pure black.
        // 125% × 125% so the gradient fully fills every viewport size.
        // Anchored at 50% -20% (slightly above center) for a top-light feel.
        background:
          "radial-gradient(125% 125% at 50% -20%, rgba(52,52,52,0.28) 0%, rgba(18,18,18,0.12) 38%, transparent 72%)",
      }}
    />
  )
}
