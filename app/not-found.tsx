import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-site grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="display mt-3 text-6xl">Lost in the lahar?</h1>
        <p className="mt-4 text-ash-ink">This page doesn&apos;t exist — but the belfry is still standing.</p>
        <div className="mt-8 flex justify-center gap-2">
          <Link href="/" className="btn-dark">Home</Link>
          <Link href="/explore" className="btn-ghost">Explore Daraga</Link>
        </div>
      </div>
    </section>
  );
}
