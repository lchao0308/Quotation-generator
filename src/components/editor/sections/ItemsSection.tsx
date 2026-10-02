import React from 'react';
import { QuoteItem, Currency } from '../../../types/quote';
import { calculateItemSubtotal, calculateItemOriginal } from '../../../utils/calculations';
import { formatCurrency, formatNumber } from '../../../utils/formatters';
import { Plus, Trash2, Copy, ArrowUp, ArrowDown, ListOrdered } from 'lucide-react';
import { toast } from '../../../stores/useToastStore';

interface ItemsSectionProps {
  items: QuoteItem[];
  currency: Currency;
  showCategory: boolean;
  showDiscount: boolean;
  onChange: (items: QuoteItem[]) => void;
}

export const ItemsSection: React.FC<ItemsSectionProps> = ({
  items,
  currency,
  showCategory,
  showDiscount,
  onChange,
}) => {
  const handleAddItem = () => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category: items.length > 0 ? items[items.length - 1].category : '一般項目',
      name: '',
      description: '',
      unitPrice: 0,
      quantity: 1,
      discount: 0,
    };
    onChange([...items, newItem]);
    toast.success('已新增報價項目');
  };

  const handleUpdateItem = (index: number, patch: Partial<QuoteItem>) => {
    const updated = [...items];
    updated[index] = { ...updated[index], ...patch };
    onChange(updated);
  };

  const handleDeleteItem = (index: number) => {
    if (items.length <= 1) {
      toast.warning('報價單至少需保留一個項目');
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
    toast.info('已刪除該項目');
  };

  const handleDuplicateItem = (index: number) => {
    const origin = items[index];
    const cloned: QuoteItem = {
      ...origin,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${origin.name} (複製)`,
    };
    const updated = [...items];
    updated.splice(index + 1, 0, cloned);
    onChange(updated);
    toast.success('已複製該項目');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-800">報價明細列表 ({items.length} 項)</h3>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          新增項目
        </button>
      </div>

      {/* Items list card */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const subtotal = calculateItemSubtotal(item);
          const original = calculateItemOriginal(item);

          return (
            <div
              key={item.id}
              className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs hover:border-blue-200 transition-all space-y-3"
            >
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                  {index + 1}
                </span>

                {/* 快捷操作按鈕 */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="上移"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === items.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="下移"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicateItem(index)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="複製項目"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                    title="刪除項目"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 主要欄位 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {showCategory && (
                  <div className="md:col-span-3">
                    <label className="block text-2xs font-medium text-gray-500 mb-1">類別</label>
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => handleUpdateItem(index, { category: e.target.value })}
                      placeholder="例：模具費"
                      className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 text-gray-800"
                    />
                  </div>
                )}

                <div className={showCategory ? 'md:col-span-9' : 'md:col-span-12'}>
                  <label className="block text-2xs font-medium text-gray-500 mb-1">
                    項目名稱 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateItem(index, { name: e.target.value })}
                    placeholder="例：塑膠射出模具"
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 font-medium text-gray-800"
                  />
                </div>

                <div className="md:col-span-12">
                  <label className="block text-2xs font-medium text-gray-500 mb-1">規格 / 詳細說明</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(index, { description: e.target.value })}
                    placeholder="例：單穴模具、SKD61 高硬度加工、保固30萬模次"
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 text-gray-700"
                  />
                </div>

                {/* 數量、單價、折扣、小計 */}
                <div className="grid grid-cols-4 md:col-span-12 gap-2 pt-1 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                  <div>
                    <label className="block text-2xs font-medium text-gray-500 mb-1">數量</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.quantity === 0 ? '' : item.quantity}
                      onChange={(e) =>
                        handleUpdateItem(index, {
                          quantity: Math.max(0, parseFloat(e.target.value) || 0),
                        })
                      }
                      placeholder="0"
                      className="w-full px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:border-blue-500 text-right font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-medium text-gray-500 mb-1">單價</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.unitPrice === 0 ? '' : item.unitPrice}
                      onChange={(e) =>
                        handleUpdateItem(index, {
                          unitPrice: Math.max(0, parseFloat(e.target.value) || 0),
                        })
                      }
                      placeholder="0"
                      className="w-full px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:border-blue-500 text-right font-mono"
                    />
                  </div>

                  {showDiscount ? (
                    <div>
                      <label className="block text-2xs font-medium text-gray-500 mb-1">折扣 (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount === 0 ? '' : item.discount}
                        onChange={(e) =>
                          handleUpdateItem(index, {
                            discount: Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)),
                          })
                        }
                        placeholder="0%"
                        className="w-full px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:border-blue-500 text-right font-mono"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-2xs font-medium text-gray-400 mb-1">原小計</label>
                      <div className="px-2 py-1.5 text-xs text-gray-500 text-right font-mono">
                        {formatNumber(original)}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-2xs font-semibold text-blue-600 mb-1">折後小計</label>
                    <div className="px-2 py-1.5 text-xs font-bold text-gray-900 text-right font-mono truncate">
                      {formatCurrency(subtotal, currency)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleAddItem}
        className="w-full py-2.5 border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl text-xs font-medium text-gray-600 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        新增一筆報價項目
      </button>
    </div>
  );
};
