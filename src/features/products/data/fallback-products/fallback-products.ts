import type { Product } from '@/features/products/types'

export const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Relaxed Linen Shirt',
    slug: 'relaxed-linen-shirt',
    price: 98,
    description: 'Breathable linen with a relaxed drape for warm days and layered evenings.',
    colors: ['Oat', 'Charcoal'],
    sizes: ['S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Merino Crew Tee',
    slug: 'merino-crew-tee',
    price: 58,
    description: 'Fine-gauge merino that regulates temperature and resists odor naturally.',
    colors: ['Black', 'Stone', 'Ivory'],
    sizes: ['S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Wool Overshirt',
    slug: 'wool-overshirt',
    price: 168,
    description: 'Structured overshirt in brushed wool — wears like a light jacket.',
    colors: ['Navy', 'Camel'],
    sizes: ['S', 'M', 'L'],
    image:
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Canvas Tote',
    slug: 'canvas-tote',
    price: 42,
    description: 'Heavy canvas tote with interior pocket. Built for daily carry.',
    colors: ['Natural'],
    sizes: ['One size'],
    image:
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80&auto=format&fit=crop',
  },
]

export function getFallbackProductBySlug(slug: string): Product | undefined {
  return fallbackProducts.find((p) => p.slug === slug)
}
