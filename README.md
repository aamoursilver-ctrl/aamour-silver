# Your Jewellery Store — Self-Hosted E-commerce

Your own backend, your own database, your own storefront. No Shopify, no
third-party platform lock-in.

## Project structure

```
jewelry-store/
├── backend/              Node.js + Express + SQLite API
│   ├── src/
│   │   ├── server.js             Entry point
│   │   ├── db/schema.sql         Database tables
│   │   ├── db/init.js            Run once to create the database
│   │   ├── routes/               products.js, admin.js, orders.js
│   │   ├── services/             metalPriceService.js, priceCalculator.js
│   │   ├── middleware/auth.js    Admin login protection
│   │   └── jobs/priceUpdateCron.js   The "price-tag robot"
│   ├── uploads/           Product images land here
│   └── .env.example       Copy to .env and fill in
│
└── frontend/             Next.js storefront + admin panel
    ├── app/               home, /shop, /product/[slug], /cart, /checkout, /admin
    ├── components/        ProductCard, PriceTag, Navbar, Footer, AddToCartButton
    └── lib/api.js         Talks to the backend API
```

## How the pricing engine works

Every product has a `pricing_mode`: `"fixed"` or `"live"`.

- **fixed** — you set a price once in the admin panel. It never changes on its own.
- **live** — you set the item's weight (grams), metal type (gold/silver), purity,
  and your making-charge %. A scheduled job (`priceUpdateCron.js`) checks the
  real gold/silver market rate every hour and recalculates the price automatically.
  When a customer checks out, their price is frozen at that moment — a rate
  change five minutes later never affects an order already placed.

## Running it locally

**Backend:**
```
cd backend
npm install
cp .env.example .env      # then edit .env with your own admin email/password
npm run init-db           # creates store.db and your admin login
npm run dev                # runs on http://localhost:4000
```

**Frontend (separate terminal):**
```
cd frontend
npm install
cp .env.local.example .env.local
npm run dev                # runs on http://localhost:3000
```

Visit `http://localhost:3000/admin`, log in with the email/password from your
`.env`, and publish your first product. It appears on the storefront instantly.

## Going live on your domain (production)

1. Get a VPS (DigitalOcean/Hetzner, ~$5-6/mo), Ubuntu 22.04+.
2. Install Node.js, Nginx, and PM2 (`npm i -g pm2`) on the server.
3. Copy this whole `jewelry-store/` folder to the server (git clone or scp).
4. `cd backend && npm install && npm run init-db && pm2 start src/server.js --name jewelry-backend`
5. `cd frontend && npm install && npm run build && pm2 start npm --name jewelry-frontend -- start`
6. Configure Nginx as a reverse proxy: your domain → port 3000 (frontend),
   and `yourdomain.com/api` → port 4000 (backend).
7. Point your domain's DNS A record at your server's IP address.
8. Run `sudo certbot --nginx` to get free HTTPS (Let's Encrypt).
9. Swap SQLite for PostgreSQL once you're past early testing and expect
   real concurrent traffic — the schema in `db/schema.sql` maps over almost
   1:1, this scaffold used SQLite purely so you can run it with zero setup.

## What's a scaffold, not finished

This is a real, working foundation — not a finished production store. Before
taking real customer money, still add:
- Real payment gateway integration (Razorpay/Cashfree) in `routes/orders.js`
- Automated database backups (cron + copy `store.db` to cloud storage, or
  managed Postgres backups)
- GST-compliant invoicing and a visible returns/refund policy page
- Rate-limiting and input validation on public routes
- Order status emails to customers
