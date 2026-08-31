import express from 'express';

// Checkout route. In production, you'd verify a Razorpay/Cashfree payment
// signature here BEFORE marking payment_status = 'paid'. This scaffold
// records the order as 'pending' and gives you the hook point to add that.
export function ordersRouter(db) {
  const router = express.Router();

  router.post('/', (req, res) => {
    const { customer_name, customer_email, customer_phone, shipping_address, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const insertOrder = db.prepare(`
      INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, total_amount)
      VALUES (?, ?, ?, ?, ?)
    `);
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, quantity, price_at_purchase)
      VALUES (?, ?, ?, ?, ?)
    `);

    const tx = db.transaction((items) => {
      let total = 0;
      const productStmt = db.prepare('SELECT * FROM products WHERE id = ?');
      const stockStmt = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

      // Freeze current price per item — critical for live-priced products,
      // so a gold-rate change mid-checkout never changes what the customer owes.
      const priced = items.map((item) => {
        const product = productStmt.get(item.product_id);
        if (!product) throw new Error(`Product ${item.product_id} not found`);
        const price = product.pricing_mode === 'live' ? product.computed_price : product.fixed_price;
        total += price * item.quantity;
        return { product, price, quantity: item.quantity };
      });

      const orderInfo = insertOrder.run(customer_name, customer_email, customer_phone, shipping_address, total);

      for (const p of priced) {
        insertItem.run(orderInfo.lastInsertRowid, p.product.id, p.product.name, p.quantity, p.price);
        stockStmt.run(p.quantity, p.product.id);
      }

      return { orderId: orderInfo.lastInsertRowid, total };
    });

    try {
      const result = tx(items);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
