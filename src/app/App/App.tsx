import { Route, Routes } from 'react-router-dom'
import { CartPage } from '@/features/cart/pages/CartPage'
import { HomePage } from '@/features/home/pages/HomePage'
import { ProductPage } from '@/features/product-detail/pages/ProductPage'
import { Layout } from '@/shared/layout/Layout'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="product/:slug" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
      </Route>
    </Routes>
  )
}

export default App
