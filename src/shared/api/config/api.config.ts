/** Set VITE_USE_JAVA_API=true when Spring Boot is running (port 8080). */
export function isJavaApiEnabled(): boolean {
  return import.meta.env.VITE_USE_JAVA_API === 'true'
}
