import type { Product } from '@/features/products/types'

export const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Green Piece',
    slug: 'green',
    price: 98,
    description: 'Bold green staple — cut for movement and everyday wear.',
    colors: ['Green'],
    sizes: ['S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Orange Piece',
    slug: 'orange',
    price: 98,
    description: 'Statement orange layer — fearlessly expressive on the street.',
    colors: ['Orange'],
    sizes: ['S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Red Piece',
    slug: 'red',
    price: 98,
    description: 'Deep red finish — structured fit with a relaxed drape.',
    colors: ['Red'],
    sizes: ['S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80&auto=format&fit=crop',
  },
]

export function getFallbackProductBySlug(slug: string): Product | undefined {
  return fallbackProducts.find((p) => p.slug === slug)
}
