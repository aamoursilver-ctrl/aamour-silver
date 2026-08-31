import express from 'express';

// Public, customer-facing product routes. Only ever returns published products.
export function productsRouter(db) {
  const router = express.Router();

  // GET /api/products?category=silver-jewellery
  router.get('/', (req, res) => {
    const { category } = req.query;
    let rows;
    if (category) {
      rows = db.prepare(`
        SELECT p.* FROM products p
        JOIN categories c ON c.id = p.category_id
        WHERE p.is_published = 1 AND c.slug = ?
        ORDER BY p.created_at DESC
      `).all(category);
    } else {
      rows = db.prepare('SELECT * FROM products WHERE is_published = 1 ORDER BY created_at DESC').all();
    }
    res.json(rows.map(formatProduct));
  });

  // GET /api/products/:slug
  router.get('/:slug', (req, res) => {
    const row = db.prepare('SELECT * FROM products WHERE slug = ? AND is_published = 1').get(req.params.slug);
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(formatProduct(row));
  });

  return router;
}

// Decides which price to actually show: live computed_price, or the fixed price
function formatProduct(row) {
  const displayPrice = row.pricing_mode === 'live' ? row.computed_price : row.fixed_price;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    images: JSON.parse(row.images || '[]'),
    stock: row.stock,
    pricing_mode: row.pricing_mode,
    metal_type: row.metal_type,
    metal_purity: row.metal_purity,
    weight_grams: row.weight_grams,
    price: displayPrice,
  };
}
