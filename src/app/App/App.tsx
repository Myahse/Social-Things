import { Route, Routes } from 'react-router-dom'
import { AboutPage } from '@/features/about/pages/AboutPage'
import { AccountPage } from '@/features/account/pages/AccountPage'
import { CartPage } from '@/features/cart/pages/CartPage'
import { HomePage } from '@/features/home/pages/HomePage'
import { IntroGate } from '@/features/intro/components/IntroGate'
import { ProductPage } from '@/features/product-detail/pages/ProductPage'
import { ProductsPage } from '@/features/products/pages/ProductsPage'
import { Layout } from '@/shared/layout/Layout'

function App() {
  return (
    <IntroGate>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="product" element={<ProductsPage />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>
      </Routes>
    </IntroGate>
  )
}

export default App
