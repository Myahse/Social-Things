import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CartLineItem } from '@/features/cart/components/CartLineItem'
import { CartSummary } from '@/features/cart/components/CartSummary'
import { useAuth } from '@/features/account/context/AuthContext'
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
  const { items, itemCount, subtotal, removeItem, updateQuantity, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { products, loading } = useProducts()
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const productPreview = useMemo(() => {
    const inCart = new Set(items.map((i) => i.productId))
    return products.filter((p) => !inCart.has(p.id)).slice(0, 4)
  }, [items, products])

  async function handleCheckout() {
    if (!isAuthenticated) {
      navigate('/account?next=/cart')
      return
    }
    if (items.length === 0) return
    setCheckoutError(null)
    setIsCheckingOut(true)
    try {
      const result = await createCheckoutSession(items)
      clearCart()
      navigate(result.orderId ? `/order/${result.orderId}` : '/cart')
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed')
      setIsCheckingOut(false)
    }
  }

  const itemLabel =
    itemCount === 1 ? t('page.cart.itemSingular') : t('page.cart.itemPlural')

  return (
    <div className="w-full">
      <section className="mx-auto flex min-h-[calc(100dvh-var(--header-height)-var(--mobile-bottom-nav-height))] w-full max-w-6xl flex-col px-[var(--site-gutter)] pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-10 md:min-h-[calc(100vh-var(--header-height))]">
        <StaggerReveal index={0} className="shrink-0">
          <span className="tag-flash">
            <span>HEIST BAG</span>
          </span>
          <p className="eyebrow-cut mt-4">SOCIAL THINGS</p>
          <h1 className="slash-title slash-title-ink mt-4 text-3xl sm:text-4xl">
            {t('page.cart.title')}
          </h1>
          {itemCount > 0 && (
            <p className="mt-3 text-sm tracking-[0.18em] text-muted">
              {itemCount} {itemLabel}
            </p>
          )}
        </StaggerReveal>

        <StaggerReveal index={1} className="flex flex-1 flex-col">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
              <p className="slash-title slash-title-ink text-2xl sm:text-3xl">
                {t('page.cart.empty')}
              </p>
              <p className="mt-4 max-w-sm text-sm text-muted">{t('page.cart.emptyHint')}</p>
              <Link to="/product" className="btn-slam mt-8">
                <span>{t('page.cart.continue')}</span>
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

      <section className="mx-auto w-full max-w-6xl px-[var(--site-gutter)] pb-12 pt-4 sm:px-6 sm:pb-20 sm:pt-6">
        <StaggerReveal index={2} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.22em] text-muted">{t('page.cart.productsEyebrow')}</p>
            <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
              {t('page.cart.productsTitle')}
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

          {!loading && productPreview.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {productPreview.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          )}

          {!loading && productPreview.length === 0 && (
            <p className="text-center text-sm text-muted">{t('page.cart.productsEmpty')}</p>
          )}
        </StaggerReveal>
      </section>
    </div>
  )
}
