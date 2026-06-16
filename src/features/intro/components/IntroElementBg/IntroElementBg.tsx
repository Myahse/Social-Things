import elementBgUrl from '@/assets/element-bg.png'

const DECORATIONS = [
  { className: 'left-[4%] top-[8%] h-28 w-28 -rotate-12 sm:h-36 sm:w-36', opacity: 0.14 },
  { className: 'right-[6%] top-[14%] h-24 w-24 rotate-[18deg] sm:h-32 sm:w-32', opacity: 0.1 },
  { className: 'left-[10%] bottom-[18%] h-32 w-32 rotate-6 sm:h-40 sm:w-40', opacity: 0.12 },
  { className: 'right-[8%] bottom-[12%] h-36 w-36 -rotate-[14deg] sm:h-44 sm:w-44', opacity: 0.11 },
  { className: 'left-1/2 top-[4%] h-20 w-20 -translate-x-1/2 rotate-45 sm:h-28 sm:w-28', opacity: 0.08 },
  { className: 'left-[42%] bottom-[6%] h-24 w-24 -rotate-6 sm:h-32 sm:w-32', opacity: 0.09 },
] as const

interface IntroElementBgProps {
  className?: string
}

export function IntroElementBg({ className = 'z-0' }: IntroElementBgProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {DECORATIONS.map((item, index) => (
        <img
          key={index}
          src={elementBgUrl}
          alt=""
          draggable={false}
          className={`absolute object-contain ${item.className}`}
          style={{ opacity: item.opacity }}
        />
      ))}
    </div>
  )
}
