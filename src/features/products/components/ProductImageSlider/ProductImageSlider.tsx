import { useCallback, useRef, useState } from 'react'

const SWIPE_PX = 40

type ProductImageSliderProps = {
  images: string[]
  alt: string
  objectFit?: 'cover' | 'contain'
  showThumbs?: boolean
  frameClassName?: string
  hoverFlip?: boolean
  onActivate?: () => void
}

export function ProductImageSlider({
  images,
  alt,
  objectFit = 'cover',
  showThumbs = false,
  frameClassName = '',
  hoverFlip = false,
  onActivate,
}: ProductImageSliderProps) {
  const count = images.length
  const [index, setIndex] = useState(0)
  const [peek, setPeek] = useState(false)
  const startX = useRef<number | null>(null)
  const swiped = useRef(false)
  const baseIndex = count === 0 ? 0 : ((index % count) + count) % count
  const safeIndex = peek && count > 1 ? (baseIndex + 1) % count : baseIndex

  const go = useCallback(
    (dir: -1 | 1) => {
      if (count <= 1) return
      setIndex((i) => (i + dir + count) % count)
    },
    [count],
  )

  function pointerDown(clientX: number) {
    startX.current = clientX
    swiped.current = false
  }

  function pointerUp(clientX: number) {
    const start = startX.current
    startX.current = null
    if (start == null) return
    const delta = clientX - start
    if (count > 1 && Math.abs(delta) >= SWIPE_PX) {
      swiped.current = true
      go(delta < 0 ? 1 : -1)
      return
    }
    if (onActivate && Math.abs(delta) < SWIPE_PX) {
      onActivate()
    }
  }

  if (count === 0) {
    return <div className={`relative aspect-[4/5] w-full bg-ink/5 ${frameClassName}`} />
  }

  const fitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover'

  return (
    <div className="flex w-full flex-col">
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden bg-ink/5 touch-pan-y ${frameClassName}`}
        onTouchStart={(e) => {
          if ((e.target as HTMLElement).closest('button')) return
          pointerDown(e.changedTouches[0]?.clientX ?? 0)
        }}
        onTouchEnd={(e) => {
          if ((e.target as HTMLElement).closest('button')) return
          pointerUp(e.changedTouches[0]?.clientX ?? 0)
        }}
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest('button')) return
          setPeek(false)
          pointerDown(e.clientX)
        }}
        onMouseUp={(e) => {
          if ((e.target as HTMLElement).closest('button')) return
          pointerUp(e.clientX)
        }}
        onMouseEnter={() => {
          if (hoverFlip && count > 1) setPeek(true)
        }}
        onMouseLeave={() => {
          setPeek(false)
          startX.current = null
        }}
        role={onActivate ? 'link' : undefined}
        tabIndex={onActivate || count > 1 ? 0 : undefined}
        aria-label={alt}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(1)
          else if (e.key === 'ArrowLeft') go(-1)
          else if (onActivate && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onActivate()
          }
        }}
      >
        <div
          className="absolute inset-0 flex will-change-transform transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {images.map((src, i) => (
            <img
              key={`${src}-${i}`}
              src={src}
              alt={i === safeIndex ? alt : ''}
              draggable={false}
              className={`h-full w-full min-w-full shrink-0 select-none ${fitClass}`}
            />
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-ink/20 bg-canvas/80 text-sm backdrop-blur-sm md:flex"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation()
                go(-1)
              }}
            >
              ‹
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-ink/20 bg-canvas/80 text-sm backdrop-blur-sm md:flex"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation()
                go(1)
              }}
            >
              ›
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-3 z-30 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Photo ${i + 1}`}
                  className={`pointer-events-auto h-1.5 rounded-full transition-all ${
                    i === safeIndex ? 'w-5 bg-ink' : 'w-1.5 bg-ink/35'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setIndex(i)
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showThumbs && count > 1 && (
        <div className="mt-5 hidden items-center justify-center gap-3 md:flex">
          {images.map((src, i) => (
            <button
              key={`${src}-thumb-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-12 w-12 overflow-hidden rounded-xl border bg-canvas/50 backdrop-blur-sm ${
                i === safeIndex ? 'border-ink' : 'border-line'
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-contain opacity-90" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
