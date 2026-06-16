export function Footer({ footerRef }: { footerRef?: React.RefObject<HTMLElement | null> }) {
  return (
    <footer ref={footerRef} className="mt-auto bg-ink text-canvas">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          {/* Top: social icon boxes */}
          <div className="mb-10 flex items-center justify-center gap-3">
            <SocialBox href="https://instagram.com" label="Instagram">
              <InstagramIcon />
            </SocialBox>
            <SocialBox href="https://tiktok.com" label="TikTok">
              <TikTokIcon />
            </SocialBox>
            <SocialBox href="https://x.com" label="X">
              <XIcon />
            </SocialBox>
          </div>

          <div className="font-display text-xl tracking-[0.22em] sm:text-2xl">
            WELCOME TO SOCIAL THINGS
          </div>

          <a
            className="mt-6 text-sm tracking-[0.22em] text-canvas/70 underline-offset-4 hover:text-canvas hover:underline"
            href="mailto:contact@socialthings.com"
          >
            CONTACT US
          </a>
      </div>
    </footer>
  )
}

function SocialBox({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group flex h-[var(--home-side-box)] w-[var(--home-side-box)] items-center justify-center rounded-2xl border border-canvas/15 bg-canvas/10 text-canvas transition-colors hover:bg-canvas/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas/50"
    >
      <span className="transition-transform duration-300 group-hover:scale-105">{children}</span>
    </a>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
      <path d="M7.5 2.75h9A4.75 4.75 0 0 1 21.25 7.5v9A4.75 4.75 0 0 1 16.5 21.25h-9A4.75 4.75 0 0 1 2.75 16.5v-9A4.75 4.75 0 0 1 7.5 2.75Zm0 1.5A3.25 3.25 0 0 0 4.25 7.5v9A3.25 3.25 0 0 0 7.5 19.75h9a3.25 3.25 0 0 0 3.25-3.25v-9A3.25 3.25 0 0 0 16.5 4.25h-9Zm4.5 3.25A4.5 4.5 0 1 1 7.5 12 4.51 4.51 0 0 1 12 7.5Zm0 1.5A3 3 0 1 0 15 12a3 3 0 0 0-3-3Zm5.35-.9a1.05 1.05 0 1 1-1.05-1.05 1.05 1.05 0 0 1 1.05 1.05Z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
      <path d="M15.5 2.75h2.25c.2 2.4 1.55 4.1 3.5 4.6v2.4c-1.6.06-3.08-.44-4.25-1.4v7.9c0 3.2-2.6 5.75-5.8 5.75-3.15 0-5.7-2.55-5.7-5.7 0-3.2 2.6-5.8 5.9-5.8.4 0 .8.05 1.2.15v2.55a3.2 3.2 0 0 0-1.2-.25 3.25 3.25 0 0 0 0 6.5c1.8 0 3.25-1.45 3.25-3.25V2.75Z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
      <path d="M18.8 2.75h2.45l-5.35 6.1 6.3 12.4h-4.9l-3.85-7.5-6.55 7.5H4.4l5.75-6.6-6.05-11.9h5.05l3.5 6.9 6.15-6.9Zm-.85 16.85h1.35L9.2 4.3H7.75l10.2 15.3Z" />
    </svg>
  )
}
