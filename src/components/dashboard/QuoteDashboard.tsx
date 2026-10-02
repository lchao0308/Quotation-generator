import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuoteStore } from '../../stores/useQuoteStore';
import { Quotation, QuotationStatus } from '../../types/quote';
import { calculateQuotationTotals } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { exportQuotationToPdf } from '../../utils/pdfGenerator';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Plus,
  Search,
  ArrowUpDown,
  FileText,
  Copy,
  Edit,
  Trash2,
  Download,
  Eye,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  Send,
  AlertCircle,
  Inbox,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from '../../stores/useToastStore';

export const QuoteDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    quotations,
    searchQuery,
    statusFilter,
    sortBy,
    sortOrder,
    setSearchQuery,
    setStatusFilter,
    setSortBy,
    setSortOrder,
    getFilteredQuotations,
    duplicateQuotation,
    deleteQuotation,
    createNewQuotation,
  } = useQuoteStore();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredList = getFilteredQuotations();

  const handleCreateNew = () => {
    const newQuote = createNewQuotation();
    toast.success('已建立新報價單草稿');
    navigate(`/quote/${newQuote.id}`);
  };

  const handleDuplicate = (id: string) => {
    const dup = duplicateQuotation(id);
    if (dup) {
      toast.success(`已成功複製為 ${dup.number}`);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteQuotation(deleteTargetId);
      toast.success('已成功刪除報價單');
      setDeleteTargetId(null);
    }
  };

  const handleDirectDownloadPdf = (quote: Quotation) => {
    // 建立臨時預覽隱藏節點或快速導引至預覽頁
    navigate(`/quote/${quote.id}/preview?download=true`);
  };

  const statusBadges: Record<
    QuotationStatus,
    { label: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    draft: { label: '草稿', bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock },
    sent: { label: '已寄出', bg: 'bg-blue-50', text: 'text-blue-700', icon: Send },
    accepted: { label: '已接受', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 },
    completed: { label: '已完成', bg: 'bg-indigo-50', text: 'text-indigo-700', icon: CheckCircle2 },
    expired: { label: '已過期', bg: 'bg-amber-50', text: 'text-amber-700', icon: AlertCircle },
  };

  const filterTabs: { id: QuotationStatus | 'all'; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: 'draft', label: '草稿' },
    { id: 'sent', label: '已寄出' },
    { id: 'accepted', label: '已接受' },
    { id: 'completed', label: '已完成' },
    { id: 'expired', label: '已過期' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 頂部 Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">報價單管理</h1>
              <p className="text-xs text-gray-500">專業商務報價單生成與追蹤系統</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-blue-200 transition-all cursor-pointer hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>新增報價單</span>
          </button>
        </div>
      </header>

      {/* 主要內容區 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* 搜尋與篩選列 */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* 搜尋框 */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋報價單編號、客戶名稱、專案標題..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  清除
                </button>
              )}
            </div>

            {/* 排序選擇 */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs text-gray-700 font-medium py-1 pr-2 outline-none cursor-pointer"
                >
                  <option value="createdAt">最新建立</option>
                  <option value="date">報價日期</option>
                  <option value="totalAmount">金額高低</option>
                  <option value="clientName">客戶名稱</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors cursor-pointer"
                title="切換升冪/降冪"
              >
                {sortOrder === 'asc' ? '↑ 升冪' : '↓ 降冪'}
              </button>
            </div>
          </div>

          {/* 狀態篩選 Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-gray-100">
            {filterTabs.map((tab) => {
              const isActive = statusFilter === tab.id;
              const count =
                tab.id === 'all'
                  ? quotations.length
                  : quotations.filter((q) => q.status === tab.id).length;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-2xs px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 列表內容區塊 */}
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <Inbox className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">目前沒有符合條件的報價單</h3>
              <p className="text-xs text-gray-500 mt-1">
                {searchQuery || statusFilter !== 'all'
                  ? '請嘗試調整搜尋關鍵字或篩選狀態'
                  : '立即建立您的第一份專業商業報價單！'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              建立第一份報價單
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredList.map((quote) => {
              const totals = calculateQuotationTotals(quote.items, quote.tax);
              const badge = statusBadges[quote.status] || statusBadges.draft;
              const StatusIcon = badge.icon;

              return (
                <div
                  key={quote.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs hover:shadow-card hover:border-blue-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* 卡片頂部：單號與狀態 */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {quote.number}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-2xs font-semibold ${badge.bg} ${badge.text}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </div>

                    {/* 標題與客戶 */}
                    <h3
                      onClick={() => navigate(`/quote/${quote.id}`)}
                      className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
                      title={quote.title}
                    >
                      {quote.title || '無標題報價單'}
                    </h3>

                    <div className="mt-2.5 space-y-1.5 text-xs text-gray-600">
                      <p className="flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="font-medium text-gray-800">
                          {quote.client.companyName || '(未設定客戶抬頭)'}
                        </span>
                      </p>
                      <p className="flex items-center gap-1.5 text-2xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>報價日期：{quote.date}</span>
                        <span className="mx-1">·</span>
                        <span>至 {quote.validUntil}</span>
                      </p>
                    </div>

                    {/* 金額展示 */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-baseline justify-between">
                      <span className="text-2xs text-gray-400">含稅總計</span>
                      <span className="text-base font-extrabold text-gray-900 font-mono">
                        {formatCurrency(totals.totalAmount, quote.currency)}
                      </span>
                    </div>
                  </div>

                  {/* 底部操作按鈕列 */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/quote/${quote.id}`)}
                      className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      title="編輯報價單"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      編輯
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/quote/${quote.id}/preview`)}
                      className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      title="全螢幕預覽"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      預覽
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(quote.id)}
                      className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      title="複製產生新單"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      複製
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(quote.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="刪除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 刪除確認 Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="確定要刪除這份報價單嗎？"
        message="此操作將從瀏覽器本機儲存空間中永久移除此筆報價單資料，刪除後將無法還原。"
        confirmText="確認刪除"
        cancelText="取消保留"
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
