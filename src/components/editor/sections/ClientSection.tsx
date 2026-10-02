import React from 'react';
import { ClientInfo } from '../../../types/quote';
import { isValidTaiwanTaxId, isValidEmail } from '../../../utils/formatters';
import { Building, Phone, Mail, MapPin, User, FileText } from 'lucide-react';

interface ClientSectionProps {
  client: ClientInfo;
  onChange: (patch: Partial<ClientInfo>) => void;
}

export const ClientSection: React.FC<ClientSectionProps> = ({ client, onChange }) => {
  const isTaxIdValid = !client.taxId || isValidTaiwanTaxId(client.taxId);
  const isEmailValid = isValidEmail(client.email);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 客戶公司名稱 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-blue-600" />
            客戶公司 / 抬頭名稱 <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={client.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="例如：未來生活智慧科技股份有限公司"
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-800"
          />
        </div>

        {/* 客戶統一編號 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            客戶統一編號 (8 碼)
          </label>
          <input
            type="text"
            maxLength={8}
            value={client.taxId}
            onChange={(e) => onChange({ taxId: e.target.value.replace(/\D/g, '') })}
            placeholder="例如：24681357"
            className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl focus:ring-2 transition-all font-mono text-gray-800 ${
              !isTaxIdValid
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {!isTaxIdValid && (
            <p className="text-xs text-rose-500 mt-1">統一編號格式需為 8 碼有效數字</p>
          )}
        </div>

        {/* 聯絡人 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600" />
            窗口 / 聯絡人姓名
          </label>
          <input
            type="text"
            value={client.contactPerson}
            onChange={(e) => onChange({ contactPerson: e.target.value })}
            placeholder="例如：張雅婷 協理"
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
          />
        </div>

        {/* 電話 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            聯絡電話
          </label>
          <input
            type="text"
            value={client.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="例如：03-578-9988"
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            電子郵件
          </label>
          <input
            type="email"
            value={client.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="例如：yt.chang@futurelife.io"
            className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl focus:ring-2 transition-all text-gray-800 ${
              !isEmailValid
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
        </div>

        {/* 地址 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            客戶地址
          </label>
          <input
            type="text"
            value={client.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="例如：新竹市東區光復路二段 101 號 8 樓"
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
          />
        </div>

        {/* 備註 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            客戶特別備註
          </label>
          <textarea
            rows={2}
            value={client.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="例如：特定聯繫時間、收件人注意事項等"
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 resize-none"
          />
        </div>
      </div>
    </div>
  );
};
