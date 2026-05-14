import { ArrowRight } from 'lucide-react'

interface FlowButtonProps {
  text?: string
  onClick?: () => void
  href?: string
  target?: string
  theme?: 'dark' | 'light'
}

export function FlowButton({
  text = 'Modern Button',
  onClick,
  href,
  target = '_blank',
  theme = 'dark',
}: FlowButtonProps) {
  const isLight = theme === 'light'

  const base =
    'group relative flex items-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] bg-transparent px-10 py-4 cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:rounded-[12px] active:scale-[0.95]'

  const borderCls = isLight ? 'border-[#333333]/40' : 'border-white/20'
  const hoverTextCls = isLight ? 'hover:text-white' : 'hover:text-black'

  const labelCls = isLight
    ? 'text-[#111111] group-hover:text-white'
    : 'text-white group-hover:text-black'

  const arrowRestCls   = isLight ? 'stroke-[#111111]' : 'stroke-white'
  const arrowHoverCls  = isLight ? 'group-hover:stroke-white' : 'group-hover:stroke-black'
  const circleBgCls    = isLight ? 'bg-[#111111]' : 'bg-white'

  const content = (
    <>
      <ArrowRight
        className={`absolute w-4 h-4 left-[-25%] fill-none z-[9] group-hover:left-5 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${arrowRestCls} ${arrowHoverCls}`}
      />
      <span
        className={`relative z-[1] text-[11px] font-semibold tracking-[0.25em] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out ${labelCls}`}
      >
        {text}
      </span>
      <span
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-[50%] opacity-0 group-hover:w-[320px] group-hover:h-[320px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${circleBgCls}`}
      />
      <ArrowRight
        className={`absolute w-4 h-4 right-5 fill-none z-[9] group-hover:right-[-25%] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${arrowRestCls} ${arrowHoverCls}`}
      />
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel="noopener noreferrer"
        className={`${base} ${borderCls} ${hoverTextCls}`}
      >
        {content}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={`${base} ${borderCls} ${hoverTextCls}`}>
      {content}
    </button>
  )
}
