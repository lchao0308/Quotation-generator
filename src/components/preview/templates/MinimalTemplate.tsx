import React from 'react';
import { Quotation } from '../../../types/quote';
import { calculateQuotationTotals, calculateItemSubtotal } from '../../../utils/calculations';
import { formatCurrency, formatNumber } from '../../../utils/formatters';

interface TemplateProps {
  quote: Quotation;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ quote }) => {
  const totals = calculateQuotationTotals(quote.items, quote.tax);
  const primaryColor = quote.layout.primaryColor || '#1F2937';

  return (
    <div className="w-full h-full bg-white p-10 flex flex-col justify-between text-gray-800 text-xs font-sans">
      {/* 頂部 Header */}
      <div>
        <div className="flex items-start justify-between pb-8">
          <div>
            {quote.sender.logo && (
              <img
                src={quote.sender.logo}
                alt="Logo"
                className="h-12 max-w-[120px] object-contain mb-4"
              />
            )}
            <h1 className="text-2xl font-light tracking-wide text-gray-900">
              {quote.sender.companyName || '公司名稱'}
            </h1>
            <p className="text-2xs text-gray-400 mt-1 font-mono">
              {quote.sender.taxId && `統編 ${quote.sender.taxId} · `}
              {quote.sender.email}
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-extralight tracking-widest text-gray-400 block mb-1 uppercase">
              QUOTE
            </span>
            <p className="text-sm font-semibold text-gray-800">{quote.title}</p>
            <div className="mt-2 text-2xs text-gray-500 font-mono space-y-0.5">
              <p>NO. <span className="font-semibold text-gray-800">{quote.number}</span></p>
              <p>DATE. {quote.date}</p>
              <p>VALID. {quote.validUntil}</p>
            </div>
          </div>
        </div>

        {/* 雙方資訊：乾淨雙欄 */}
        <div className="grid grid-cols-2 gap-10 py-6 border-y border-gray-200">
          <div>
            <p className="text-3xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
              FROM
            </p>
            <p className="font-semibold text-gray-900 text-sm">{quote.sender.companyName}</p>
            <p className="text-2xs text-gray-500 mt-1 leading-relaxed">
              {quote.sender.contactPerson} {quote.sender.phone && `· ${quote.sender.phone}`}
              <br />
              {quote.sender.address}
            </p>
          </div>

          <div>
            <p className="text-3xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
              BILLED TO
            </p>
            <p className="font-semibold text-gray-900 text-sm">
              {quote.client.companyName || '(未填寫客戶名稱)'}
            </p>
            <p className="text-2xs text-gray-500 mt-1 leading-relaxed">
              {quote.client.contactPerson} {quote.client.phone && `· ${quote.client.phone}`}
              <br />
              {quote.client.address || quote.client.email}
            </p>
          </div>
        </div>

        {/* 簡約項目表 */}
        <div className="mt-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-900 text-3xs uppercase tracking-wider text-gray-500">
                <th className="py-2.5 px-2 font-medium text-center w-8">#</th>
                {quote.layout.showCategory && (
                  <th className="py-2.5 px-2 font-medium w-24">分類</th>
                )}
                <th className="py-2.5 px-2 font-medium">項目與規格</th>
                <th className="py-2.5 px-2 font-medium text-right w-16">數量</th>
                <th className="py-2.5 px-2 font-medium text-right w-24">單價</th>
                {quote.layout.showDiscount && (
                  <th className="py-2.5 px-2 font-medium text-right w-16">折扣</th>
                )}
                <th className="py-2.5 px-2 font-medium text-right w-24">小計</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-2xs">
              {quote.items.map((item, idx) => {
                const subtotal = calculateItemSubtotal(item);
                return (
                  <tr key={item.id}>
                    <td className="py-3 px-2 text-center text-gray-300 font-mono">
                      {idx + 1}
                    </td>
                    {quote.layout.showCategory && (
                      <td className="py-3 px-2 text-gray-400 text-3xs">
                        {item.category || '-'}
                      </td>
                    )}
                    <td className="py-3 px-2">
                      <p className="font-semibold text-gray-900">{item.name || '(未填寫)'}</p>
                      {item.description && (
                        <p className="text-gray-400 text-3xs mt-0.5">{item.description}</p>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-gray-600">
                      {formatNumber(item.quantity)}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-gray-600">
                      {formatCurrency(item.unitPrice, quote.currency)}
                    </td>
                    {quote.layout.showDiscount && (
                      <td className="py-3 px-2 text-right font-mono text-gray-400">
                        {item.discount > 0 ? `${item.discount}%` : '-'}
                      </td>
                    )}
                    <td className="py-3 px-2 text-right font-mono font-medium text-gray-900">
                      {formatCurrency(subtotal, quote.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 簡約總計 */}
        <div className="flex justify-end mt-6">
          <div className="w-60 space-y-1.5 text-2xs border-t border-gray-200 pt-3">
            <div className="flex justify-between text-gray-500">
              <span>小計 Subtotal</span>
              <span className="font-mono">{formatCurrency(totals.amountBeforeTax, quote.currency)}</span>
            </div>
            {totals.discountTotal > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>折扣 Discount</span>
                <span className="font-mono">-{formatCurrency(totals.discountTotal, quote.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>營業稅 Tax ({quote.tax.rate}%)</span>
              <span className="font-mono">{formatCurrency(totals.taxAmount, quote.currency)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-900 text-xs font-bold text-gray-900">
              <span>總金額 TOTAL</span>
              <span className="font-mono text-sm" style={{ color: primaryColor }}>
                {formatCurrency(totals.totalAmount, quote.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 簡約條款與簽名 */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-8 text-3xs text-gray-500 leading-relaxed mb-6">
          <div>
            <p className="font-bold text-gray-800 uppercase tracking-wider mb-1">TERMS & CONDITIONS</p>
            <ul className="space-y-0.5 list-disc pl-3">
              {quote.terms.slice(0, 4).map((t) => (
                <li key={t.id}>
                  <span className="text-gray-700">{t.title}:</span> {t.content}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold text-gray-800 uppercase tracking-wider mb-1">PAYMENT INSTRUCTIONS</p>
            <p>{quote.payment.bankName} {quote.payment.branchName}</p>
            <p className="font-mono font-bold text-gray-800">{quote.payment.accountNumber}</p>
            <p>戶名：{quote.payment.accountName}</p>
            <p className="mt-1">{quote.payment.terms}</p>
          </div>
        </div>

        {/* 雙簽章 */}
        <div className="grid grid-cols-2 gap-12 pt-4 border-t border-gray-100">
          <div>
            <div className="h-12 border-b border-gray-300 flex items-center justify-center">
              {quote.signatures.partyA && (
                <img src={quote.signatures.partyA} alt="Sign A" className="max-h-full object-contain" />
              )}
            </div>
            <p className="text-3xs text-gray-400 mt-1 uppercase tracking-wider">Authorized Signature</p>
          </div>
          <div>
            <div className="h-12 border-b border-gray-300 flex items-center justify-center">
              {quote.signatures.partyB && (
                <img src={quote.signatures.partyB} alt="Sign B" className="max-h-full object-contain" />
              )}
            </div>
            <p className="text-3xs text-gray-400 mt-1 uppercase tracking-wider">Client Acceptance</p>
          </div>
        </div>
      </div>
    </div>
  );
};
