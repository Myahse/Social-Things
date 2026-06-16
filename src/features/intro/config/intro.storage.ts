const INTRO_DONE_KEY = 'social-things:intro-done'
const NAV_ARISE_KEY = 'social-things:nav-arise-pending'

export function readIntroDone(): boolean {
  try {
    return sessionStorage.getItem(INTRO_DONE_KEY) === '1'
  } catch {
    return false
  }
}

export function writeIntroDone() {
  try {
    sessionStorage.setItem(INTRO_DONE_KEY, '1')
  } catch {
    /* private mode */
  }
}

export function readNavArisePending(): boolean {
  try {
    return sessionStorage.getItem(NAV_ARISE_KEY) === '1'
  } catch {
    return false
  }
}

export function markNavArisePending() {
  try {
    sessionStorage.setItem(NAV_ARISE_KEY, '1')
  } catch {
    /* private mode */
  }
}

export function clearNavArisePending() {
  try {
    sessionStorage.removeItem(NAV_ARISE_KEY)
  } catch {
    /* private mode */
  }
}
