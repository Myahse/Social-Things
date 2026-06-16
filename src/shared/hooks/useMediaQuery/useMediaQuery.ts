import { useEffect, useState } from 'react'

/** Viewport at or above this width uses desktop nav (links beside logo). */
export const DESKTOP_NAV_MEDIA = '(min-width: 768px)'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export function useDesktopNav() {
  return useMediaQuery(DESKTOP_NAV_MEDIA)
}
