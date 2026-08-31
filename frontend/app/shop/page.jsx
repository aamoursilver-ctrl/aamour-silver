import { getProducts } from '../../lib/api';
import ProductCard from '../../components/ProductCard';

export default async function ShopPage({ searchParams }) {
  const category = searchParams?.category;
  const products = await getProducts(category);

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl text-ink mb-2">
        {category ? category.replace(/-/g, ' ') : 'All Jewellery'}
      </h1>
      <p className="text-ink/60 text-sm mb-10">{products.length} pieces</p>

      {products.length === 0 ? (
        <p className="text-ink/60 text-sm">No products found in this collection yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
