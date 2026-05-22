import { Link, NavLink } from 'react-router-dom'
import { useCart } from '@/features/cart/context/CartContext'

export function Header() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-display text-2xl tracking-tight">
          VERSE
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-ink' : 'text-muted transition-colors hover:text-ink'
            }
            end
          >
            Home
          </NavLink>
          <Link
            to="/cart"
            className="relative text-muted transition-colors hover:text-ink"
          >
            Cart
            {itemCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
