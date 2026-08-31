// Pure calculation logic, kept separate from I/O so it's easy to unit test.
//
// price = (weight_grams * rate_per_gram * purity_factor) + making_charge_flat
//         then + making_charge_pct on top
//
// purity_factor lets '92.5' sterling silver or '22k' gold reduce the raw rate
// correctly instead of pricing every item at pure-metal rates.
export function purityToFactor(metalType, purityLabel) {
  if (!purityLabel) return 1;
  const p = purityLabel.toString().trim().toLowerCase();

  if (metalType === 'silver') {
    // e.g. "92.5" sterling silver -> 0.925
    const num = parseFloat(p);
    return isNaN(num) ? 1 : num / 100;
  }

  if (metalType === 'gold') {
    // e.g. "22k" -> 22/24, "18k" -> 18/24
    const match = p.match(/(\d+)\s*k/);
    if (match) return parseInt(match[1], 10) / 24;
    const num = parseFloat(p);
    return isNaN(num) ? 1 : num / 100;
  }

  return 1;
}

export function calculateLivePrice({
  weightGrams,
  ratePerGram,
  metalType,
  purityLabel,
  makingChargePct = 0,
  makingChargeFlat = 0,
}) {
  if (!weightGrams || !ratePerGram) return null;
  const factor = purityToFactor(metalType, purityLabel);
  const rawMetalCost = weightGrams * ratePerGram * factor;
  const withMarkupPct = rawMetalCost * (1 + makingChargePct / 100);
  const finalPrice = withMarkupPct + makingChargeFlat;
  return Math.round(finalPrice);
}
