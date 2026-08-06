const galleryModules = import.meta.glob<string>(
  '@/assets/gallery/**/*.{png,jpg,jpeg,webp,avif}',
  { eager: true, import: 'default' },
)

export type GalleryImage = {
  src: string
  alt: string
  group: string
}

function parsePath(path: string) {
  // e.g. .../gallery/orange/IMG_0726.jpeg or .../gallery/shot.png
  const parts = path.replace(/\\/g, '/').split('/')
  const galleryIdx = parts.lastIndexOf('gallery')
  const after = galleryIdx >= 0 ? parts.slice(galleryIdx + 1) : parts.slice(-2)
  const file = after[after.length - 1] ?? 'image'
  const group = after.length > 1 ? after[0] : 'all'
  const alt = file.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
  return { group, alt }
}

/** Nested folders under `src/assets/gallery/` become groups (orange, rouge, vert, white…). */
export const GALLERY_IMAGES: GalleryImage[] = Object.entries(galleryModules)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([path, src]) => {
    const { group, alt } = parsePath(path)
    return { src, alt, group }
  })

export const GALLERY_GROUPS = Array.from(
  GALLERY_IMAGES.reduce((map, image) => {
    const list = map.get(image.group) ?? []
    list.push(image)
    map.set(image.group, list)
    return map
  }, new Map<string, GalleryImage[]>()),
).map(([id, images]) => ({ id, images }))

/** Folder id → English color label (folder names can stay FR). */
const GROUP_LABELS: Record<string, string> = {
  orange: 'Orange',
  rouge: 'Red',
  vert: 'Green',
  white: 'White',
}

export function galleryGroupLabel(groupId: string) {
  return GROUP_LABELS[groupId] ?? groupId.charAt(0).toUpperCase() + groupId.slice(1)
}
