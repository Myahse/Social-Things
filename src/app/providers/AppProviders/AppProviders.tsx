import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from '@/features/cart/context/CartContext'
import type { ReactNode } from 'react'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <CartProvider>{children}</CartProvider>
    </BrowserRouter>
  )
}
