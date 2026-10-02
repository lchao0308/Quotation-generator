import React from 'react';
import { Quotation } from '../../../types/quote';
import { calculateQuotationTotals, calculateItemSubtotal } from '../../../utils/calculations';
import { formatCurrency, formatNumber } from '../../../utils/formatters';

interface TemplateProps {
  quote: Quotation;
}

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ quote }) => {
  const totals = calculateQuotationTotals(quote.items, quote.tax);
  const primaryColor = quote.layout.primaryColor || '#2563EB';

  return (
    <div className="w-full h-full bg-white p-8 flex flex-col justify-between text-gray-800 text-xs leading-normal">
      {/* 頂部 Header */}
      <div>
        <div className="flex items-start justify-between border-b pb-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-4">
            {quote.sender.logo && (
              <img
                src={quote.sender.logo}
                alt="Logo"
                className="h-14 max-w-[140px] object-contain"
              />
            )}
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900">
                {quote.sender.companyName || '公司名稱'}
              </h1>
              {quote.sender.taxId && (
                <p className="text-gray-500 text-2xs mt-0.5">統一編號：{quote.sender.taxId}</p>
              )}
            </div>
          </div>

          <div className="text-right">
            <div
              className="inline-block px-3 py-1 rounded-md text-white font-bold text-sm tracking-wider uppercase mb-2"
              style={{ backgroundColor: primaryColor }}
            >
              QUOTATION
            </div>
            <h2 className="text-base font-bold text-gray-800">{quote.title}</h2>
            <div className="mt-1 space-y-0.5 text-2xs text-gray-500 font-mono">
              <p>單號：<span className="font-bold text-gray-700">{quote.number}</span></p>
              <p>報價日期：{quote.date}</p>
              <p>有效期限：{quote.validUntil} (14天)</p>
            </div>
          </div>
        </div>

        {/* 雙方資訊 (報價方 vs 客戶) */}
        <div className="grid grid-cols-2 gap-6 my-5 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
          <div>
            <span
              className="inline-block px-2 py-0.5 rounded text-2xs font-bold uppercase tracking-wider mb-2"
              style={{ color: primaryColor, backgroundColor: `${primaryColor}15` }}
            >
              報價方 (Sender)
            </span>
            <p className="font-bold text-gray-900 text-sm">{quote.sender.companyName}</p>
            <div className="mt-1 space-y-0.5 text-2xs text-gray-600">
              {quote.sender.representative && <p>負責人：{quote.sender.representative}</p>}
              {quote.sender.contactPerson && <p>聯絡人：{quote.sender.contactPerson}</p>}
              {quote.sender.phone && <p>電話：{quote.sender.phone}</p>}
              {quote.sender.email && <p>Email：{quote.sender.email}</p>}
              {quote.sender.address && <p>地址：{quote.sender.address}</p>}
            </div>
          </div>

          <div className="border-l border-gray-200 pl-6">
            <span
              className="inline-block px-2 py-0.5 rounded text-2xs font-bold uppercase tracking-wider mb-2"
              style={{ color: primaryColor, backgroundColor: `${primaryColor}15` }}
            >
              客戶方 (Client)
            </span>
            <p className="font-bold text-gray-900 text-sm">
              {quote.client.companyName || '(未填寫客戶抬頭)'}
            </p>
            <div className="mt-1 space-y-0.5 text-2xs text-gray-600">
              {quote.client.taxId && <p>統一編號：{quote.client.taxId}</p>}
              {quote.client.contactPerson && <p>聯絡人：{quote.client.contactPerson}</p>}
              {quote.client.phone && <p>電話：{quote.client.phone}</p>}
              {quote.client.email && <p>Email：{quote.client.email}</p>}
              {quote.client.address && <p>地址：{quote.client.address}</p>}
            </div>
          </div>
        </div>

        {/* 項目明細表格 */}
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-white text-2xs uppercase tracking-wider" style={{ backgroundColor: primaryColor }}>
                <th className="py-2.5 px-3 font-semibold text-center w-10">#</th>
                {quote.layout.showCategory && (
                  <th className="py-2.5 px-3 font-semibold w-24">類別</th>
                )}
                <th className="py-2.5 px-3 font-semibold">項目與規格說明</th>
                <th className="py-2.5 px-3 font-semibold text-right w-20">數量</th>
                <th className="py-2.5 px-3 font-semibold text-right w-24">單價</th>
                {quote.layout.showDiscount && (
                  <th className="py-2.5 px-3 font-semibold text-right w-16">折扣</th>
                )}
                <th className="py-2.5 px-3 font-semibold text-right w-28">小計</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-2xs">
              {quote.items.map((item, idx) => {
                const subtotal = calculateItemSubtotal(item);
                return (
                  <tr
                    key={item.id}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                  >
                    <td className="py-2.5 px-3 text-center text-gray-400 font-mono font-medium">
                      {idx + 1}
                    </td>
                    {quote.layout.showCategory && (
                      <td className="py-2.5 px-3 text-gray-600 font-medium">
                        {item.category || '-'}
                      </td>
                    )}
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-gray-900 text-xs">{item.name || '(未命名項目)'}</p>
                      {item.description && (
                        <p className="text-gray-500 text-2xs mt-0.5 leading-relaxed">{item.description}</p>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-gray-700">
                      {formatNumber(item.quantity)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-gray-700">
                      {formatCurrency(item.unitPrice, quote.currency)}
                    </td>
                    {quote.layout.showDiscount && (
                      <td className="py-2.5 px-3 text-right font-mono text-gray-500">
                        {item.discount > 0 ? `${item.discount}%` : '-'}
                      </td>
                    )}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900">
                      {formatCurrency(subtotal, quote.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 金額統計總計區塊 */}
        <div className="flex justify-end mt-4">
          <div className="w-64 bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1.5 text-2xs">
            <div className="flex justify-between text-gray-600">
              <span>未稅合計 (Subtotal)：</span>
              <span className="font-mono font-medium">
                {formatCurrency(totals.amountBeforeTax, quote.currency)}
              </span>
            </div>
            {totals.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>折扣折讓 (Discount)：</span>
                <span className="font-mono">
                  -{formatCurrency(totals.discountTotal, quote.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>
                營業稅 Tax ({quote.tax.mode === 'exempt' ? '免稅' : `${quote.tax.rate}%`})：
              </span>
              <span className="font-mono font-medium">
                {formatCurrency(totals.taxAmount, quote.currency)}
              </span>
            </div>
            <div
              className="pt-2 mt-1 border-t flex justify-between items-baseline"
              style={{ borderColor: '#E5E7EB' }}
            >
              <span className="text-xs font-black text-gray-900">含稅總計 (TOTAL)：</span>
              <span
                className="text-sm font-black font-mono"
                style={{ color: primaryColor }}
              >
                {formatCurrency(totals.totalAmount, quote.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 下方條款、付款與簽章區塊 */}
      <div className="mt-6 space-y-4 pt-4 border-t border-gray-200">
        {/* 條款與付款資訊 */}
        <div className="grid grid-cols-2 gap-4 text-2xs">
          {/* 條款 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              協議條款與合約規範 (Terms)
            </h4>
            <ol className="list-decimal pl-4 space-y-1 text-gray-600 leading-relaxed">
              {quote.terms.map((term) => (
                <li key={term.id}>
                  <strong className="text-gray-700">{term.title}：</strong>
                  {term.content}
                </li>
              ))}
            </ol>
          </div>

          {/* 匯款付款資訊 */}
          <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              匯款與付款資訊 (Payment)
            </h4>
            <div className="space-y-1 text-gray-600">
              <p>銀行名稱：<span className="font-medium text-gray-800">{quote.payment.bankName || '---'}</span></p>
              <p>分行代碼：<span className="font-medium text-gray-800">{quote.payment.branchName || '---'}</span></p>
              <p>銀行帳號：<span className="font-mono font-bold text-gray-900">{quote.payment.accountNumber || '---'}</span></p>
              <p>戶名全銜：<span className="font-medium text-gray-800">{quote.payment.accountName || '---'}</span></p>
              {quote.payment.terms && (
                <p className="pt-1 text-2xs text-gray-500 border-t border-gray-200">
                  條件：{quote.payment.terms}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 簽章雙方 */}
        <div className="grid grid-cols-2 gap-8 pt-2">
          {/* 甲方 */}
          <div className="border border-gray-200 rounded-xl p-3 bg-white">
            <div className="flex justify-between items-center text-2xs font-bold text-gray-700 mb-1">
              <span>甲方簽章 (報價方)：</span>
              <span className="text-gray-400 font-normal">{quote.sender.companyName}</span>
            </div>
            <div className="h-16 flex items-center justify-center">
              {quote.signatures.partyA ? (
                <img
                  src={quote.signatures.partyA}
                  alt="Party A Sign"
                  className="max-h-full object-contain"
                />
              ) : (
                <span className="text-gray-300 text-3xs">公司蓋章 / 負責人簽署</span>
              )}
            </div>
            <p className="text-3xs text-gray-400 text-right mt-1 font-mono">日期：{quote.date}</p>
          </div>

          {/* 乙方 */}
          <div className="border border-gray-200 rounded-xl p-3 bg-white">
            <div className="flex justify-between items-center text-2xs font-bold text-gray-700 mb-1">
              <span>乙方簽章 (客戶確認訂購)：</span>
              <span className="text-gray-400 font-normal">{quote.client.companyName || '客戶確認'}</span>
            </div>
            <div className="h-16 flex items-center justify-center">
              {quote.signatures.partyB ? (
                <img
                  src={quote.signatures.partyB}
                  alt="Party B Sign"
                  className="max-h-full object-contain"
                />
              ) : (
                <span className="text-gray-300 text-3xs">客戶簽署回傳本單即成立訂單</span>
              )}
            </div>
            <p className="text-3xs text-gray-400 text-right mt-1 font-mono">簽署日期：年  月  日</p>
          </div>
        </div>
      </div>
    </div>
  );
};
