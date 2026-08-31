import Link from 'next/link';
import PriceTag from './PriceTag';

export default function ProductCard({ product }) {
  const image = product.images?.[0];
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="aspect-[4/5] bg-line/40 overflow-hidden mb-3">
        {image ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${image}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 text-sm">No image</div>
        )}
      </div>
      <h3 className="font-display text-lg text-ink">{product.name}</h3>
      <PriceTag price={product.price} pricingMode={product.pricing_mode} />
    </Link>
  );
}
