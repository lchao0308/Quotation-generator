import React from 'react';
import { TermItem } from '../../../types/quote';
import { DEFAULT_TERMS } from '../../../utils/demoData';
import { ShieldCheck, Plus, Trash2, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { toast } from '../../../stores/useToastStore';

interface TermsSectionProps {
  terms: TermItem[];
  onChange: (terms: TermItem[]) => void;
}

export const TermsSection: React.FC<TermsSectionProps> = ({ terms, onChange }) => {
  const handleAddTerm = () => {
    const newTerm: TermItem = {
      id: `term-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: '其他條款與約定',
      content: '',
    };
    onChange([...terms, newTerm]);
    toast.success('已新增條款項目');
  };

  const handleUpdateTerm = (index: number, patch: Partial<TermItem>) => {
    const updated = [...terms];
    updated[index] = { ...updated[index], ...patch };
    onChange(updated);
  };

  const handleDeleteTerm = (index: number) => {
    const updated = terms.filter((_, i) => i !== index);
    onChange(updated);
    toast.info('已刪除條款');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...terms];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === terms.length - 1) return;
    const updated = [...terms];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onChange(updated);
  };

  const handleResetDefaults = () => {
    onChange([...DEFAULT_TERMS]);
    toast.success('已重設為標準商業條款');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-800">條款與協議規範 ({terms.length} 條)</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 p-1.5 rounded-lg transition-colors cursor-pointer"
            title="重設為預設條款"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            載入預設
          </button>
          <button
            type="button"
            onClick={handleAddTerm}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            新增條款
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {terms.map((term, index) => (
          <div
            key={term.id}
            className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs hover:border-blue-200 transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-1.5">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs font-bold text-gray-400 font-mono w-4">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={term.title}
                  onChange={(e) => handleUpdateTerm(index, { title: e.target.value })}
                  placeholder="條款標題 (例：付款方式)"
                  className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 w-full max-w-xs"
                />
              </div>

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
                  disabled={index === terms.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="下移"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTerm(index)}
                  className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                  title="刪除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <textarea
              rows={2}
              value={term.content}
              onChange={(e) => handleUpdateTerm(index, { content: e.target.value })}
              placeholder="請輸入具體條款內容規範..."
              className="w-full px-3 py-2 text-xs bg-gray-50/70 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 text-gray-700 resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
