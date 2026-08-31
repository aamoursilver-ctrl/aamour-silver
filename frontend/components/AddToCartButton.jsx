'use client';

// Cart is kept in localStorage for this scaffold — swap for a real cart
// table + session/cookie once you're ready for logged-in customers.
export default function AddToCartButton({ product }) {
  function addToCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((i) => i.product_id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ product_id: product.id, name: product.name, price: product.price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart`);
  }

  return (
    <button
      onClick={addToCart}
      disabled={product.stock <= 0}
      className="border border-ink px-8 py-3 uppercase text-sm tracking-widest hover:bg-ink hover:text-canvas transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {product.stock > 0 ? 'Add to cart' : 'Out of stock'}
    </button>
  );
}
