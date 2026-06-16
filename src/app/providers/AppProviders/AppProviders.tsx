import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/account/context/AuthContext'
import { CartProvider } from '@/features/cart/context/CartContext'
import { I18nProvider } from '@/shared/i18n/i18n'
import type { ReactNode } from 'react'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  )
}
