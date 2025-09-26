// Utility to convert asset value to user's default currency
import { ExchangeRates } from '@/contexts/financial-data/types/user';

export function getAssetValueInUserCurrency(asset: any, userCurrency: string, exchangeRates: ExchangeRates): number {
  if (!asset.currency || asset.currency === userCurrency) return asset.value;
  if (asset.currency === 'USD' && userCurrency === 'BRL') return asset.value * exchangeRates.usdToBrl;
  if (asset.currency === 'BRL' && userCurrency === 'USD') return asset.value * exchangeRates.brlToUsd;
  if (asset.currency === 'BTC') {
    if (userCurrency === 'BRL') return asset.value * exchangeRates.btcPrice;
    if (userCurrency === 'USD') return asset.value * (exchangeRates.btcPrice * exchangeRates.brlToUsd);
  }
  if (asset.currency === 'ETH') {
    if (userCurrency === 'BRL') return asset.value * exchangeRates.ethPrice;
    if (userCurrency === 'USD') return asset.value * (exchangeRates.ethPrice * exchangeRates.brlToUsd);
  }
  return asset.value;
}
