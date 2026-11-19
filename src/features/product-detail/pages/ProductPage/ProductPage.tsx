import { Suspense, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  AvatarTryOn,
  DEFAULT_MANNEQUIN,
  MANNEQUINS,
  MANNEQUIN_GROUPS,
  firstMannequinOf,
  mannequinById,
  type MannequinId,
} from '@/features/product-detail/components/AvatarTryOn'
import { useAuth } from '@/features/account/context/AuthContext'
import { useCart } from '@/features/cart/context/CartContext'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { useI18n } from '@/shared/i18n/i18n'
import { ProductImageSlider } from '@/features/products/components/ProductImageSlider'
import { useProduct } from '@/features/products/hooks/useProduct'
import { productGallery } from '@/features/products/utils/merge-product-assets'
const PRODUCT_LABEL_CLASS = 'font-display text-sm tracking-[0.18em]'
const PRODUCT_MICRO_CLASS = 'font-display text-xs tracking-[0.16em]'

/**
 * The ring composition needs room on both axes: the options sit on the circle left of the
 * product column and the choices on its right, and the buy row must stay above the fold.
 * Narrower or shorter screens (tablets, 1366×768 laptops) use the stacked panels instead. From 1200px the
 * left labels keep clear of the fixed side rail even with a long colour name.
 */
const RING_LAYOUT_MEDIA = '(min-width: 1200px) and (min-height: 860px)'
const PILL_CLASS = `rounded-full border px-3 py-2 ${'font-display text-xs tracking-[0.16em]'} transition-colors`

function pillState(active: boolean) {
  return active ? 'border-ink bg-ink text-canvas' : 'border-line bg-canvas/70 text-ink hover:border-ink'
}

/** Men / Women / Duo, then that group's looks. */
function AvatarPicker({
  mannequin,
  onChange,
  t,
}: {
  mannequin: MannequinId
  onChange: (id: MannequinId) => void
  t: ReturnType<typeof useI18n>['t']
}) {
  const current = mannequinById(mannequin)
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label={t('page.product.avatar')}>
        {MANNEQUIN_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => current.group !== g.id && onChange(firstMannequinOf(g.id))}
            aria-pressed={current.group === g.id}
            className={`${PILL_CLASS} ${pillState(current.group === g.id)}`}
          >
            {t(g.label)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {MANNEQUINS.filter((m) => m.group === current.group).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            aria-pressed={mannequin === m.id}
            className={`${PILL_CLASS} ${pillState(mannequin === m.id)}`}
          >
            {t(m.look)}
          </button>
        ))}
      </div>
    </div>
  )
}
/** Ring box: never taller than the space under the header. */
const RING_BOX_CLASS =
  'h-[min(86vmin,48rem,calc(100vh-var(--header-height)-1rem))] w-[min(86vmin,48rem,calc(100vh-var(--header-height)-1rem))]'

type SelectorKey = 'avatar' | 'color' | 'size' | 'quantity'

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
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()

  const colors = product?.colors ?? []
  const sizes = product?.sizes ?? []

  const [colorIndex, setColorIndex] = useState(0)
  const color = useMemo(() => colors[clampIndex(colorIndex, colors.length)] ?? '', [colors, colorIndex])

  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeSelector, setActiveSelector] = useState<SelectorKey | null>(null)
  /** Photo slider or the 3D mannequin wearing the product. */
  const [view, setView] = useState<'photo' | 'avatar'>('photo')
  const [mannequin, setMannequin] = useState<MannequinId>(DEFAULT_MANNEQUIN)

  useEffect(() => {
    // reset when product changes
    setColorIndex(0)
    setSize('')
    setQuantity(1)
    setAdded(false)
    setActiveSelector(null)
    setView('photo')
  }, [product?.id])

  const canBuy = Boolean(product && color && size && quantity > 0)
  const ringLayout = useMediaQuery(RING_LAYOUT_MEDIA)

  if (loading) {
    return (
      <div className="w-full">
        <section className="mx-auto flex min-h-[calc(100dvh-var(--header-height)-var(--mobile-bottom-nav-height))] w-full max-w-6xl items-center justify-center px-[var(--site-gutter)] md:min-h-[calc(100vh-var(--header-height))]">
          <p className="text-center text-muted">{t('page.product.loading')}</p>
        </section>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h1 className="slash-title slash-title-ink text-3xl">{t('page.product.notFound')}</h1>
        <p className="mt-4 text-sm text-muted">{t('page.product.notFoundHint')}</p>
        <Link to="/product" className="btn-slam mt-8">
          <span>{t('page.cart.continue')}</span>
        </Link>
      </div>
    )
  }

  const selectorTitle =
    activeSelector === 'color'
      ? t('page.product.chooseColor')
      : activeSelector === 'size'
        ? t('page.product.chooseSize')
        : activeSelector === 'quantity'
          ? t('page.product.chooseQuantity')
          : activeSelector === 'avatar'
            ? t('page.product.chooseAvatar')
            : t('page.product.selectOption')

  const avatarInfo = mannequinById(mannequin)
  const avatarGroupLabel = MANNEQUIN_GROUPS.find((g) => g.id === avatarInfo.group)?.label
  const avatarValue = `${avatarGroupLabel ? t(avatarGroupLabel) : ''} · ${t(avatarInfo.look)}`
  const preloadAvatar = () => void import('@/features/product-detail/components/AvatarTryOn/AvatarTryOn')

  return (
    <div className="w-full">
      {/* Section 1: must fill the viewport under header */}
      <section
        className={`relative mx-auto flex min-h-[calc(100dvh-var(--header-height)-var(--mobile-bottom-nav-height))] w-full max-w-6xl justify-center px-[var(--site-gutter)] md:min-h-[calc(100vh-var(--header-height))] md:px-6 ${
          ringLayout ? 'items-center py-0' : 'items-start py-6'
        }`}
      >
      {/* Ring — wide-and-tall composition only */}
      {ringLayout && (
        <div className={`pointer-events-none absolute left-1/2 top-1/2 ${RING_BOX_CLASS} -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-line/70`} />
      )}

      {/* Left labels — positioned on the circle arc */}
      {ringLayout && (
      <div className={`pointer-events-none absolute left-1/2 top-1/2 z-20 ${RING_BOX_CLASS} -translate-x-1/2 -translate-y-1/2`}>
        {(
          [
            { label: t('page.product.avatar'), key: 'avatar' as const, angleDeg: 225 },
            { label: t('page.product.color'), key: 'color' as const, angleDeg: 195 },
            { label: t('page.product.size'), key: 'size' as const, angleDeg: 165 },
            { label: t('page.product.quantity'), key: 'quantity' as const, angleDeg: 135 },
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
              className={`pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-4 ${PRODUCT_LABEL_CLASS} transition-colors ${
                activeSelector === item.key ? 'text-ink' : 'text-ink/75 hover:text-ink'
              }`}
              style={{ left: `calc(50% + ${x.toFixed(2)}%)`, top: `calc(50% + ${y.toFixed(2)}%)` }}
              onClick={() => {
                setActiveSelector(item.key)
                if (item.key === 'avatar') setView('avatar')
              }}
              onPointerEnter={item.key === 'avatar' ? preloadAvatar : undefined}
            >
              <span
                className={`h-4 w-4 rounded-full border transition-colors ${
                  activeSelector === item.key ? 'border-ink/35 bg-ink/25' : 'border-ink/15 bg-ink/10'
                }`}
                aria-hidden
              />
              <span className="flex items-baseline gap-3 whitespace-nowrap">
                <span>{item.label}</span>
                <span className={`text-ink/45 ${item.key === 'color' ? 'max-w-[8rem] truncate' : ''}`}>
                  {item.key === 'color'
                    ? color || '—'
                    : item.key === 'size'
                      ? size || '—'
                      : item.key === 'quantity'
                        ? String(quantity)
                        : avatarValue}
                </span>
              </span>
            </button>
          )
        })}
      </div>
      )}

      {/* Right side is intentionally "clean": it only shows options for the active selector. */}

      {/* Center product */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <h1 className="slash-title slash-title-ink text-[1.65rem] sm:text-4xl">{product.name}</h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{product.description}</p>
        {ringLayout && <div className={`mt-4 ${PRODUCT_LABEL_CLASS} text-muted`}>{selectorTitle}</div>}

        {/* Photo / Avatar */}
        <div className="mb-4 mt-4 flex justify-center gap-2" role="group" aria-label={t('page.product.avatar')}>
          {(
            [
              ['photo', 'page.product.photo'],
              ['avatar', 'page.product.avatar'],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                setView(v)
                if (v === 'avatar') setActiveSelector('avatar')
                else if (activeSelector === 'avatar') setActiveSelector(null)
              }}
              onPointerEnter={v === 'avatar' ? preloadAvatar : undefined}
              onFocus={v === 'avatar' ? preloadAvatar : undefined}
              aria-pressed={view === v}
              className={`${PILL_CLASS} !py-1.5 ${pillState(view === v)}`}
            >
              {t(label)}
            </button>
          ))}
        </div>

        <div className="relative mx-auto w-[min(78vw,18rem)]">
          {view === 'avatar' ? (
            <>
              <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-canvas/40 backdrop-blur-sm">
                <Suspense
                  fallback={
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted">
                      {t('page.product.avatarLoading')}
                    </div>
                  }
                >
                  <AvatarTryOn
                    mannequin={mannequin}
                    color={color}
                    prints={product.prints}
                    size={size}
                    className="h-full w-full"
                  />
                </Suspense>
              </div>
              <p className={`mt-3 ${PRODUCT_MICRO_CLASS} text-muted`}>{t('page.product.dragToTurn')}</p>
            </>
          ) : (
            <ProductImageSlider
              key={product.id}
              images={productGallery(product)}
              alt={product.name}
              objectFit="contain"
              showThumbs
              frameClassName="rounded-2xl bg-canvas/40 backdrop-blur-sm"
            />
          )}
        </div>

        {/* Color + Size + Quantity (stacked: phones, tablets, short laptops) */}
        {!ringLayout && (
        <div className="mt-6 w-full max-w-sm">
          <div className="flex flex-col gap-3">
            {colors.length > 0 && (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-canvas/60 px-4 py-3 backdrop-blur-md">
                <div className={`${PRODUCT_MICRO_CLASS} text-muted uppercase`}>{t('page.product.color')}</div>
                <div className="flex flex-wrap justify-end gap-2">
                  {colors.map((c, idx) => (
                    <button
                      key={`${c}-${idx}`}
                      type="button"
                      onClick={() => setColorIndex(idx)}
                      className={`relative h-10 w-10 rounded-full ${color === c ? 'scale-110' : ''}`}
                      aria-label={c}
                      aria-pressed={color === c}
                    >
                      <span
                        className="absolute inset-0 rounded-full border border-ink/15"
                        style={{ background: c }}
                        aria-hidden
                      />
                      {color === c && (
                        <span className="absolute -inset-1 rounded-full border border-ink/40" aria-hidden />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-canvas/60 px-4 py-3 backdrop-blur-md">
              <div className={`${PRODUCT_MICRO_CLASS} text-muted uppercase`}>{t('page.product.size')}</div>
              <div className="flex flex-wrap justify-end gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-h-10 min-w-10 rounded-full border px-3 py-2 ${PRODUCT_MICRO_CLASS} transition-colors ${
                      size === s ? 'border-ink bg-ink text-canvas' : 'border-line'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-line bg-canvas/60 px-4 py-3 backdrop-blur-md">
              <div className={`${PRODUCT_MICRO_CLASS} text-muted`}>{t('page.product.qty')}</div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-11 w-11 rounded-full border border-line bg-canvas/60 text-ink backdrop-blur-md"
                  aria-label={t('page.product.decreaseQuantity')}
                >
                  −
                </button>
                <div className="w-8 text-center text-base">{quantity}</div>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(9, q + 1))}
                  className="h-11 w-11 rounded-full border border-line bg-canvas/60 text-ink backdrop-blur-md"
                  aria-label={t('page.product.increaseQuantity')}
                >
                  +
                </button>
              </div>
            </div>

            {view === 'avatar' && (
              <div className="flex flex-col gap-3 rounded-2xl border border-line bg-canvas/60 px-4 py-3 backdrop-blur-md">
                <div className={`${PRODUCT_MICRO_CLASS} text-left text-muted uppercase`}>{t('page.product.avatar')}</div>
                <AvatarPicker mannequin={mannequin} onChange={setMannequin} t={t} />
              </div>
            )}
          </div>
        </div>
        )}

        <div className="mt-5 flex w-full flex-col items-stretch gap-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <div className="slash-title slash-title-bolt self-center text-3xl">${product.price}</div>
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                navigate(`/account?next=/product/${product.slug}`)
                return
              }
              if (!canBuy) return
              addItem(product, size, color)
              for (let i = 1; i < quantity; i++) addItem(product, size, color)
              setAdded(true)
              setTimeout(() => setAdded(false), 1500)
              navigate('/cart')
            }}
            disabled={isAuthenticated && !canBuy}
            className={`btn-slam ${PRODUCT_LABEL_CLASS} w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto`}
          >
            <span>
              {isAuthenticated
                ? added
                  ? t('page.product.added')
                  : t('page.product.buy')
                : t('page.product.signInToBuy')}
            </span>
          </button>
        </div>
      </div>

      {/* Right controls — swaps based on left-side selector */}
      {ringLayout && (
      <div className={`pointer-events-none absolute left-1/2 top-1/2 z-20 ${RING_BOX_CLASS} -translate-x-1/2 -translate-y-1/2`}>
        {activeSelector == null && (
          <div
            className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-2xl border border-line bg-canvas/70 px-5 py-3 ${PRODUCT_MICRO_CLASS} text-muted backdrop-blur-md`}
            style={ringPos(0, 54)}
          >
            {t('page.product.selectOnLeft')}
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
                    className={`rounded-full border px-4 py-2 ${PRODUCT_MICRO_CLASS} transition-colors ${
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
                    <div className={`rounded-full border border-line bg-canvas/70 px-5 py-2 text-base ${PRODUCT_LABEL_CLASS} text-ink backdrop-blur-md`}>
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
                      aria-label={
                        item.kind === 'minus'
                          ? t('page.product.decreaseQuantity')
                          : t('page.product.increaseQuantity')
                      }
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
          <div
            className="pointer-events-auto absolute w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-canvas/70 px-4 py-3 backdrop-blur-md"
            style={ringPos(0, 50)}
          >
            <AvatarPicker
              mannequin={mannequin}
              onChange={(id) => {
                setMannequin(id)
                setView('avatar')
              }}
              t={t}
            />
          </div>
        )}
      </div>
      )}
      </section>
    </div>
  )
}
