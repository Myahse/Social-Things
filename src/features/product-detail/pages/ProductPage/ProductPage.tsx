import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCart } from '@/features/cart/context/CartContext'
import { OptionPicker } from '@/features/product-detail/components/OptionPicker'
import { useProduct } from '@/features/products/hooks/useProduct'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { product, loading, error } = useProduct(slug)
  const { addItem } = useCart()
  const navigate = useNavigate()

  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [added, setAdded] = useState(false)

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted sm:px-6">
        Loading product…
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <p className="text-accent">{error}</p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          Back to home
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl">Product not found</h1>
        <Link
          to="/"
          className="mt-6 inline-block text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          Back to home
        </Link>
      </div>
    )
  }

  const canAdd = Boolean(size && color)

  function handleAddToCart() {
    if (!canAdd || !product) return
    addItem(product, size, color)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    if (!canAdd || !product) return
    addItem(product, size, color)
    navigate('/cart')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <Link
        to="/"
        className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
      >
        ← Back to home
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-[4/5] overflow-hidden rounded-lg border border-line bg-accent-soft/20">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="font-display text-4xl">{product.name}</h1>
          <p className="mt-2 text-xl">${product.price}</p>
          <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

          <div className="mt-8">
            <OptionPicker
              label="Color"
              options={product.colors}
              selected={color}
              onSelect={setColor}
            />
          </div>

          <div className="mt-6">
            <OptionPicker
              label="Size"
              options={product.sizes}
              selected={size}
              onSelect={setSize}
            />
          </div>

          {!canAdd && (
            <p className="mt-6 text-sm text-muted">Select a color and size to continue.</p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAdd}
              className="flex-1 rounded-full border border-ink bg-ink px-6 py-3 text-sm font-medium text-canvas transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added ? 'Added to cart' : 'Add to cart'}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!canAdd}
              className="flex-1 rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
