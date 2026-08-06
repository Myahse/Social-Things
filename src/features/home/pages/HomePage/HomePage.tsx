import { HeroSection } from '@/features/home/components/HeroSection'
import { CollectionSection } from '@/features/home/components/CollectionSection'
import { FaqSection } from '@/features/home/components/FaqSection'
import { useProducts } from '@/features/products/hooks/useProducts'

export function HomePage() {
  const { products, loading, error } = useProducts()

  return (
    <div className="w-full">
      <HeroSection />
      <CollectionSection products={products} loading={loading} error={error} fullScreen />
      <FaqSection />
    </div>
  )
}
