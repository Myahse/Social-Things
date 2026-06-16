import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCart } from '@/features/cart/context/CartContext'
import { useProduct } from '@/features/products/hooks/useProduct'
import { useProducts } from '@/features/products/hooks/useProducts'
import { ProductCard } from '@/features/products/components/ProductCard'
import { StaggerReveal } from '@/shared/components/StaggerReveal'

type SelectorKey = 'avatar' | 'color' | 'size' | 'quantity'

const RECENTS_KEY = 'social-things:recent-products'
const MAX_RECENTS = 8

function ringPos(angleDeg: number, radiusPct: number) {
  const rad = (angleDeg * Math.PI) / 180
  const x = radiusPct * Math.cos(rad)
  const y = radiusPct * Math.sin(rad)
  return {
    left: `calc(50% + ${x.toFixed(2)}%)`,
    top: `calc(50% + ${y.toFixed(2)}%)`,
  } as const
}

function clampIndex(idx: number, len: number) {
  if (len <= 0) return 0
  return ((idx % len) + len) % len
}

function Dot({
  value,
  active,
  onClick,
}: {
  value: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-10 w-10 rounded-full transition-transform ${
        active ? 'scale-110' : 'hover:scale-105'
      }`}
      aria-label={value}
    >
      <span
        className="absolute inset-0 rounded-full border border-ink/15"
        style={{ background: value }}
        aria-hidden
      />
      {active && <span className="absolute -inset-1 rounded-full border border-ink/35" aria-hidden />}
    </button>
  )
}

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { product, loading } = useProduct(slug)
  const { products: allProducts } = useProducts()
  const { addItem } = useCart()
  const navigate = useNavigate()

  const colors = product?.colors ?? []
  const sizes = product?.sizes ?? []

  const [colorIndex, setColorIndex] = useState(0)
  const color = useMemo(() => colors[clampIndex(colorIndex, colors.length)] ?? '', [colors, colorIndex])

  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeSelector, setActiveSelector] = useState<SelectorKey | null>(null)

  useEffect(() => {
    // reset when product changes
    setColorIndex(0)
    setSize('')
    setQuantity(1)
    setAdded(false)
    setActiveSelector(null)
  }, [product?.id])

  useEffect(() => {
    if (!product) return
    try {
      const raw = window.localStorage.getItem(RECENTS_KEY)
      const prev = raw ? (JSON.parse(raw) as string[]) : []
      const next = [product.slug, ...prev.filter((s) => s !== product.slug)].slice(0, MAX_RECENTS)
      window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
    } catch {
      // ignore storage issues
    }
  }, [product?.slug])

  const recentSlugs = useMemo(() => {
    try {
      const raw = window.localStorage.getItem(RECENTS_KEY)
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  }, [product?.slug])

  const recentProducts = useMemo(() => {
    if (!product) return []
    const bySlug = new Map(allProducts.map((p) => [p.slug, p]))
    return recentSlugs
      .filter((s) => s !== product.slug)
      .map((s) => bySlug.get(s))
      .filter((p): p is (typeof allProducts)[number] => Boolean(p))
      .slice(0, 6)
  }, [allProducts, recentSlugs, product])

  const moreProducts = useMemo(() => {
    if (!product) return []
    return allProducts.filter((p) => p.slug !== product.slug).slice(0, 12)
  }, [allProducts, product])

  const canBuy = Boolean(product && color && size && quantity > 0)

  if (loading) return null
  if (!product) return null

  const selectorTitle =
    activeSelector === 'color'
      ? 'Choose your color'
      : activeSelector === 'size'
        ? 'Choose your size'
        : activeSelector === 'quantity'
          ? 'Choose quantity'
          : activeSelector === 'avatar'
            ? 'Choose your avatar'
            : 'Select an option'

  return (
    <div className="w-full">
      <StaggerReveal index={0}>
      {/* Section 1: must fill the viewport under header */}
      <section className="relative mx-auto flex min-h-[calc(100vh-var(--header-height))] w-full max-w-6xl items-center justify-center px-4 py-0 sm:px-6">
      {/* Ring */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(86vmin,48rem)] w-[min(86vmin,48rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-line/70" />

      {/* Left labels — positioned on the circle arc */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden h-[min(86vmin,48rem)] w-[min(86vmin,48rem)] -translate-x-1/2 -translate-y-1/2 md:block">
        {(
          [
            { label: 'Avatar', key: 'avatar' as const, angleDeg: 235 },
            { label: 'Color', key: 'color' as const, angleDeg: 205 },
            { label: 'Size', key: 'size' as const, angleDeg: 155 },
            { label: 'Quantity', key: 'quantity' as const, angleDeg: 125 },
          ] as const
        ).map((item) => {
          // Position labels on the ring using polar coordinates (percent of ring box).
          const r = 48 // percent radius
          const rad = (item.angleDeg * Math.PI) / 180
          const x = r * Math.cos(rad)
          const y = r * Math.sin(rad)

          return (
            <button
              key={item.label}
              type="button"
              className={`pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-4 text-sm tracking-[0.22em] transition-colors ${
                activeSelector === item.key ? 'text-ink' : 'text-ink/75 hover:text-ink'
              }`}
              style={{ left: `calc(50% + ${x.toFixed(2)}%)`, top: `calc(50% + ${y.toFixed(2)}%)` }}
              onClick={() => setActiveSelector(item.key)}
            >
              <span
                className={`h-4 w-4 rounded-full border transition-colors ${
                  activeSelector === item.key ? 'border-ink/35 bg-ink/25' : 'border-ink/15 bg-ink/10'
                }`}
                aria-hidden
              />
              <span className="flex items-baseline gap-3 whitespace-nowrap">
                <span>{item.label}</span>
                <span className="text-ink/45">
                  {item.key === 'color'
                    ? color || '—'
                    : item.key === 'size'
                      ? size || '—'
                      : item.key === 'quantity'
                        ? String(quantity)
                        : '—'}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Right side is intentionally "clean": it only shows options for the active selector. */}

      {/* Center product */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-6 text-sm tracking-[0.22em] text-muted">{selectorTitle}</div>

        <div className="relative w-full">
          <div className="mx-auto aspect-[4/5] w-[min(72vw,18rem)] overflow-hidden rounded-2xl bg-canvas/40 backdrop-blur-sm">
            <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-12 w-12 overflow-hidden rounded-xl border border-line bg-canvas/50 backdrop-blur-sm"
              >
                <img src={product.image} alt="" className="h-full w-full object-contain opacity-90" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="text-3xl font-semibold">${product.price}</div>
          <button
            type="button"
            onClick={() => {
              if (!canBuy) return
              addItem(product, size, color)
              for (let i = 1; i < quantity; i++) addItem(product, size, color)
              setAdded(true)
              setTimeout(() => setAdded(false), 1500)
              navigate('/cart')
            }}
            disabled={!canBuy}
            className="rounded-full border border-ink bg-ink px-8 py-3 text-sm font-medium tracking-[0.22em] text-canvas transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            {added ? 'ADDED' : 'BUY'}
          </button>
        </div>

        {/* Size + Quantity (mobile/tablet) */}
        <div className="mt-8 w-full max-w-sm md:hidden">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-2xl border border-line bg-canvas/60 px-4 py-3 backdrop-blur-md">
              <div className="text-xs tracking-[0.22em] text-muted">SIZE</div>
              <div className="flex flex-wrap justify-end gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`rounded-full border px-4 py-2 text-xs tracking-[0.18em] transition-colors ${
                      size === s ? 'border-ink bg-ink text-canvas' : 'border-line hover:border-ink'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-line bg-canvas/60 px-4 py-3 backdrop-blur-md">
              <div className="text-xs tracking-[0.22em] text-muted">QTY</div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 rounded-full border border-line bg-canvas/60 text-ink backdrop-blur-md"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="w-8 text-center text-base">{quantity}</div>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(9, q + 1))}
                  className="h-10 w-10 rounded-full border border-line bg-canvas/60 text-ink backdrop-blur-md"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right controls — swaps based on left-side selector */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden h-[min(86vmin,48rem)] w-[min(86vmin,48rem)] -translate-x-1/2 -translate-y-1/2 md:block">
        {activeSelector == null && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-canvas/70 px-5 py-3 text-xs tracking-[0.22em] text-muted backdrop-blur-md"
            style={ringPos(0, 54)}
          >
            SELECT ON LEFT
          </div>
        )}
        {activeSelector === 'color' && (
          <>
            {/* Colors on curve */}
            <div className="absolute inset-0">
              {colors.slice(0, 9).map((c, idx) => {
                const span = Math.max(1, Math.min(colors.length - 1, 8))
                const start = -62
                const end = 62
                const t = colors.length === 1 ? 0.5 : idx / span
                const angleDeg = start + (end - start) * t
                return (
                  <div
                    key={`${c}-${idx}`}
                    className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
                    style={ringPos(angleDeg, 54)}
                  >
                    <Dot value={c} active={c === color} onClick={() => setColorIndex(idx)} />
                  </div>
                )
              })}
            </div>
          </>
        )}

        {activeSelector === 'size' && (
          <div className="absolute inset-0">
            {sizes.slice(0, 9).map((s, idx) => {
              const span = Math.max(1, Math.min(sizes.length - 1, 8))
              const start = -58
              const end = 58
              const t = sizes.length === 1 ? 0.5 : idx / span
              const angleDeg = start + (end - start) * t
              return (
                <div
                  key={s}
                  className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
                  style={ringPos(angleDeg, 54)}
                >
                  <button
                    type="button"
                    onClick={() => setSize(s)}
                    className={`rounded-full border px-4 py-2 text-xs tracking-[0.18em] transition-colors ${
                      size === s
                        ? 'border-ink bg-ink text-canvas'
                        : 'border-line bg-canvas/70 text-ink backdrop-blur-md hover:border-ink'
                    }`}
                  >
                    {s}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {activeSelector === 'quantity' && (
          <div className="absolute inset-0">
            {(
              [
                { kind: 'minus' as const, angleDeg: -30 },
                { kind: 'value' as const, angleDeg: 0 },
                { kind: 'plus' as const, angleDeg: 30 },
              ] as const
            ).map((item) => {
              return (
                <div
                  key={item.kind}
                  className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
                  style={ringPos(item.angleDeg, 54)}
                >
                  {item.kind === 'value' ? (
                    <div className="rounded-full border border-line bg-canvas/70 px-5 py-2 text-base tracking-[0.22em] text-ink backdrop-blur-md">
                      {quantity}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) =>
                          item.kind === 'minus' ? Math.max(1, q - 1) : Math.min(9, q + 1),
                        )
                      }
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-canvas/70 text-xl text-ink backdrop-blur-md transition-colors hover:bg-canvas"
                      aria-label={item.kind === 'minus' ? 'Decrease quantity' : 'Increase quantity'}
                    >
                      {item.kind === 'minus' ? '−' : '+'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {activeSelector === 'avatar' && (
          <div className="absolute inset-0">
            {(['A', 'B', 'C', 'D', 'E'] as const).map((id, idx) => {
              const r = 54
              const span = 4
              const start = -62
              const end = 62
              const t = idx / span
              const angleDeg = start + (end - start) * t
              return (
                <button
                  key={id}
                  type="button"
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-canvas/70 px-4 py-3 text-xs tracking-[0.22em] text-ink backdrop-blur-md transition-colors hover:bg-canvas"
                  style={ringPos(angleDeg, r)}
                >
                  {id}
                </button>
              )
            })}
          </div>
        )}
      </div>
      </section>
      </StaggerReveal>

      <StaggerReveal index={1}>
      {/* Section 2: other products + recently visited */}
      <section className="mx-auto min-h-[calc(100vh-var(--header-height))] w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        {recentProducts.length > 0 && (
          <div>
            <div className="mb-4 text-xs tracking-[0.22em] text-muted">RECENTLY VIEWED</div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        <div className={recentProducts.length > 0 ? 'mt-12' : ''}>
          <div className="mb-4 text-xs tracking-[0.22em] text-muted">MORE FROM THE CATALOG</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {moreProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
      </StaggerReveal>
    </div>
  )
}
