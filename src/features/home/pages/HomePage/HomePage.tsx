import { HeroSection } from '@/features/home/components/HeroSection'
import { CollectionSection } from '@/features/home/components/CollectionSection'
import { FaqSection } from '@/features/home/components/FaqSection'
import { useProducts } from '@/features/products/hooks/useProducts'
import { useI18n } from '@/shared/i18n/i18n'
import { usePageMeta } from '@/shared/seo'

export function HomePage() {
  const { t } = useI18n()
  const { products, loading, error } = useProducts()
  usePageMeta({ title: '', description: t('meta.homeDescription'), path: '/' })

  return (
    <div className="w-full">
      <HeroSection />
      <CollectionSection products={products} loading={loading} error={error} fullScreen />
      <FaqSection />
    </div>
  )
}
