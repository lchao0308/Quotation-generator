import React from 'react';
import { Quotation } from '../../../types/quote';
import { calculateQuotationTotals, calculateItemSubtotal } from '../../../utils/calculations';
import { formatCurrency, formatNumber } from '../../../utils/formatters';

interface TemplateProps {
  quote: Quotation;
}

export const CorporateTemplate: React.FC<TemplateProps> = ({ quote }) => {
  const totals = calculateQuotationTotals(quote.items, quote.tax);
  const primaryColor = quote.layout.primaryColor || '#1E3A8A';

  return (
    <div className="w-full h-full bg-white p-8 flex flex-col justify-between text-gray-900 text-xs font-sans">
      {/* 頂部公司標題 */}
      <div>
        <div className="text-center pb-4 border-b-2" style={{ borderColor: primaryColor }}>
          <div className="flex items-center justify-center gap-3 mb-1">
            {quote.sender.logo && (
              <img
                src={quote.sender.logo}
                alt="Logo"
                className="h-10 max-w-[100px] object-contain"
              />
            )}
            <h1 className="text-2xl font-black tracking-widest text-gray-900">
              {quote.sender.companyName || '公司名稱'}
            </h1>
          </div>
          <p className="text-3xs text-gray-500">
            地址：{quote.sender.address} ｜ 電話：{quote.sender.phone} ｜ 統一編號：{quote.sender.taxId}
          </p>
          <div className="inline-block mt-2 px-6 py-1 bg-gray-100 rounded text-sm font-bold tracking-widest text-gray-800 border border-gray-300">
            報　價　單 (QUOTATION)
          </div>
        </div>

        {/* 雙方資訊格狀排版 */}
        <table className="w-full border-collapse border border-gray-400 my-4 text-2xs">
          <tbody>
            <tr>
              <td className="bg-gray-100 font-bold p-1.5 w-20 border border-gray-400 text-center">客戶名稱</td>
              <td className="p-1.5 border border-gray-400 font-semibold">{quote.client.companyName || '-'}</td>
              <td className="bg-gray-100 font-bold p-1.5 w-20 border border-gray-400 text-center">報價單號</td>
              <td className="p-1.5 border border-gray-400 font-mono font-bold">{quote.number}</td>
            </tr>
            <tr>
              <td className="bg-gray-100 font-bold p-1.5 border border-gray-400 text-center">統一編號</td>
              <td className="p-1.5 border border-gray-400 font-mono">{quote.client.taxId || '-'}</td>
              <td className="bg-gray-100 font-bold p-1.5 border border-gray-400 text-center">報價日期</td>
              <td className="p-1.5 border border-gray-400">{quote.date}</td>
            </tr>
            <tr>
              <td className="bg-gray-100 font-bold p-1.5 border border-gray-400 text-center">聯絡窗口</td>
              <td className="p-1.5 border border-gray-400">{quote.client.contactPerson} {quote.client.phone && `(${quote.client.phone})`}</td>
              <td className="bg-gray-100 font-bold p-1.5 border border-gray-400 text-center">有效期限</td>
              <td className="p-1.5 border border-gray-400">{quote.validUntil} ({quote.validDays}天)</td>
            </tr>
            <tr>
              <td className="bg-gray-100 font-bold p-1.5 border border-gray-400 text-center">專案名稱</td>
              <td colSpan={3} className="p-1.5 border border-gray-400 font-bold text-gray-800">{quote.title}</td>
            </tr>
          </tbody>
        </table>

        {/* 項目明細表格 (全格狀) */}
        <table className="w-full border-collapse border border-gray-400 text-2xs">
          <thead>
            <tr className="bg-gray-200 text-gray-900">
              <th className="border border-gray-400 py-1.5 px-2 text-center w-8">項次</th>
              {quote.layout.showCategory && (
                <th className="border border-gray-400 py-1.5 px-2 text-center w-20">類別</th>
              )}
              <th className="border border-gray-400 py-1.5 px-2 text-left">品名規格與說明</th>
              <th className="border border-gray-400 py-1.5 px-2 text-center w-16">數量</th>
              <th className="border border-gray-400 py-1.5 px-2 text-right w-24">單價</th>
              {quote.layout.showDiscount && (
                <th className="border border-gray-400 py-1.5 px-2 text-center w-14">折扣</th>
              )}
              <th className="border border-gray-400 py-1.5 px-2 text-right w-28">金額</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, idx) => {
              const subtotal = calculateItemSubtotal(item);
              return (
                <tr key={item.id}>
                  <td className="border border-gray-400 py-1.5 px-2 text-center font-mono">{idx + 1}</td>
                  {quote.layout.showCategory && (
                    <td className="border border-gray-400 py-1.5 px-2 text-center text-gray-600">
                      {item.category || '-'}
                    </td>
                  )}
                  <td className="border border-gray-400 py-1.5 px-2">
                    <p className="font-bold text-gray-900">{item.name || '-'}</p>
                    {item.description && (
                      <p className="text-gray-500 text-3xs mt-0.5">{item.description}</p>
                    )}
                  </td>
                  <td className="border border-gray-400 py-1.5 px-2 text-center font-mono">
                    {formatNumber(item.quantity)}
                  </td>
                  <td className="border border-gray-400 py-1.5 px-2 text-right font-mono">
                    {formatCurrency(item.unitPrice, quote.currency)}
                  </td>
                  {quote.layout.showDiscount && (
                    <td className="border border-gray-400 py-1.5 px-2 text-center font-mono">
                      {item.discount > 0 ? `${item.discount}%` : '-'}
                    </td>
                  )}
                  <td className="border border-gray-400 py-1.5 px-2 text-right font-mono font-bold">
                    {formatCurrency(subtotal, quote.currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={quote.layout.showCategory ? 3 : 2} className="border border-gray-400 p-2 bg-gray-50 text-gray-700">
                <span className="font-bold">付款方式：</span>{quote.payment.bankName} {quote.payment.accountNumber} ({quote.payment.accountName})
              </td>
              <td colSpan={quote.layout.showDiscount ? 3 : 2} className="border border-gray-400 p-1 text-right text-gray-600 bg-gray-50">
                未稅合計：
              </td>
              <td className="border border-gray-400 p-1 text-right font-mono font-bold">
                {formatCurrency(totals.amountBeforeTax, quote.currency)}
              </td>
            </tr>
            <tr>
              <td colSpan={quote.layout.showCategory ? 3 : 2} className="border border-gray-400 p-2 bg-gray-50 text-gray-700">
                <span className="font-bold">付款條件：</span>{quote.payment.terms || '依合約約定'}
              </td>
              <td colSpan={quote.layout.showDiscount ? 3 : 2} className="border border-gray-400 p-1 text-right text-gray-600 bg-gray-50">
                營業稅 ({quote.tax.rate}%)：
              </td>
              <td className="border border-gray-400 p-1 text-right font-mono font-bold">
                {formatCurrency(totals.taxAmount, quote.currency)}
              </td>
            </tr>
            <tr className="bg-gray-100 font-bold">
              <td colSpan={quote.layout.showCategory ? 3 : 2} className="border border-gray-400 p-2 text-gray-800">
                備註：{quote.notes || '無'}
              </td>
              <td colSpan={quote.layout.showDiscount ? 3 : 2} className="border border-gray-400 p-1.5 text-right text-sm">
                總計含稅：
              </td>
              <td className="border border-gray-400 p-1.5 text-right font-mono text-sm font-black" style={{ color: primaryColor }}>
                {formatCurrency(totals.totalAmount, quote.currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 條款與傳統雙方蓋章格 */}
      <div className="mt-4 pt-2">
        <div className="text-3xs text-gray-600 mb-4 leading-relaxed">
          <p className="font-bold text-gray-800 mb-1">【交易約定條款】：</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            {quote.terms.map((t, i) => (
              <p key={t.id}>
                {i + 1}. {t.title}：{t.content}
              </p>
            ))}
          </div>
        </div>

        {/* 傳統合約對稱簽章蓋印框 */}
        <table className="w-full border-collapse border border-gray-400 text-2xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-1 text-center w-1/2 font-bold">
                報價單位 (甲方蓋章)
              </th>
              <th className="border border-gray-400 p-1 text-center w-1/2 font-bold">
                客戶訂購確認 (乙方蓋章)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 h-20 p-2 align-middle text-center">
                {quote.signatures.partyA ? (
                  <img src={quote.signatures.partyA} alt="甲方簽章" className="max-h-16 mx-auto object-contain" />
                ) : (
                  <span className="text-gray-300 text-3xs">公司大小章或授權簽名</span>
                )}
              </td>
              <td className="border border-gray-400 h-20 p-2 align-middle text-center">
                {quote.signatures.partyB ? (
                  <img src={quote.signatures.partyB} alt="乙方簽章" className="max-h-16 mx-auto object-contain" />
                ) : (
                  <span className="text-gray-300 text-3xs">請蓋公司發票章或簽署回傳</span>
                )}
              </td>
            </tr>
            <tr className="text-3xs text-gray-500">
              <td className="border border-gray-400 px-2 py-1">負責人：{quote.sender.representative}　經辦：{quote.sender.contactPerson}</td>
              <td className="border border-gray-400 px-2 py-1">確認人簽名：_________________</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
