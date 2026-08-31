import Link from 'next/link';
import { getProducts } from '../lib/api';
import ProductCard from '../components/ProductCard';

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* Hero — the single signature moment: a live price ticking, not a stock banner */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center">
        <p className="uppercase tracking-[0.3em] text-xs text-sage mb-4">Gold & Silver, priced honestly</p>
        <h1 className="font-display text-5xl md:text-6xl text-ink leading-tight max-w-3xl mx-auto">
          Jewellery that's priced with the market, not against you.
        </h1>
        <p className="text-ink/70 max-w-xl mx-auto mt-5">
          Every piece shows its true metal weight and purity. Prices on select
          items move with the daily gold and silver rate — transparent, always.
        </p>
        <Link
          href="/shop"
          className="inline-block mt-8 border border-ink px-8 py-3 uppercase text-sm tracking-widest hover:bg-ink hover:text-canvas transition-colors"
        >
          Shop the collection
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="font-display text-2xl text-ink mb-8">New arrivals</h2>
        {featured.length === 0 ? (
          <p className="text-ink/60 text-sm">
            No products published yet — add some from your admin panel at <code>/admin</code>.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
