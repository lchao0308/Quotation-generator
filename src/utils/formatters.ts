import { Currency } from '../types/quote';

/**
 * 格式化貨幣顯示
 */
export function formatCurrency(amount: number, currency: Currency = 'TWD'): string {
  const rounded = Math.round(amount || 0);
  const formattedNum = new Intl.NumberFormat('en-US').format(rounded);

  switch (currency) {
    case 'USD':
      return `US$${formattedNum}`;
    case 'JPY':
      return `JP¥${formattedNum}`;
    case 'EUR':
      return `€${formattedNum}`;
    case 'CNY':
      return `CN¥${formattedNum}`;
    case 'HKD':
      return `HK$${formattedNum}`;
    case 'TWD':
    default:
      return `NT$${formattedNum}`;
  }
}

/**
 * 數字加千分位
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value || 0);
}

/**
 * 驗證台灣統一編號格式 (8 碼數字，並支援邏輯檢查)
 */
export function isValidTaiwanTaxId(taxId: string): boolean {
  if (!/^\d{8}$/.test(taxId)) return false;

  const weights = [1, 2, 1, 2, 1, 2, 4, 1];
  let sum = 0;

  for (let i = 0; i < 8; i++) {
    const prod = parseInt(taxId[i], 10) * weights[i];
    sum += Math.floor(prod / 10) + (prod % 10);
  }

  if (sum % 10 === 0) return true;
  if (taxId[6] === '7' && (sum + 1) % 10 === 0) return true;

  return false;
}

/**
 * 驗證電子郵件格式
 */
export function isValidEmail(email: string): boolean {
  if (!email) return true; // optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
