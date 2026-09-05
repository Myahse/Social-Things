import logoMarkUrl from '@/assets/logo-mark.png'

interface LogoMarkProps {
  className?: string
  imgClassName?: string
  onDark?: boolean
}

export function LogoMark({ className = '', imgClassName = '', onDark = false }: LogoMarkProps) {
  return (
    <span className={`logo-mark ${onDark ? 'logo-mark-on-dark' : ''} ${className}`}>
      <span className="logo-mark-glow" aria-hidden />
      <img
        src={logoMarkUrl}
        alt=""
        draggable={false}
        className={`logo-mark-img ${imgClassName}`}
      />
    </span>
  )
}
