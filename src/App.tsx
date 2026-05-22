import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { CartPage } from './pages/CartPage'
import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'

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
