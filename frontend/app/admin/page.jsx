'use client';
import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Minimal admin panel: log in, add a product, publish it. Deliberately
// bare-bones — this is the "staff room" only you will ever see.
export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [product, setProduct] = useState({
    name: '', description: '', sku: '', stock: 1,
    pricing_mode: 'fixed', metal_type: '', metal_purity: '', weight_grams: '',
    making_charge_pct: 0, making_charge_flat: 0, fixed_price: '', is_published: true,
  });
  const [status, setStatus] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/admin/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginForm),
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.token);
    } else {
      setStatus('Login failed');
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    setStatus('Saving...');
    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => formData.append(key, value));

    const res = await fetch(`${API_URL}/admin/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      setStatus('Product published!');
      setProduct({ ...product, name: '', description: '', sku: '' });
    } else {
      setStatus('Failed to save product');
    }
  }

  if (!token) {
    return (
      <div className="max-w-sm mx-auto px-6 py-20">
        <h1 className="font-display text-2xl mb-6">Admin login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input required placeholder="Email" className="w-full border border-line px-4 py-3"
            value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
          <input required type="password" placeholder="Password" className="w-full border border-line px-4 py-3"
            value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
          <button className="w-full border border-ink px-8 py-3 uppercase text-sm tracking-widest">Log in</button>
          {status && <p className="text-sm text-red-600">{status}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-14">
      <h1 className="font-display text-2xl mb-8">Add a product</h1>
      <form onSubmit={handleAddProduct} className="space-y-4">
        <input required placeholder="Product name" className="w-full border border-line px-4 py-3"
          value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
        <textarea placeholder="Description" rows={3} className="w-full border border-line px-4 py-3"
          value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
        <input placeholder="SKU" className="w-full border border-line px-4 py-3"
          value={product.sku} onChange={(e) => setProduct({ ...product, sku: e.target.value })} />
        <input type="number" placeholder="Stock quantity" className="w-full border border-line px-4 py-3"
          value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} />

        <div className="flex gap-4 border border-line p-4">
          <label className="flex items-center gap-2">
            <input type="radio" checked={product.pricing_mode === 'fixed'}
              onChange={() => setProduct({ ...product, pricing_mode: 'fixed' })} />
            Fixed price
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={product.pricing_mode === 'live'}
              onChange={() => setProduct({ ...product, pricing_mode: 'live' })} />
            Live metal price
          </label>
        </div>

        {product.pricing_mode === 'fixed' ? (
          <input type="number" placeholder="Fixed price (₹)" className="w-full border border-line px-4 py-3"
            value={product.fixed_price} onChange={(e) => setProduct({ ...product, fixed_price: e.target.value })} />
        ) : (
          <>
            <select className="w-full border border-line px-4 py-3"
              value={product.metal_type} onChange={(e) => setProduct({ ...product, metal_type: e.target.value })}>
              <option value="">Select metal</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
            </select>
            <input placeholder="Purity (e.g. 92.5 or 22k)" className="w-full border border-line px-4 py-3"
              value={product.metal_purity} onChange={(e) => setProduct({ ...product, metal_purity: e.target.value })} />
            <input type="number" placeholder="Weight in grams" className="w-full border border-line px-4 py-3"
              value={product.weight_grams} onChange={(e) => setProduct({ ...product, weight_grams: e.target.value })} />
            <input type="number" placeholder="Making charge %" className="w-full border border-line px-4 py-3"
              value={product.making_charge_pct} onChange={(e) => setProduct({ ...product, making_charge_pct: e.target.value })} />
          </>
        )}

        <button className="w-full border border-ink px-8 py-3 uppercase text-sm tracking-widest hover:bg-ink hover:text-canvas transition-colors">
          Publish product
        </button>
        {status && <p className="text-sm text-brass">{status}</p>}
      </form>
    </div>
  );
}
