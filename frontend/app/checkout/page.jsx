'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { placeOrder, formatInr } from '../../lib/api';

// NOTE: this scaffold creates the order directly. Before taking real money,
// wire this up to Razorpay/Cashfree: create their order first, collect
// payment, verify the signature server-side, THEN call placeOrder().
export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ customer_name: '', customer_email: '', customer_phone: '', shipping_address: '' });
  const [placing, setPlacing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setPlacing(true);
    try {
      const result = await placeOrder({
        ...form,
        items: cart.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      });
      localStorage.removeItem('cart');
      alert(`Order placed! Order #${result.orderId}`);
      router.push('/');
    } catch (err) {
      alert('Something went wrong placing your order.');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl text-ink mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Full name" className="w-full border border-line px-4 py-3"
          value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
        <input required type="email" placeholder="Email" className="w-full border border-line px-4 py-3"
          value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} />
        <input placeholder="Phone" className="w-full border border-line px-4 py-3"
          value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} />
        <textarea required placeholder="Shipping address" rows={3} className="w-full border border-line px-4 py-3"
          value={form.shipping_address} onChange={(e) => setForm({ ...form, shipping_address: e.target.value })} />

        <div className="flex justify-between pt-4 border-t border-line font-display text-xl">
          <span>Total</span>
          <span>{formatInr(total)}</span>
        </div>

        <button disabled={placing || cart.length === 0} type="submit"
          className="w-full border border-ink px-8 py-3 uppercase text-sm tracking-widest hover:bg-ink hover:text-canvas transition-colors disabled:opacity-40">
          {placing ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </div>
  );
}
