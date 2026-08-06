import { Link } from 'react-router-dom'
import { ProductCard } from '@/features/products/components/ProductCard'
import type { Product } from '@/features/products/types'
import { SlamReveal } from '@/shared/components/SlamReveal'
import { StaggerReveal } from '@/shared/components/StaggerReveal'
import { useI18n } from '@/shared/i18n/i18n'

interface CollectionSectionProps {
  products: Product[]
  loading: boolean
  error: string | null
  fullScreen?: boolean
}

function CollectionHeader({
  title,
  hint,
  viewAll,
}: {
  title: string
  hint: string
  viewAll: string
}) {
  return (
    <div className="mb-[clamp(1.25rem,3vh,2.5rem)] flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <SlamReveal variant="tag">
          <span className="tag-flash">
            <span>TAKE YOUR HEART</span>
          </span>
        </SlamReveal>
        <SlamReveal variant="block" delayMs={80} className="mt-4">
          <p className="eyebrow-cut">DROP</p>
        </SlamReveal>
        <SlamReveal variant="title" delayMs={140} className="mt-4">
          <h2 className="slash-title slash-title-ink anim-glitch-idle text-3xl sm:text-4xl lg:text-5xl">
            {title}
          </h2>
        </SlamReveal>
        <SlamReveal variant="block" delayMs={220} className="mt-4 max-w-md">
          <p className="text-sm text-muted sm:text-base">{hint}</p>
        </SlamReveal>
      </div>
      <SlamReveal variant="block" delayMs={280} className="self-start sm:self-auto">
        <Link to="/product" className="btn-slam btn-slam-outline anim-pulse-ring shrink-0">
          <span>{viewAll}</span>
        </Link>
      </SlamReveal>
    </div>
  )
}

export function CollectionSection({
  products,
  loading,
  error,
  fullScreen = false,
}: CollectionSectionProps) {
  const { t } = useI18n()

  if (fullScreen) {
    return (
      <section
        id="products"
        className="diag-stripes anim-stripe-scroll relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden px-[var(--site-gutter)] py-[clamp(1.25rem,4vh,2.5rem)]"
      >
        <div
          className="pointer-events-none absolute -left-10 top-16 h-28 w-72 anim-shape-drift bg-ink"
          style={{ ['--p5-rot' as string]: '-6deg' }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-8 bottom-20 h-20 w-56 anim-shape-drift bg-bolt border-[3px] border-ink"
          style={{ ['--p5-rot' as string]: '3deg', animationDelay: '-2s' }}
          aria-hidden
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col">
          <StaggerReveal index={0}>
            <CollectionHeader
              title={t('page.products.title')}
              hint={t('page.products.hint')}
              viewAll={t('page.cart.viewAll')}
            />
          </StaggerReveal>

          <StaggerReveal index={1}>
            {loading && <p className="text-center text-muted">{t('page.products.loading')}</p>}
            {error && <p className="text-center text-sm text-ink">{error}</p>}
          </StaggerReveal>

          {!loading && (
            <StaggerReveal index={2}>
              <div className="grid grid-cols-2 gap-[clamp(0.75rem,2vw,1.5rem)] lg:grid-cols-3">
                {products.map((product, i) => (
                  <SlamReveal key={product.id} variant="block" delayMs={i * 70}>
                    <ProductCard product={product} compact />
                  </SlamReveal>
                ))}
              </div>
            </StaggerReveal>
          )}
        </div>
      </section>
    )
  }

  return (
    <section
      id="products"
      className="diag-stripes anim-stripe-scroll mx-auto min-h-[calc(100vh-var(--header-height))] w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6"
    >
      <StaggerReveal index={0}>
        <CollectionHeader
          title={t('page.products.title')}
          hint={t('page.products.hint')}
          viewAll={t('page.cart.viewAll')}
        />
      </StaggerReveal>

      <StaggerReveal index={1}>
        {loading && <p className="text-center text-muted">{t('page.products.loading')}</p>}
        {error && <p className="text-center text-sm text-ink">{error}</p>}
      </StaggerReveal>

      {!loading && (
        <StaggerReveal index={2}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, i) => (
              <SlamReveal key={product.id} variant="block" delayMs={i * 70}>
                <ProductCard product={product} />
              </SlamReveal>
            ))}
          </div>
        </StaggerReveal>
      )}
    </section>
  )
}
