import { formatInr } from '../lib/api';

// Shows the price, and — only for live-priced items — a small badge
// explaining that the price tracks the metal market. This is the one
// piece of UI copy that has to be honest and specific, not generic.
export default function PriceTag({ price, pricingMode }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display text-xl text-ink">{formatInr(price)}</span>
      {pricingMode === 'live' && (
        <span className="text-[10px] uppercase tracking-wider text-brass border border-brass/40 px-1.5 py-0.5 rounded-full">
          Live rate
        </span>
      )}
    </div>
  );
}
