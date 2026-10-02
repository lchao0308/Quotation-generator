import React from 'react';
import { SenderInfo } from '../../../types/quote';
import { isValidTaiwanTaxId, isValidEmail } from '../../../utils/formatters';
import { Building2, Upload, Trash2, Image, Globe, Mail, Phone, MapPin, User } from 'lucide-react';
import { toast } from '../../../stores/useToastStore';

interface SenderSectionProps {
  sender: SenderInfo;
  onChange: (patch: Partial<SenderInfo>) => void;
}

export const SenderSection: React.FC<SenderSectionProps> = ({ sender, onChange }) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('請上傳有效的圖片檔案 (PNG, JPG, SVG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo 圖片大小不可超過 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onChange({ logo: base64 });
      toast.success('公司 Logo 已上傳更新');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onChange({ logo: '' });
    toast.info('Logo 已移除');
  };

  const isTaxIdValid = !sender.taxId || isValidTaiwanTaxId(sender.taxId);
  const isEmailValid = isValidEmail(sender.email);

  return (
    <div className="space-y-4">
      {/* Logo 上傳區塊 */}
      <div className="flex items-center gap-4 p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
        <div className="w-20 h-20 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
          {sender.logo ? (
            <img src={sender.logo} alt="Company Logo" className="w-full h-full object-contain p-1" />
          ) : (
            <Image className="w-8 h-8 text-gray-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-700 mb-1">公司商標 Logo</p>
          <p className="text-xs text-gray-400 mb-2">支援 PNG, JPG, SVG 格式（建議透明背景）</p>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              上傳 Logo
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            {sender.logo && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                移除
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 公司名稱 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            報價方公司名稱 <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={sender.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="例如：極致工藝科技顧問有限公司"
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-800"
          />
        </div>

        {/* 統一編號 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            統一編號 (8 碼)
          </label>
          <input
            type="text"
            maxLength={8}
            value={sender.taxId}
            onChange={(e) => onChange({ taxId: e.target.value.replace(/\D/g, '') })}
            placeholder="例如：83124567"
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

        {/* 負責人 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600" />
            負責人姓名
          </label>
          <input
            type="text"
            value={sender.representative}
            onChange={(e) => onChange({ representative: e.target.value })}
            placeholder="例如：林大為"
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
          />
        </div>

        {/* 聯絡人 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">業務聯絡人</label>
          <input
            type="text"
            value={sender.contactPerson}
            onChange={(e) => onChange({ contactPerson: e.target.value })}
            placeholder="例如：陳俊宏"
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
            value={sender.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="例如：02-2789-5678"
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            聯絡 Email
          </label>
          <input
            type="email"
            value={sender.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="例如：service@apex-craft.com.tw"
            className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl focus:ring-2 transition-all text-gray-800 ${
              !isEmailValid
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
        </div>

        {/* 官方網站 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            公司網站
          </label>
          <input
            type="text"
            value={sender.website}
            onChange={(e) => onChange({ website: e.target.value })}
            placeholder="例如：https://www.apex-craft.com.tw"
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
          />
        </div>

        {/* 公司地址 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            營業地址
          </label>
          <input
            type="text"
            value={sender.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="例如：台北市信義區信義路五段 7 號 35 樓"
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
          />
        </div>
      </div>
    </div>
  );
};
