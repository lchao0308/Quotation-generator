import React from 'react';
import { TaxSettings, Currency, QuoteItem } from '../../../types/quote';
import { calculateQuotationTotals } from '../../../utils/calculations';
import { formatCurrency } from '../../../utils/formatters';
import { Coins, Percent, Calculator } from 'lucide-react';

interface TaxCurrencySectionProps {
  tax: TaxSettings;
  currency: Currency;
  items: QuoteItem[];
  onTaxChange: (patch: Partial<TaxSettings>) => void;
  onCurrencyChange: (currency: Currency) => void;
}

export const TaxCurrencySection: React.FC<TaxCurrencySectionProps> = ({
  tax,
  currency,
  items,
  onTaxChange,
  onCurrencyChange,
}) => {
  const totals = calculateQuotationTotals(items, tax);

  const currencyOptions: { value: Currency; label: string; symbol: string }[] = [
    { value: 'TWD', label: '新台幣 (TWD)', symbol: 'NT$' },
    { value: 'USD', label: '美元 (USD)', symbol: 'US$' },
    { value: 'JPY', label: '日圓 (JPY)', symbol: 'JP¥' },
    { value: 'EUR', label: '歐元 (EUR)', symbol: '€' },
    { value: 'CNY', label: '人民幣 (CNY)', symbol: 'CN¥' },
    { value: 'HKD', label: '港幣 (HKD)', symbol: 'HK$' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 幣別選擇 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-blue-600" />
            報價幣別
          </label>
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as Currency)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium text-gray-800"
          >
            {currencyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* 稅率模式 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-blue-600" />
            營業稅計算模式
          </label>
          <select
            value={tax.mode}
            onChange={(e) => onTaxChange({ mode: e.target.value as TaxSettings['mode'] })}
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium text-gray-800"
          >
            <option value="exclusive">外加稅 (台灣標準 5%)</option>
            <option value="inclusive">內含稅 (含 5% 營業稅)</option>
            <option value="exempt">不計稅 / 零稅率 (0%)</option>
            <option value="custom">自訂稅率 (%)</option>
          </select>
        </div>

        {/* 自訂稅率輸入欄位 */}
        {tax.mode === 'custom' && (
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              自訂稅率比例 (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={tax.rate}
                onChange={(e) =>
                  onTaxChange({ rate: Math.max(0, parseFloat(e.target.value) || 0) })
                }
                className="w-32 px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 font-mono"
              />
              <span className="text-xs text-gray-500">%</span>
            </div>
          </div>
        )}
      </div>

      {/* 金額計算試算卡片 */}
      <div className="p-4 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 rounded-xl border border-blue-100 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 pb-1 border-b border-blue-100/80">
          <Calculator className="w-4 h-4 text-blue-600" />
          <span>金額即時試算總結</span>
        </div>

        <div className="flex justify-between text-xs text-gray-600">
          <span>項目原價總計：</span>
          <span className="font-mono">{formatCurrency(totals.subtotal, currency)}</span>
        </div>

        {totals.discountTotal > 0 && (
          <div className="flex justify-between text-xs text-emerald-600">
            <span>整單折扣優惠：</span>
            <span className="font-mono">-{formatCurrency(totals.discountTotal, currency)}</span>
          </div>
        )}

        <div className="flex justify-between text-xs text-gray-600">
          <span>未稅合計金額：</span>
          <span className="font-mono font-medium text-gray-800">
            {formatCurrency(totals.amountBeforeTax, currency)}
          </span>
        </div>

        <div className="flex justify-between text-xs text-gray-600">
          <span>
            預估營業稅 ({tax.mode === 'exempt' ? '免稅' : `${tax.rate}%`})：
          </span>
          <span className="font-mono font-medium text-gray-800">
            {formatCurrency(totals.taxAmount, currency)}
          </span>
        </div>

        <div className="pt-2 border-t border-blue-200/80 flex justify-between items-baseline">
          <span className="text-sm font-bold text-gray-900">含稅總計 (Total)：</span>
          <span className="text-lg font-extrabold text-blue-700 font-mono">
            {formatCurrency(totals.totalAmount, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
