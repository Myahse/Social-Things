import elementBgUrl from '@/assets/element-bg.png'

interface HeroElementBgProps {
  className?: string
}

/** Full-viewport hero graphic — fixed behind header, side nav, and bottom chrome. */
export function HeroElementBg({ className = 'z-[5]' }: HeroElementBgProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-0 h-[100svh] overflow-hidden ${className}`}
      aria-hidden
    >
      <img
        src={elementBgUrl}
        alt=""
        draggable={false}
        className="h-full w-full object-contain object-center p-[clamp(1rem,4vw,3rem)]"
      />
    </div>
  )
}
