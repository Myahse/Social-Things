import { CollectionSection } from '@/features/home/components/CollectionSection'
import { useProducts } from '@/features/products/hooks/useProducts'
import { useI18n } from '@/shared/i18n/i18n'
import { usePageMeta } from '@/shared/seo'

export function ProductsPage() {
  const { t } = useI18n()
  const { products, loading, error } = useProducts()
  usePageMeta({ title: t('page.products.title'), description: t('meta.productsDescription'), path: '/product' })

  return (
    <div className="bg-transparent">
      <CollectionSection products={products} loading={loading} error={error} />
    </div>
  )
}
