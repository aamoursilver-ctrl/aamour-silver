// Fetches live gold and silver rates and converts them to INR-per-gram.
// Swap the fetch URLs/logic here if you later move to a paid, more reliable rate API.
import 'dotenv/config';

const TROY_OUNCE_TO_GRAMS = 31.1035;

async function fetchUsdPerOunce(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Rate API failed: ${res.status}`);
  const data = await res.json();
  // gold-api.com returns { price: <usd per ounce> } — adjust if your provider differs
  return data.price;
}

async function fetchUsdToInr() {
  const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR');
  if (!res.ok) throw new Error('FX rate API failed');
  const data = await res.json();
  return data.rates.INR;
}

// Returns { gold: rupeesPerGram, silver: rupeesPerGram }
export async function getLiveMetalRatesInrPerGram() {
  const [goldUsdOz, silverUsdOz, usdToInr] = await Promise.all([
    fetchUsdPerOunce(process.env.GOLD_API_URL),
    fetchUsdPerOunce(process.env.SILVER_API_URL),
    fetchUsdToInr(),
  ]);

  const goldInrPerGram = (goldUsdOz / TROY_OUNCE_TO_GRAMS) * usdToInr;
  const silverInrPerGram = (silverUsdOz / TROY_OUNCE_TO_GRAMS) * usdToInr;

  return { gold: goldInrPerGram, silver: silverInrPerGram };
}
