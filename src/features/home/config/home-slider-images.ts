const slideModules = import.meta.glob<string>(
  '@/assets/home_pic_slider/*.{png,jpg,jpeg,webp,avif}',
  { eager: true, import: 'default' },
)

/** Sorted so new files get a stable order; drop images into `src/assets/home_pic_slider/`. */
export const HOME_SLIDER_IMAGES = Object.entries(slideModules)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([, src]) => src)
