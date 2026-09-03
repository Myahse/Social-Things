import { Link } from 'react-router-dom'
import type { Product } from '@/features/products/types'

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const avatarImage = product.imageAvatar ?? product.image
  const hasAvatar = avatarImage !== product.image

  return (
    <div className="group">
      <Link
        to={`/product/${product.slug}`}
        className="product-card-frame panel-cut-hard relative block overflow-hidden border-[3px] border-ink bg-canvas"
      >
        {/* Top black slash */}
        <div className="product-card-top pointer-events-none absolute inset-x-0 top-0 z-20 h-2" />
        <div className="pointer-events-none absolute inset-x-0 top-2 z-20 h-0.5 origin-left scale-x-0 bg-ink/40 transition-transform duration-300 delay-75 group-hover:scale-x-100" />

        <div className="pointer-events-none absolute left-0 top-3 z-20 flex gap-1 p-2">
          <span className="tag-flash !px-2 !py-1 !text-[10px] !shadow-[3px_3px_0_var(--color-ink)] scale-75 opacity-100 transition-all duration-300 md:scale-50 md:opacity-0 md:group-hover:scale-100 md:group-hover:opacity-100">
            <span>SELECT</span>
          </span>
        </div>

        <div className="product-card-shine" aria-hidden />

        <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
          <img
            src={product.image}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out ${
              hasAvatar
                ? 'opacity-100 group-active:opacity-0 md:group-hover:opacity-0'
                : 'group-active:scale-105 md:group-hover:scale-110 md:group-hover:-rotate-1'
            }`}
          />
          {hasAvatar && (
            <img
              src={avatarImage}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover scale-105 opacity-0 transition-[opacity,transform] duration-500 ease-out group-active:scale-100 group-active:opacity-100 md:group-hover:scale-100 md:group-hover:opacity-100"
            />
          )}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                'linear-gradient(135deg, transparent 40%, color-mix(in srgb, var(--color-ink) 35%, transparent))',
            }}
            aria-hidden
          />
        </div>

        {/* Bottom black cut */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-3 origin-right scale-x-0 bg-ink transition-transform duration-300 delay-100 group-hover:scale-x-100"
          style={{ transformOrigin: 'right center', clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)' }}
          aria-hidden
        />
      </Link>

      <div className={compact ? 'mt-3' : 'mt-3'}>
        <div
          className="product-card-name inline-block border-2 border-ink bg-ink px-2 py-1 font-display text-xs tracking-[0.14em] text-white"
          style={{ transform: 'skewX(-8deg)' }}
        >
          <span style={{ display: 'inline-block', transform: 'skewX(8deg)' }}>{product.name}</span>
        </div>
        {!compact && (
          <div className="mt-2 text-sm font-light leading-relaxed text-muted">{product.description}</div>
        )}
      </div>
    </div>
  )
}
