import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '@/features/cart/context/CartContext'
import { useI18n } from '@/shared/i18n/i18n'

function AccountIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.5 3.5-6 7-6s7 2.5 7 6" />
    </svg>
  )
}

function CartIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 6h14l-1.5 9H7.5L6 6Z" />
      <path d="M6 6 5 3H3" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
    </svg>
  )
}

interface HeaderIconLinkProps {
  to: string
  label: string
  children: ReactNode
  badge?: number
  getClassName?: (args: { isActive: boolean }) => string
}

function HeaderIconLink({ to, label, children, badge, getClassName }: HeaderIconLinkProps) {
  const { pathname } = useLocation()
  const isActive = pathname === to
  const className =
    getClassName?.({ isActive }) ??
    `relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors min-[480px]:h-11 min-[480px]:w-11 ${
      isActive
        ? 'bg-accent-soft text-ink'
        : 'text-muted hover:bg-accent-soft/60 hover:text-ink'
    }`

  return (
    <Link
      to={to}
      aria-label={label}
      className={className}
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-white">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  )
}

interface HeaderActionsProps {
  className?: string
  variant?: 'pill' | 'minimal'
}

export function HeaderActions({ className = '', variant = 'pill' }: HeaderActionsProps) {
  const { t } = useI18n()
  const { itemCount } = useCart()

  const linkClass =
    variant === 'minimal'
      ? ({ isActive }: { isActive: boolean }) =>
          `relative flex h-10 w-10 shrink-0 items-center justify-center text-muted transition-colors hover:text-ink ${
            isActive ? 'text-ink' : ''
          }`
      : ({ isActive }: { isActive: boolean }) =>
          `relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors min-[480px]:h-11 min-[480px]:w-11 ${
            isActive
              ? 'bg-accent-soft text-ink'
              : 'text-muted hover:bg-accent-soft/60 hover:text-ink'
          }`

  return (
    <div className={`flex shrink-0 items-center gap-0.5 sm:gap-1 ${className}`}>
      <HeaderIconLink to="/account" label={t('nav.account')} getClassName={linkClass}>
        <AccountIcon className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5" />
      </HeaderIconLink>
      <HeaderIconLink to="/cart" label={t('nav.cart')} badge={itemCount} getClassName={linkClass}>
        <CartIcon className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5" />
      </HeaderIconLink>
    </div>
  )
}
