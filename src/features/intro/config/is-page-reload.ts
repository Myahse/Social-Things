/** True when the document was loaded via browser refresh (F5 / reload). */
export function isPageReload(): boolean {
  if (typeof performance === 'undefined') return false
  const entry = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined
  return entry?.type === 'reload'
}
