import { Link, useNavigate } from 'react-router-dom'
import { ProductImageSlider } from '@/features/products/components/ProductImageSlider'
import type { Product } from '@/features/products/types'
import { productGallery } from '@/features/products/utils/merge-product-assets'

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const navigate = useNavigate()
  const images = productGallery(product)
  const href = `/product/${product.slug}`

  return (
    <div className="group">
      <div className="product-card-frame panel-cut-hard relative overflow-hidden border-[3px] border-ink bg-canvas shadow-[5px_5px_0_var(--color-ink)]">
        {/* Top black slash */}
        <div className="product-card-top pointer-events-none absolute inset-x-0 top-0 z-20 h-2" />
        <div className="pointer-events-none absolute inset-x-0 top-2 z-20 h-0.5 origin-left scale-x-0 bg-ink/40 transition-transform duration-300 delay-75 group-hover:scale-x-100" />

        <div className="pointer-events-none absolute left-0 top-3 z-20 flex gap-1 p-2">
          <span className="tag-flash !px-2 !py-1 !text-[10px] !shadow-[3px_3px_0_var(--color-ink)] scale-75 opacity-100 transition-all duration-300 md:scale-50 md:opacity-0 md:group-hover:scale-100 md:group-hover:opacity-100">
            <span>SELECT</span>
          </span>
        </div>

        <div className="product-card-shine" aria-hidden />

        <ProductImageSlider
          images={images}
          alt={product.name}
          objectFit="cover"
          hoverFlip
          onActivate={() => navigate(href)}
        />

        {/* Bottom black cut */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-3 origin-right scale-x-0 bg-ink transition-transform duration-300 delay-100 group-hover:scale-x-100"
          style={{ transformOrigin: 'right center', clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)' }}
          aria-hidden
        />
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-2">
          <p className="shrink-0 font-display text-sm tracking-[0.12em] text-ink">${product.price}</p>
          <Link
            to={href}
            className="product-card-name inline-block border-2 border-ink bg-ink px-2 py-1 font-display text-xs tracking-[0.14em] text-white"
            style={{ transform: 'skewX(-8deg)' }}
          >
            <span style={{ display: 'inline-block', transform: 'skewX(8deg)' }}>{product.name}</span>
          </Link>
        </div>
        {!compact && (
          <div className="mt-2 text-sm font-light leading-relaxed text-muted">{product.description}</div>
        )}
      </div>
    </div>
  )
}
