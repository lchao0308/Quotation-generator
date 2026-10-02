import { Quotation, QuotationCalculation, QuoteItem } from '../types/quote';

/**
 * 計算單一項目的未稅折後小計
 */
export function calculateItemSubtotal(item: QuoteItem): number {
  const original = (item.unitPrice || 0) * (item.quantity || 0);
  const discountRate = Math.max(0, Math.min(100, item.discount || 0)) / 100;
  return Math.round(original * (1 - discountRate));
}

/**
 * 計算單一項目的原價加總
 */
export function calculateItemOriginal(item: QuoteItem): number {
  return (item.unitPrice || 0) * (item.quantity || 0);
}

/**
 * 計算報價單完整金額
 */
export function calculateQuotationTotals(
  items: QuoteItem[],
  tax: Quotation['tax']
): QuotationCalculation {
  let subtotal = 0;
  let netTotal = 0;

  for (const item of items) {
    const orig = calculateItemOriginal(item);
    const net = calculateItemSubtotal(item);
    subtotal += orig;
    netTotal += net;
  }

  const discountTotal = subtotal - netTotal;
  const rate = (tax.rate ?? 5) / 100;

  let amountBeforeTax = 0;
  let taxAmount = 0;
  let totalAmount = 0;

  switch (tax.mode) {
    case 'exempt':
      amountBeforeTax = netTotal;
      taxAmount = 0;
      totalAmount = netTotal;
      break;

    case 'inclusive':
      // 內含稅：項目總額即為含稅總價，反推未稅與稅額
      totalAmount = netTotal;
      amountBeforeTax = rate > 0 ? Math.round(totalAmount / (1 + rate)) : totalAmount;
      taxAmount = totalAmount - amountBeforeTax;
      break;

    case 'custom':
    case 'exclusive':
    default:
      // 外加稅：項目總額為未稅總額，稅額外加
      amountBeforeTax = netTotal;
      taxAmount = Math.round(amountBeforeTax * rate);
      totalAmount = amountBeforeTax + taxAmount;
      break;
  }

  return {
    subtotal,
    discountTotal,
    amountBeforeTax,
    taxAmount,
    totalAmount,
  };
}

/**
 * 依據報價日期與有效天數計算有效期限 (YYYY-MM-DD)
 */
export function calculateValidUntil(startDateStr: string, days: number): string {
  if (!startDateStr) return '';
  const date = new Date(startDateStr);
  if (isNaN(date.getTime())) return '';
  date.setDate(date.getDate() + (Number(days) || 0));
  return date.toISOString().split('T')[0];
}
