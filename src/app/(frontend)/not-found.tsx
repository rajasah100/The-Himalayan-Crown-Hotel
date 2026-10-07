import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="flex min-h-svh items-center bg-ink text-ivory">
      <div className="container-luxe text-center">
        <p className="eyebrow text-gold-light">404</p>
        <h1 className="display mt-6 text-[clamp(3rem,7vw,6rem)]">This path leads off the map</h1>
        <p className="mx-auto mt-6 max-w-md text-ivory/70">
          The page you were looking for has moved or never existed. Let us guide you back.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn btn-gold">
            Return home
          </Link>
          <Link href="/rooms" className="btn btn-outline border-ivory/50 hover:border-ivory hover:bg-ivory hover:text-ink">
            Explore rooms
          </Link>
        </div>
      </div>
    </section>
  )
}
