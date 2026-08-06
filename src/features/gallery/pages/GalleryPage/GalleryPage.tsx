import { useEffect, useMemo, useState } from 'react'
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

  const visible = useMemo(
    () => (filter === 'all' ? images : images.filter((img) => img.group === filter)),
    [filter, images],
  )

  useEffect(() => {
    if (active == null) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setActive(null)
      if (visible.length === 0) return
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
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, images, visible])

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

  return (
    <div className="w-full">
      <section className="diag-stripes relative mx-auto min-h-[calc(100vh-var(--header-height))] w-full max-w-6xl px-[var(--site-gutter)] pb-16 pt-10">
        <div
          className="pointer-events-none absolute -left-10 top-20 h-24 w-64 -rotate-6 bg-ink"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-8 bottom-32 h-16 w-48 rotate-3 border-[3px] border-ink bg-bolt"
          aria-hidden
        />

        <StaggerReveal index={0}>
          <span className="tag-flash">
            <span>LOOKBOOK</span>
          </span>
          <p className="eyebrow-cut mt-4">SOCIAL THINGS</p>
          <h1 className="slash-title slash-title-ink mt-4 text-3xl sm:text-5xl">
            {t('page.gallery.title')}
          </h1>
          <p className="mt-4 max-w-lg text-sm text-muted sm:text-base">{t('page.gallery.hint')}</p>
        </StaggerReveal>

        {groups.length > 0 && (
          <StaggerReveal index={1} className="mt-8 flex flex-wrap gap-2">
            <FilterChip
              label={t('page.gallery.all')}
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            />
            {groups.map((group) => (
              <FilterChip
                key={group.id}
                label={galleryGroupLabel(group.id)}
                active={filter === group.id}
                onClick={() => setFilter(group.id)}
              />
            ))}
          </StaggerReveal>
        )}

        <StaggerReveal index={1} className="mt-10">
          {images.length === 0 ? (
            <div className="border-[3px] border-ink bg-canvas p-8 shadow-[8px_8px_0_var(--color-ink)]">
              <p className="font-display text-sm tracking-[0.16em]">{t('page.gallery.empty')}</p>
              <p className="mt-3 text-sm text-muted">{t('page.gallery.emptyHint')}</p>
            </div>
          ) : (
            <div className="space-y-12">
              {(filter === 'all' ? groups : groups.filter((g) => g.id === filter)).map((group) => (
                <section key={group.id} id={`gallery-${group.id}`}>
                  {filter === 'all' && (
                    <h2 className="slash-title slash-title-ink mb-5 text-xl sm:text-2xl">
                      {galleryGroupLabel(group.id)}
                    </h2>
                  )}
                  <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                    {group.images.map((image, index) => (
                      <SlamReveal
                        key={image.src}
                        variant="block"
                        delayMs={index * 40}
                        className="mb-4 break-inside-avoid"
                      >
                        <button
                          type="button"
                          className="group product-card-frame panel-cut-hard relative block w-full overflow-hidden border-[3px] border-ink bg-canvas text-left"
                          onClick={() => openImage(image.src)}
                          aria-label={image.alt}
                        >
                          <div className="product-card-top pointer-events-none absolute inset-x-0 top-0 z-10 h-2" />
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="block w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            loading="lazy"
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

      {active != null && images[active] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t('page.gallery.title')}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="btn-slam absolute right-4 top-4 !bg-bolt !text-ink"
            onClick={() => setActive(null)}
          >
            <span>{t('page.gallery.close')}</span>
          </button>

          {visible.length > 1 && (
            <>
              <button
                type="button"
                className="btn-slam absolute left-4 top-1/2 -translate-y-1/2"
                onClick={(e) => {
                  e.stopPropagation()
                  stepVisible(-1)
                }}
              >
                <span>←</span>
              </button>
              <button
                type="button"
                className="btn-slam absolute right-4 top-1/2 -translate-y-1/2"
                onClick={(e) => {
                  e.stopPropagation()
                  stepVisible(1)
                }}
              >
                <span>→</span>
              </button>
            </>
          )}

          <img
            src={images[active].src}
            alt={images[active].alt}
            className="anim-slam-block max-h-[85vh] max-w-[min(96vw,56rem)] border-[3px] border-bolt object-contain shadow-[10px_10px_0_#fff]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

function FilterChip({
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
      onClick={onClick}
      className={`border-[2.5px] border-ink px-3 py-1.5 font-display text-xs tracking-[0.18em] uppercase transition-colors ${
        active ? 'bg-ink text-white' : 'bg-canvas text-ink hover:bg-ink hover:text-white'
      }`}
      style={{ transform: 'skewX(-10deg)' }}
    >
      <span style={{ display: 'inline-block', transform: 'skewX(10deg)' }}>{label}</span>
    </button>
  )
}
