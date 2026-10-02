import React, { useState } from 'react';
import { PaymentInfo, Signatures, PaymentMethodType } from '../../../types/quote';
import { CreditCard, PenTool, Trash2, Landmark, UserCheck } from 'lucide-react';
import { SignatureModal } from '../SignatureModal';
import { toast } from '../../../stores/useToastStore';

interface PaymentSignSectionProps {
  payment: PaymentInfo;
  signatures: Signatures;
  onPaymentChange: (patch: Partial<PaymentInfo>) => void;
  onSignaturesChange: (patch: Partial<Signatures>) => void;
}

export const PaymentSignSection: React.FC<PaymentSignSectionProps> = ({
  payment,
  signatures,
  onPaymentChange,
  onSignaturesChange,
}) => {
  const [activeSignModal, setActiveSignModal] = useState<'partyA' | 'partyB' | null>(null);

  const paymentMethods: { value: PaymentMethodType; label: string }[] = [
    { value: 'remittance', label: '銀行匯款 / 轉帳' },
    { value: 'cash', label: '現金支付' },
    { value: 'credit_card', label: '信用卡' },
    { value: 'other', label: '其他約定方式' },
  ];

  const handleClearSignature = (party: 'partyA' | 'partyB') => {
    onSignaturesChange({ [party]: '' });
    toast.info(`已清除${party === 'partyA' ? '甲方' : '乙方'}簽章`);
  };

  return (
    <div className="space-y-5">
      {/* 付款資訊 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-800">付款與匯款帳號資訊</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">付款方式</label>
            <select
              value={payment.method}
              onChange={(e) => onPaymentChange({ method: e.target.value as PaymentMethodType })}
              className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-800"
            >
              {paymentMethods.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-blue-600" />
              銀行名稱與代碼
            </label>
            <input
              type="text"
              value={payment.bankName}
              onChange={(e) => onPaymentChange({ bankName: e.target.value })}
              placeholder="例：玉山商業銀行 (808)"
              className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">分行名稱</label>
            <input
              type="text"
              value={payment.branchName}
              onChange={(e) => onPaymentChange({ branchName: e.target.value })}
              placeholder="例：信義分行"
              className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">匯款帳號</label>
            <input
              type="text"
              value={payment.accountNumber}
              onChange={(e) => onPaymentChange({ accountNumber: e.target.value })}
              placeholder="例：0123-987-654321"
              className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 font-mono text-gray-800"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">戶名 (戶名全銜)</label>
            <input
              type="text"
              value={payment.accountName}
              onChange={(e) => onPaymentChange({ accountName: e.target.value })}
              placeholder="例：極致工藝科技顧問有限公司"
              className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 text-gray-800"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">付款條件說明</label>
            <input
              type="text"
              value={payment.terms}
              onChange={(e) => onPaymentChange({ terms: e.target.value })}
              placeholder="例：簽約支付 50%，交貨驗收後支付 50%"
              className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* 雙方簽章區塊 */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <UserCheck className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-800">甲乙方合約簽章</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 甲方簽章 */}
          <div className="p-3.5 bg-white border border-gray-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">甲方簽章 (報價方)</span>
              {signatures.partyA && (
                <button
                  type="button"
                  onClick={() => handleClearSignature('partyA')}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  清除
                </button>
              )}
            </div>

            <div className="h-28 border border-dashed border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden p-2">
              {signatures.partyA ? (
                <img
                  src={signatures.partyA}
                  alt="Party A Signature"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-xs text-gray-400">尚未簽章</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveSignModal('partyA')}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5" />
              {signatures.partyA ? '重新簽署 / 更換' : '手寫簽名或上傳圖檔'}
            </button>
          </div>

          {/* 乙方簽章 */}
          <div className="p-3.5 bg-white border border-gray-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">乙方簽章 (確認訂購 / 客戶)</span>
              {signatures.partyB && (
                <button
                  type="button"
                  onClick={() => handleClearSignature('partyB')}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  清除
                </button>
              )}
            </div>

            <div className="h-28 border border-dashed border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden p-2">
              {signatures.partyB ? (
                <img
                  src={signatures.partyB}
                  alt="Party B Signature"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-xs text-gray-400">留白由客戶回簽或預簽</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveSignModal('partyB')}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5" />
              {signatures.partyB ? '重新簽署 / 更換' : '手寫簽名或上傳圖檔'}
            </button>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {activeSignModal && (
        <SignatureModal
          isOpen={!!activeSignModal}
          title={activeSignModal === 'partyA' ? '甲方簽章 (報價方)' : '乙方簽章 (客戶方)'}
          initialSignature={activeSignModal === 'partyA' ? signatures.partyA : signatures.partyB}
          onSave={(dataUrl) => onSignaturesChange({ [activeSignModal]: dataUrl })}
          onClose={() => setActiveSignModal(null)}
        />
      )}
    </div>
  );
};
