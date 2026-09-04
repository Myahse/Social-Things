export type GalleryImage = {
  id?: string
  src: string
  alt: string
  group: string
}

export function groupGalleryImages(images: GalleryImage[]) {
  return Array.from(
    images.reduce((map, image) => {
      const list = map.get(image.group) ?? []
      list.push(image)
      map.set(image.group, list)
      return map
    }, new Map<string, GalleryImage[]>()),
  ).map(([id, grouped]) => ({ id, images: grouped }))
}

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
