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
  mobile: string
  desktop: string
}

function stemFromPath(path: string) {
  const file = path.replace(/\\/g, '/').split('/').pop() ?? 'slide'
  return file.replace(/\.[^.]+$/, '')
}

function entriesByStem(modules: Record<string, string>) {
  return Object.entries(modules)
    .map(([path, src]) => [stemFromPath(path), src] as const)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
}

/**
 * Drop matching filenames into `mobile/` and `desktop/` under
 * `src/assets/home_pic_slider/`. Same stem = one slide pair.
 */
export const HOME_SLIDER_SLIDES: HomeSliderSlide[] = (() => {
  const desktop = new Map(entriesByStem(desktopModules))
  const mobile = new Map(entriesByStem(mobileModules))
  const ids = Array.from(new Set([...desktop.keys(), ...mobile.keys()])).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  )

  return ids.flatMap((id) => {
    const d = desktop.get(id)
    const m = mobile.get(id)
    const desktopSrc = d ?? m
    const mobileSrc = m ?? d
    if (!desktopSrc || !mobileSrc) return []
    return [{ id, mobile: mobileSrc, desktop: desktopSrc }]
  })
})()
