export function HeroSection() {
  return (
    <section className="border-b border-line bg-ink px-4 py-20 text-canvas sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.2em] text-canvas/70">New season</p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl leading-tight sm:text-6xl">
          Clothing made for everyday elevation
        </h1>
        <p className="mt-6 max-w-lg text-canvas/80">
          Essentials, outerwear, and accessories — designed with restraint and built to last.
        </p>
        <a
          href="#collection"
          className="mt-8 inline-block border border-canvas/40 px-6 py-3 text-sm transition-colors hover:bg-canvas hover:text-ink"
        >
          View collection
        </a>
      </div>
    </section>
  )
}
