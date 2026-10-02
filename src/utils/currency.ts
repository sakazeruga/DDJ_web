import type { Currency } from '../types';

export const CURRENCY_CONFIG: Record<Currency, { symbol: string; label: string; rate: number }> = {
  JPY: { symbol: '¥', label: 'JPY (¥)', rate: 1 },
  USD: { symbol: '$', label: 'USD ($)', rate: 152 },
  EUR: { symbol: '€', label: 'EUR (€)', rate: 164 },
  TWD: { symbol: 'NT$', label: 'TWD (NT$)', rate: 4.7 },
};

export const formatPrice = (priceInJPY: number, currency: Currency = 'JPY'): string => {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.JPY;
  if (currency === 'JPY') {
    return `${config.symbol}${priceInJPY.toLocaleString()}`;
  }
  const converted = Math.round(priceInJPY / config.rate);
  return `${config.symbol}${converted.toLocaleString()}`;
};
