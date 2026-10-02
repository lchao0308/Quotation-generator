import React from 'react';
import { Quotation, QuotationStatus } from '../../../types/quote';
import { calculateValidUntil } from '../../../utils/calculations';
import { Calendar, Hash, Tag, FileText, Clock } from 'lucide-react';

interface BasicInfoSectionProps {
  quote: Quotation;
  onChange: (patch: Partial<Quotation>) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ quote, onChange }) => {
  const handleDateChange = (newDate: string) => {
    const validUntil = calculateValidUntil(newDate, quote.validDays);
    onChange({ date: newDate, validUntil });
  };

  const handleValidDaysChange = (days: number) => {
    const validDays = Math.max(1, days || 1);
    const validUntil = calculateValidUntil(quote.date, validDays);
    onChange({ validDays, validUntil });
  };

  const statusOptions: { value: QuotationStatus; label: string; color: string }[] = [
    { value: 'draft', label: '草稿', color: 'bg-gray-100 text-gray-700' },
    { value: 'sent', label: '已寄出', color: 'bg-blue-100 text-blue-700' },
    { value: 'accepted', label: '已接受', color: 'bg-emerald-100 text-emerald-700' },
    { value: 'completed', label: '已完成', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'expired', label: '已過期', color: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 標題 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            報價單標題 <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={quote.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="例如：產品開發與模具製作報價單"
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-800"
          />
        </div>

        {/* 報價單編號 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-blue-600" />
            報價單編號 <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={quote.number}
            onChange={(e) => onChange({ number: e.target.value })}
            placeholder="例如：Q-20260909-001"
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono text-gray-800"
          />
        </div>

        {/* 狀態 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">報價狀態</label>
          <select
            value={quote.status}
            onChange={(e) => onChange({ status: e.target.value as QuotationStatus })}
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 font-medium"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 報價日期 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            報價日期
          </label>
          <input
            type="date"
            value={quote.date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
          />
        </div>

        {/* 有效天數與有效日期 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            有效期限 (天數)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="365"
              value={quote.validDays}
              onChange={(e) => handleValidDaysChange(parseInt(e.target.value, 10))}
              className="w-24 px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 text-center font-medium"
            />
            <span className="text-xs text-gray-500">天 (至 {quote.validUntil || '---'})</span>
          </div>
        </div>

        {/* 備註說明 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            報價單備註 / 結語
          </label>
          <textarea
            rows={2}
            value={quote.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="例如：感謝貴公司支持，若有任何問題歡迎隨時聯繫！"
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 resize-none"
          />
        </div>
      </div>
    </div>
  );
};
