-- Core catalog
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id INTEGER REFERENCES categories(id),
  sku TEXT UNIQUE,
  images TEXT,                -- JSON array of image paths
  stock INTEGER DEFAULT 0,

  -- PRICING ENGINE FIELDS
  pricing_mode TEXT NOT NULL CHECK (pricing_mode IN ('live', 'fixed')) DEFAULT 'fixed',
  metal_type TEXT CHECK (metal_type IN ('gold', 'silver', NULL)),
  metal_purity TEXT,          -- e.g. '92.5' for sterling silver, '22k' for gold
  weight_grams REAL,          -- used only when pricing_mode = 'live'
  making_charge_pct REAL DEFAULT 0,   -- your markup % over raw metal cost
  making_charge_flat REAL DEFAULT 0,  -- optional flat charge in addition to %
  fixed_price REAL,           -- used only when pricing_mode = 'fixed'
  computed_price REAL,        -- cache: last calculated live price, refreshed by cron

  is_published INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Daily metal rate log, so every price change is auditable
CREATE TABLE IF NOT EXISTS metal_rates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metal_type TEXT NOT NULL,
  rate_per_gram_inr REAL NOT NULL,
  fetched_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT,
  total_amount REAL NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  payment_ref TEXT,
  order_status TEXT DEFAULT 'processing',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price_at_purchase REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);
