import { Link } from 'react-router-dom'
import type { CartItem } from '@/features/cart/types'

interface CartLineItemProps {
  item: CartItem
  onRemove: () => void
  onUpdateQuantity: (quantity: number) => void
}

export function CartLineItem({ item, onRemove, onUpdateQuantity }: CartLineItemProps) {
  return (
    <li className="flex gap-4 py-6 first:pt-0">
      <Link
        to={`/product/${item.slug}`}
        className="h-24 w-20 shrink-0 overflow-hidden rounded-md border border-line bg-accent-soft/20"
      >
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </Link>

      <div className="flex flex-1 flex-col justify-between sm:flex-row">
        <div>
          <Link to={`/product/${item.slug}`} className="font-medium hover:underline">
            {item.name}
          </Link>
          <p className="mt-1 text-sm text-muted">
            {item.color} · {item.size}
          </p>
          <button
            type="button"
            onClick={onRemove}
            className="mt-2 text-sm text-muted underline-offset-4 hover:text-accent hover:underline"
          >
            Remove
          </button>
        </div>

        <div className="mt-4 flex items-center gap-4 sm:mt-0">
          <div className="flex items-center rounded-full border border-line">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="px-3 py-1 text-lg leading-none hover:bg-accent-soft/50"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-8 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="px-3 py-1 text-lg leading-none hover:bg-accent-soft/50"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <p className="font-medium">${(item.price * item.quantity).toFixed(0)}</p>
        </div>
      </div>
    </li>
  )
}
