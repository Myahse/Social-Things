import { CollectionSection } from '@/features/home/components/CollectionSection'
import { useProducts } from '@/features/products/hooks/useProducts'

export function ProductsPage() {
  const { products, loading, error } = useProducts()

  return (
    <div className="bg-transparent">
      <CollectionSection products={products} loading={loading} error={error} />
    </div>
  )
}
