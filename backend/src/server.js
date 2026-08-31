import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import 'dotenv/config';

import { productsRouter } from './routes/products.js';
import { adminRouter } from './routes/admin.js';
import { ordersRouter } from './routes/orders.js';
import { startPriceUpdateJob } from './jobs/priceUpdateCron.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, '../store.db'));

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/products', productsRouter(db));
app.use('/api/admin', adminRouter(db));
app.use('/api/orders', ordersRouter(db));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Start the price-tag robot (fetches live rates, updates 'live' priced products)
startPriceUpdateJob(db);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
