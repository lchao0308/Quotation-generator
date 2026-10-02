import React from 'react';
import { LayoutSettings, TemplateType } from '../../../types/quote';
import { Palette, LayoutTemplate, Sliders, Check } from 'lucide-react';
import { toast } from '../../../stores/useToastStore';

interface BrandLayoutSectionProps {
  layout: LayoutSettings;
  onChange: (patch: Partial<LayoutSettings>) => void;
}

export const BrandLayoutSection: React.FC<BrandLayoutSectionProps> = ({ layout, onChange }) => {
  const templates: { id: TemplateType; name: string; desc: string; tag: string }[] = [
    {
      id: 'professional',
      name: '專業商務 (Professional)',
      desc: '科技業與設計顧問推薦，清晰雙色頂部與醒目總計框',
      tag: '最受歡迎',
    },
    {
      id: 'minimal',
      name: '極簡現代 (Minimal)',
      desc: '精緻細線條、大留白、現代高雅無襯線風格',
      tag: '高雅質感',
    },
    {
      id: 'corporate',
      name: '企業格狀 (Corporate)',
      desc: '傳統嚴謹工程與製造合約表格，甲乙方對稱排版',
      tag: '傳統工廠/工程',
    },
  ];

  const presetColors = [
    { name: '經典科技藍', value: '#2563EB' },
    { name: '商務墨黑', value: '#1F2937' },
    { name: '典雅墨綠', value: '#059669' },
    { name: '尊爵深紫', value: '#7C3AED' },
    { name: '熱情琥珀', value: '#D97706' },
    { name: '精緻海軍藍', value: '#1E3A8A' },
  ];

  return (
    <div className="space-y-6">
      {/* 模板選擇 */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
          <LayoutTemplate className="w-3.5 h-3.5 text-blue-600" />
          報價單樣式模板 (3 款精選版型)
        </label>
        <div className="grid grid-cols-1 gap-2.5">
          {templates.map((t) => {
            const isSelected = layout.template === t.id;
            return (
              <div
                key={t.id}
                onClick={() => {
                  onChange({ template: t.id });
                  toast.success(`已套用「${t.name}」模板`);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-800">{t.name}</span>
                    <span className="px-2 py-0.5 text-2xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-blue-600 text-white' : 'border border-gray-300'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 品牌主色 */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-blue-600" />
          品牌主題色系
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {presetColors.map((color) => {
            const isSelected = layout.primaryColor.toLowerCase() === color.value.toLowerCase();
            return (
              <button
                key={color.value}
                type="button"
                onClick={() => onChange({ primaryColor: color.value })}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-gray-800 bg-gray-50 shadow-xs scale-102'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span
                  className="w-6 h-6 rounded-full shadow-2xs border border-white"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-2xs font-medium text-gray-700 truncate w-full text-center">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* 自訂色彩選擇器 */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-gray-500">自訂色碼：</span>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1">
            <input
              type="color"
              value={layout.primaryColor}
              onChange={(e) => onChange({ primaryColor: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer border-0 p-0"
            />
            <span className="text-xs font-mono font-medium text-gray-700 uppercase">
              {layout.primaryColor}
            </span>
          </div>
        </div>
      </div>

      {/* 欄位顯示開關 */}
      <div className="pt-2 border-t border-gray-100">
        <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-blue-600" />
          報價單欄位顯示控制
        </label>
        <div className="space-y-2">
          <label className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-xs font-medium text-gray-700">顯示項目「類別」欄位</span>
            <input
              type="checkbox"
              checked={layout.showCategory}
              onChange={(e) => onChange({ showCategory: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-xs font-medium text-gray-700">顯示項目「折扣 (%)」欄位</span>
            <input
              type="checkbox"
              checked={layout.showDiscount}
              onChange={(e) => onChange({ showDiscount: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
