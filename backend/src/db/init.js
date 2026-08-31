// Creates the SQLite database file and applies schema.sql
// Run once with: npm run init-db
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../store.db');
const db = new Database(dbPath);

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

// Seed one admin account from .env so you can log into /admin immediately
const email = process.env.ADMIN_EMAIL || 'you@yourstore.com';
const password = process.env.ADMIN_PASSWORD || 'changeme123';
const existing = db.prepare('SELECT id FROM admins WHERE email = ?').get(email);
if (!existing) {
  const hash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?)').run(email, hash);
  console.log(`Admin account created: ${email}`);
} else {
  console.log('Admin account already exists, skipping seed.');
}

// Seed default categories if empty
const catCount = db.prepare('SELECT COUNT(*) as c FROM categories').get().c;
if (catCount === 0) {
  const insertCat = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)');
  insertCat.run('Gold Jewellery', 'gold-jewellery');
  insertCat.run('Silver Jewellery', 'silver-jewellery');
  insertCat.run('Fixed Price Collection', 'fixed-price-collection');
  console.log('Default categories seeded.');
}

console.log(`Database ready at ${dbPath}`);
