const desktopModules = import.meta.glob<string>(
  '/src/assets/home_pic_slider/desktop/*.{png,jpg,jpeg,webp,avif}',
  { eager: true, import: 'default' },
)

const mobileModules = import.meta.glob<string>(
  '/src/assets/home_pic_slider/mobile/*.{png,jpg,jpeg,webp,avif}',
  { eager: true, import: 'default' },
)

export type HomeSliderSlide = {
  id: string
  src: string
}

function stemFromPath(path: string) {
  const file = path.replace(/\\/g, '/').split('/').pop() ?? 'slide'
  return file.replace(/\.[^.]+$/, '')
}

function slidesFromModules(modules: Record<string, string>): HomeSliderSlide[] {
  return Object.entries(modules)
    .map(([path, src]) => ({ id: stemFromPath(path), src }))
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
}

/** Portrait full-screen slides — phones only. */
export const HOME_MOBILE_SLIDES = slidesFromModules(mobileModules)

/** Landscape slides — desktop only. */
export const HOME_DESKTOP_SLIDES = slidesFromModules(desktopModules)

/** @deprecated Use HOME_MOBILE_SLIDES / HOME_DESKTOP_SLIDES */
export const HOME_SLIDER_SLIDES = HOME_DESKTOP_SLIDES
