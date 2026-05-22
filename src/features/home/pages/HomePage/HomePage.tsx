import { CollectionSection } from '@/features/home/components/CollectionSection'
import { HeroSection } from '@/features/home/components/HeroSection'
import { useProducts } from '@/features/products/hooks/useProducts'

export function HomePage() {
  const { products, loading, error } = useProducts()

  return (
    <>
      <HeroSection />
      <CollectionSection products={products} loading={loading} error={error} />
    </>
  )
}
