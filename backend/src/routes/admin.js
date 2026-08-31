import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import slugify from 'slugify';
import { requireAdmin } from '../middleware/auth.js';

const upload = multer({ dest: path.join(process.cwd(), 'uploads') });

export function adminRouter(db) {
  const router = express.Router();

  // POST /api/admin/login
  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);
    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ token });
  });

  // POST /api/admin/products  -- add a new product (with photo upload)
  router.post('/products', requireAdmin, upload.array('images', 5), (req, res) => {
    const {
      name, description, category_id, sku, stock,
      pricing_mode, metal_type, metal_purity, weight_grams,
      making_charge_pct, making_charge_flat, fixed_price, is_published,
    } = req.body;

    const slug = slugify(name, { lower: true, strict: true });
    const images = JSON.stringify((req.files || []).map(f => `/uploads/${f.filename}`));

    const stmt = db.prepare(`
      INSERT INTO products
        (name, slug, description, category_id, sku, images, stock,
         pricing_mode, metal_type, metal_purity, weight_grams,
         making_charge_pct, making_charge_flat, fixed_price, is_published)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `);

    const info = stmt.run(
      name, slug, description || '', category_id || null, sku || null, images, stock || 0,
      pricing_mode, metal_type || null, metal_purity || null, weight_grams || null,
      making_charge_pct || 0, making_charge_flat || 0, fixed_price || null,
      is_published ? 1 : 0
    );

    res.status(201).json({ id: info.lastInsertRowid, slug });
  });

  // PUT /api/admin/products/:id -- edit
  router.put('/products/:id', requireAdmin, (req, res) => {
    const fields = req.body;
    const allowed = [
      'name', 'description', 'category_id', 'sku', 'stock', 'pricing_mode',
      'metal_type', 'metal_purity', 'weight_grams', 'making_charge_pct',
      'making_charge_flat', 'fixed_price', 'is_published',
    ];
    const setClauses = [];
    const values = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        setClauses.push(`${key} = ?`);
        values.push(fields[key]);
      }
    }
    if (setClauses.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(req.params.id);
    db.prepare(`UPDATE products SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values);
    res.json({ success: true });
  });

  // DELETE /api/admin/products/:id
  router.delete('/products/:id', requireAdmin, (req, res) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // GET /api/admin/orders -- view incoming orders
  router.get('/orders', requireAdmin, (req, res) => {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    res.json(orders);
  });

  return router;
}
