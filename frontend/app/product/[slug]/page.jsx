import { getProduct } from '../../../lib/api';
import PriceTag from '../../../components/PriceTag';
import AddToCartButton from '../../../components/AddToCartButton';

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);

  if (!product) {
    return <div className="max-w-3xl mx-auto px-6 py-20 text-center text-ink/60">Product not found.</div>;
  }

  const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace('/api', '');

  return (
    <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12">
      <div className="aspect-square bg-line/40 overflow-hidden">
        {product.images?.[0] ? (
          <img src={`${apiOrigin}${product.images[0]}`} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 text-sm">No image</div>
        )}
      </div>

      <div>
        <h1 className="font-display text-3xl text-ink mb-3">{product.name}</h1>
        <PriceTag price={product.price} pricingMode={product.pricing_mode} />
        <p className="text-ink/70 mt-6 leading-relaxed">{product.description}</p>

        <dl className="mt-8 space-y-2 text-sm text-ink/70 border-t border-line pt-6">
          {product.metal_type && (
            <div className="flex justify-between"><dt>Metal</dt><dd className="capitalize">{product.metal_type}</dd></div>
          )}
          {product.metal_purity && (
            <div className="flex justify-between"><dt>Purity</dt><dd>{product.metal_purity}</dd></div>
          )}
          {product.weight_grams && (
            <div className="flex justify-between"><dt>Weight</dt><dd>{product.weight_grams}g</dd></div>
          )}
          <div className="flex justify-between"><dt>Availability</dt><dd>{product.stock > 0 ? 'In stock' : 'Out of stock'}</dd></div>
        </dl>

        <div className="mt-8">
          <AddToCartButton product={product} />
        </div>

        {product.pricing_mode === 'live' && (
          <p className="text-xs text-ink/50 mt-4">
            This price is tied to today's {product.metal_type} rate and may change tomorrow.
            Your price is locked in the moment you complete checkout.
          </p>
        )}
      </div>
    </div>
  );
}
