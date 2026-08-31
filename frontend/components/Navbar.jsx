import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="border-b border-line bg-canvas sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-wide text-ink">
          YOUR MARK
        </Link>
        <nav className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-ink/80">
          <Link href="/shop?category=gold-jewellery">Gold</Link>
          <Link href="/shop?category=silver-jewellery">Silver</Link>
          <Link href="/shop?category=fixed-price-collection">Collection</Link>
        </nav>
        <Link href="/cart" className="text-sm uppercase tracking-widest border border-ink px-4 py-2 hover:bg-ink hover:text-canvas transition-colors">
          Cart
        </Link>
      </div>
    </header>
  );
}
