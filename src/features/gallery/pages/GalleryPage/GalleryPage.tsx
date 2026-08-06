import { useEffect, useMemo, useRef, useState } from 'react'
import {
  GALLERY_GROUPS,
  GALLERY_IMAGES,
  galleryGroupLabel,
} from '@/features/gallery/config/gallery-images'
import { SlamReveal } from '@/shared/components/SlamReveal'
import { StaggerReveal } from '@/shared/components/StaggerReveal'
import { useI18n } from '@/shared/i18n/i18n'

export function GalleryPage() {
  const { t } = useI18n()
  const images = GALLERY_IMAGES
  const groups = GALLERY_GROUPS
  const [active, setActive] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const visible = useMemo(
    () => (filter === 'all' ? images : images.filter((img) => img.group === filter)),
    [filter, images],
  )

  const filterLabel = filter === 'all' ? t('page.gallery.all') : galleryGroupLabel(filter)

  useEffect(() => {
    if (active == null && !filterOpen) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (active != null) setActive(null)
        else if (filterOpen) setFilterOpen(false)
        return
      }
      if (active == null || visible.length === 0) return
      if (e.key === 'ArrowRight') {
        setActive((i) => {
          if (i == null) return 0
          const idx = visible.findIndex((img) => img.src === images[i]?.src)
          const next = visible[(idx + 1 + visible.length) % visible.length]
          return images.findIndex((img) => img.src === next.src)
        })
      }
      if (e.key === 'ArrowLeft') {
        setActive((i) => {
          if (i == null) return 0
          const idx = visible.findIndex((img) => img.src === images[i]?.src)
          const prev = visible[(idx - 1 + visible.length) % visible.length]
          return images.findIndex((img) => img.src === prev.src)
        })
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [active, filterOpen, images, visible])

  function openImage(src: string) {
    setActive(images.findIndex((img) => img.src === src))
  }

  function stepVisible(delta: number) {
    if (active == null || visible.length === 0) return
    const currentSrc = images[active]?.src
    const idx = visible.findIndex((img) => img.src === currentSrc)
    const next = visible[(idx + delta + visible.length) % visible.length]
    setActive(images.findIndex((img) => img.src === next.src))
  }

  function applyFilter(next: string) {
    setFilter(next)
    setFilterOpen(false)
  }

  const activeVisibleIndex =
    active == null
      ? -1
      : visible.findIndex((img) => img.src === images[active]?.src)

  return (
    <div className="w-full">
      <section className="diag-stripes relative mx-auto min-h-[calc(100vh-var(--header-height))] w-full max-w-6xl px-[var(--site-gutter)] pb-10 pt-6 sm:pb-16 sm:pt-10">
        <div
          className="pointer-events-none absolute -left-10 top-20 hidden h-24 w-64 -rotate-6 bg-ink sm:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-8 bottom-32 hidden h-16 w-48 rotate-3 border-[3px] border-ink bg-bolt sm:block"
          aria-hidden
        />

        <StaggerReveal index={0}>
          <span className="tag-flash">
            <span>LOOKBOOK</span>
          </span>
          <p className="eyebrow-cut mt-3 sm:mt-4">SOCIAL THINGS</p>
          <h1 className="slash-title slash-title-ink mt-3 max-w-[min(100%,18rem)] text-[1.65rem] leading-none sm:mt-4 sm:max-w-none sm:text-5xl">
            {t('page.gallery.title')}
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted sm:mt-4 sm:text-base">
            {t('page.gallery.hint')}
          </p>
        </StaggerReveal>

        {groups.length > 0 && (
          <StaggerReveal index={1} className="mt-6 sm:mt-8">
            <button
              type="button"
              className="btn-slam inline-flex items-center gap-2 !px-4 !py-2.5"
              onClick={() => setFilterOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={filterOpen}
            >
              <span>
                {t('page.gallery.filter')} · {filterLabel}
              </span>
            </button>
          </StaggerReveal>
        )}

        <StaggerReveal index={1} className="mt-6 sm:mt-10">
          {images.length === 0 ? (
            <div className="border-[3px] border-ink bg-canvas p-6 shadow-[6px_6px_0_var(--color-ink)] sm:p-8 sm:shadow-[8px_8px_0_var(--color-ink)]">
              <p className="font-display text-sm tracking-[0.16em]">{t('page.gallery.empty')}</p>
              <p className="mt-3 text-sm text-muted">{t('page.gallery.emptyHint')}</p>
            </div>
          ) : (
            <div className="space-y-8 sm:space-y-12">
              {(filter === 'all' ? groups : groups.filter((g) => g.id === filter)).map((group) => (
                <section key={group.id} id={`gallery-${group.id}`}>
                  {filter === 'all' && (
                    <h2 className="slash-title slash-title-ink mb-4 text-lg sm:mb-5 sm:text-2xl">
                      {galleryGroupLabel(group.id)}
                    </h2>
                  )}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                    {group.images.map((image, index) => (
                      <SlamReveal
                        key={image.src}
                        variant="block"
                        delayMs={Math.min(index, 8) * 35}
                      >
                        <button
                          type="button"
                          className="group product-card-frame panel-cut-hard relative block w-full overflow-hidden border-[2.5px] border-ink bg-canvas text-left sm:border-[3px]"
                          onClick={() => openImage(image.src)}
                          aria-label={image.alt}
                        >
                          <div className="product-card-top pointer-events-none absolute inset-x-0 top-0 z-10 h-1.5 sm:h-2" />
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="aspect-[3/4] block w-full object-cover transition-transform duration-500 group-active:scale-[1.02] sm:aspect-auto sm:group-hover:scale-[1.03]"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="product-card-shine" aria-hidden />
                        </button>
                      </SlamReveal>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </StaggerReveal>
      </section>

      {filterOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/55"
          role="presentation"
          onClick={() => setFilterOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-filter-title"
            className="anim-slam-block w-full max-w-lg border-t-[3px] border-ink bg-canvas px-[var(--site-gutter)] pt-3 shadow-[0_-10px_0_var(--color-ink)] pb-[max(1rem,calc(var(--mobile-bottom-nav-height)+0.5rem))] md:pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 bg-ink" aria-hidden />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow-cut">{t('page.gallery.filter')}</p>
                <h2
                  id="gallery-filter-title"
                  className="mt-2 font-display text-xl tracking-[0.08em] uppercase"
                >
                  {t('page.gallery.filterTitle')}
                </h2>
                <p className="mt-2 text-sm text-muted">{t('page.gallery.filterHint')}</p>
              </div>
              <button
                type="button"
                className="btn-slam-outline !px-3 !py-2"
                onClick={() => setFilterOpen(false)}
              >
                <span>{t('page.gallery.close')}</span>
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3" role="listbox">
              <FilterOption
                label={t('page.gallery.all')}
                active={filter === 'all'}
                onClick={() => applyFilter('all')}
              />
              {groups.map((group) => (
                <FilterOption
                  key={group.id}
                  label={galleryGroupLabel(group.id)}
                  active={filter === group.id}
                  onClick={() => applyFilter(group.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {active != null && images[active] && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-ink/92"
          role="dialog"
          aria-modal="true"
          aria-label={t('page.gallery.title')}
          onClick={() => setActive(null)}
          onTouchStart={(e) => {
            touchStartX.current = e.changedTouches[0]?.clientX ?? null
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current
            touchStartX.current = null
            if (start == null) return
            const dx = (e.changedTouches[0]?.clientX ?? start) - start
            if (Math.abs(dx) < 48) return
            stepVisible(dx < 0 ? 1 : -1)
          }}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 sm:pt-4">
            <p className="font-display text-xs tracking-[0.18em] text-bolt uppercase">
              {activeVisibleIndex >= 0
                ? `${activeVisibleIndex + 1} / ${visible.length}`
                : null}
            </p>
            <button
              type="button"
              className="btn-slam !bg-bolt !px-3 !py-2 !text-ink"
              onClick={(e) => {
                e.stopPropagation()
                setActive(null)
              }}
            >
              <span>{t('page.gallery.close')}</span>
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-4">
            <img
              src={images[active].src}
              alt={images[active].alt}
              className="anim-slam-block max-h-full max-w-full border-[2.5px] border-bolt object-contain shadow-[6px_6px_0_#fff] sm:border-[3px] sm:shadow-[10px_10px_0_#fff]"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />
          </div>

          {visible.length > 1 && (
            <div
              className="flex shrink-0 items-center justify-center gap-3 px-3 pb-[max(1rem,calc(var(--mobile-bottom-nav-height)+0.35rem))] pt-3 sm:gap-4 sm:pb-6 md:pb-[max(1.25rem,env(safe-area-inset-bottom))]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="btn-slam min-h-11 min-w-14 !px-4 !py-2.5"
                onClick={() => stepVisible(-1)}
                aria-label="Previous"
              >
                <span>←</span>
              </button>
              <button
                type="button"
                className="btn-slam min-h-11 min-w-14 !px-4 !py-2.5"
                onClick={() => stepVisible(1)}
                aria-label="Next"
              >
                <span>→</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onClick={onClick}
      className={`min-h-12 border-[2.5px] border-ink px-3 py-3 text-left font-display text-xs tracking-[0.16em] uppercase transition-colors ${
        active
          ? 'bg-ink text-white shadow-[4px_4px_0_#fff]'
          : 'bg-canvas text-ink active:bg-ink active:text-white sm:hover:bg-ink sm:hover:text-white'
      }`}
      style={{ transform: 'skewX(-8deg)' }}
    >
      <span style={{ display: 'inline-block', transform: 'skewX(8deg)' }}>{label}</span>
    </button>
  )
}
