import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CartLineItem } from '@/features/cart/components/CartLineItem'
import { CartSummary } from '@/features/cart/components/CartSummary'
import { useCart } from '@/features/cart/context/CartContext'
import { createCheckoutSession } from '@/features/checkout/api/checkout.api'
import { ProductCard } from '@/features/products/components/ProductCard'
import { useProducts } from '@/features/products/hooks/useProducts'
import { StaggerReveal } from '@/shared/components/StaggerReveal'
import { useI18n } from '@/shared/i18n/i18n'

function itemKey(productId: string, size: string, color: string) {
  return `${productId}-${size}-${color}`
}

export function CartPage() {
  const { t } = useI18n()
  const { items, itemCount, subtotal, removeItem, updateQuantity } = useCart()
  const { products, loading } = useProducts()
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const catalogPreview = useMemo(() => {
    const inCart = new Set(items.map((i) => i.productId))
    return products.filter((p) => !inCart.has(p.id)).slice(0, 4)
  }, [items, products])

  async function handleCheckout() {
    if (items.length === 0) return
    setCheckoutError(null)
    setIsCheckingOut(true)
    try {
      const url = await createCheckoutSession(items)
      window.location.assign(url)
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed')
      setIsCheckingOut(false)
    }
  }

  const itemLabel =
    itemCount === 1 ? t('page.cart.itemSingular') : t('page.cart.itemPlural')

  return (
    <div className="w-full">
      <section className="mx-auto flex min-h-[calc(100vh-var(--header-height))] w-full max-w-6xl flex-col px-4 pb-12 pt-10 sm:px-6">
        <StaggerReveal index={0} className="shrink-0">
          <p className="text-xs tracking-[0.28em] text-muted">SOCIAL THINGS</p>
          <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
            {t('page.cart.title')}
          </h1>
          {itemCount > 0 && (
            <p className="mt-2 text-sm tracking-[0.18em] text-muted">
              {itemCount} {itemLabel}
            </p>
          )}
        </StaggerReveal>

        <StaggerReveal index={1} className="flex flex-1 flex-col">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
              <p className="font-display text-2xl tracking-tight sm:text-3xl">
                {t('page.cart.empty')}
              </p>
              <p className="mt-4 max-w-sm text-sm text-muted">{t('page.cart.emptyHint')}</p>
              <Link
                to="/product"
                className="mt-8 inline-block rounded-full border border-ink bg-ink px-8 py-3 text-sm font-medium tracking-[0.18em] text-canvas transition-opacity hover:opacity-90"
              >
                {t('page.cart.continue')}
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid flex-1 content-start gap-10 lg:grid-cols-[minmax(0,1fr)_min(100%,20rem)] lg:items-start">
              <ul className="divide-y divide-line border-t border-line">
                {items.map((item) => (
                  <CartLineItem
                    key={itemKey(item.productId, item.size, item.color)}
                    item={item}
                    onRemove={() => removeItem(item.productId, item.size, item.color)}
                    onUpdateQuantity={(qty) =>
                      updateQuantity(item.productId, item.size, item.color, qty)
                    }
                  />
                ))}
              </ul>

              <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
                <CartSummary
                  subtotal={subtotal}
                  checkoutError={checkoutError}
                  isCheckingOut={isCheckingOut}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          )}
        </StaggerReveal>
      </section>

      <section className="mx-auto min-h-[calc(100vh-var(--header-height))] w-full max-w-6xl px-4 pb-20 pt-6 sm:px-6">
        <StaggerReveal index={2} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.22em] text-muted">{t('page.cart.catalogEyebrow')}</p>
            <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
              {t('page.cart.catalogTitle')}
            </h2>
          </div>
          <Link
            to="/product"
            className="text-sm tracking-[0.16em] text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            {t('page.cart.viewAll')}
          </Link>
        </StaggerReveal>

        <StaggerReveal index={3}>
          {loading && <p className="text-center text-muted">{t('page.cart.loading')}</p>}

          {!loading && catalogPreview.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {catalogPreview.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && catalogPreview.length === 0 && (
            <p className="text-center text-sm text-muted">{t('page.cart.catalogEmpty')}</p>
          )}
        </StaggerReveal>
      </section>
    </div>
  )
}
