// The "price-tag robot": runs on a schedule, refreshes every live-priced
// product's computed_price. Fixed-price products are never touched.
import cron from 'node-cron';
import 'dotenv/config';
import { getLiveMetalRatesInrPerGram } from '../services/metalPriceService.js';
import { calculateLivePrice } from '../services/priceCalculator.js';

export function startPriceUpdateJob(db) {
  const schedule = process.env.PRICE_UPDATE_CRON || '0 * * * *'; // default: every hour

  const runUpdate = async () => {
    try {
      const rates = await getLiveMetalRatesInrPerGram();

      db.prepare('INSERT INTO metal_rates (metal_type, rate_per_gram_inr) VALUES (?, ?)')
        .run('gold', rates.gold);
      db.prepare('INSERT INTO metal_rates (metal_type, rate_per_gram_inr) VALUES (?, ?)')
        .run('silver', rates.silver);

      const liveProducts = db
        .prepare("SELECT * FROM products WHERE pricing_mode = 'live'")
        .all();

      const update = db.prepare('UPDATE products SET computed_price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');

      for (const product of liveProducts) {
        const rate = product.metal_type === 'gold' ? rates.gold : rates.silver;
        const price = calculateLivePrice({
          weightGrams: product.weight_grams,
          ratePerGram: rate,
          metalType: product.metal_type,
          purityLabel: product.metal_purity,
          makingChargePct: product.making_charge_pct,
          makingChargeFlat: product.making_charge_flat,
        });
        if (price !== null) update.run(price, product.id);
      }

      console.log(`[price-robot] Updated ${liveProducts.length} live-priced products at ${new Date().toISOString()}`);
    } catch (err) {
      console.error('[price-robot] Failed to update prices:', err.message);
    }
  };

  // Run once on server start so prices aren't stale/empty, then on schedule
  runUpdate();
  cron.schedule(schedule, runUpdate);
}
