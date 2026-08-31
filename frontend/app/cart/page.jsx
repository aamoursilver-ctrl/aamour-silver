'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatInr } from '../../lib/api';

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  function updateQty(productId, qty) {
    const updated = cart.map((i) => (i.product_id === productId ? { ...i, quantity: qty } : i));
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  }

  function removeItem(productId) {
    const updated = cart.filter((i) => i.product_id !== productId);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl text-ink mb-8">Your cart</h1>

      {cart.length === 0 ? (
        <p className="text-ink/60 text-sm">
          Your cart is empty. <Link href="/shop" className="underline">Browse the collection</Link>.
        </p>
      ) : (
        <>
          <div className="divide-y divide-line">
            {cart.map((item) => (
              <div key={item.product_id} className="py-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-lg text-ink">{item.name}</p>
                  <p className="text-sm text-ink/60">{formatInr(item.price)} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQty(item.product_id, parseInt(e.target.value) || 1)}
                    className="w-16 border border-line px-2 py-1 text-center"
                  />
                  <button onClick={() => removeItem(item.product_id)} className="text-xs uppercase text-ink/50 underline">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-line">
            <span className="font-display text-xl">Total</span>
            <span className="font-display text-xl">{formatInr(total)}</span>
          </div>

          <Link
            href="/checkout"
            className="mt-8 inline-block border border-ink px-8 py-3 uppercase text-sm tracking-widest hover:bg-ink hover:text-canvas transition-colors"
          >
            Proceed to checkout
          </Link>
        </>
      )}
    </div>
  );
}
