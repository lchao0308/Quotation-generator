import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuoteStore } from '../../stores/useQuoteStore';
import type { Quotation } from '../../types/quote';
import { BasicInfoSection } from './sections/BasicInfoSection';
import { SenderSection } from './sections/SenderSection';
import { ClientSection } from './sections/ClientSection';
import { ItemsSection } from './sections/ItemsSection';
import { TaxCurrencySection } from './sections/TaxCurrencySection';
import { TermsSection } from './sections/TermsSection';
import { PaymentSignSection } from './sections/PaymentSignSection';
import { BrandLayoutSection } from './sections/BrandLayoutSection';
import { QuotePreview } from '../preview/QuotePreview';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Building2,
  Users,
  ListOrdered,
  Calculator,
  ShieldCheck,
  CreditCard,
  Palette,
  Eye,
  Edit3,
  Copy,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { toast } from '../../stores/useToastStore';

export const QuoteEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    getQuotation,
    currentQuotation,
    setCurrentQuotation,
    updateCurrentQuotation,
    duplicateQuotation,
    createNewQuotation,
    lastSavedAt,
  } = useQuoteStore();

  const [activeTab, setActiveTab] = useState<string>('basic');
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  // 初始化或載入對應報價單
  useEffect(() => {
    if (id === 'new') {
      const newQuote = createNewQuotation();
      navigate(`/quote/${newQuote.id}`, { replace: true });
      return;
    }

    if (id) {
      const existing = getQuotation(id);
      if (existing) {
        setCurrentQuotation(existing);
      } else {
        toast.error('找不到該報價單');
        navigate('/');
      }
    }
  }, [id]);

  if (!currentQuotation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">載入報價單中...</p>
        </div>
      </div>
    );
  }

  const quote = currentQuotation;

  const handleDuplicate = () => {
    const duplicated = duplicateQuotation(quote.id);
    if (duplicated) {
      toast.success(`已複製出新報價單：${duplicated.number}`);
      navigate(`/quote/${duplicated.id}`);
    }
  };

  const tabs = [
    { id: 'basic', label: '01 基本資料', icon: FileText },
    { id: 'sender', label: '02 報價方', icon: Building2 },
    { id: 'client', label: '03 客戶資料', icon: Users },
    { id: 'items', label: '04 報價項目', icon: ListOrdered },
    { id: 'tax', label: '05 稅金幣別', icon: Calculator },
    { id: 'terms', label: '06 條款規範', icon: ShieldCheck },
    { id: 'payment', label: '07 付款簽章', icon: CreditCard },
    { id: 'brand', label: '08 版面品牌', icon: Palette },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 頂部導覽列 */}
      <header className="no-print sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            title="返回列表"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate max-w-xs sm:max-w-md">
                {quote.title || '無標題報價單'}
              </h1>
              <span className="px-2 py-0.5 text-2xs font-mono font-semibold bg-blue-50 text-blue-700 rounded-md">
                {quote.number}
              </span>
            </div>
            <div className="flex items-center gap-2 text-2xs text-gray-400 mt-0.5">
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="w-3 h-3" />
                已自動即時儲存
              </span>
              {lastSavedAt && (
                <span>
                  · 最後更新於 {new Date(lastSavedAt).toLocaleTimeString('zh-TW', { hour12: false })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 右側操作按鈕 */}
        <div className="flex items-center gap-2">
          {/* Mobile View Toggle */}
          <div className="lg:hidden flex items-center bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMobileView('editor')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mobileView === 'editor'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-gray-500'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              編輯
            </button>
            <button
              type="button"
              onClick={() => setMobileView('preview')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mobileView === 'preview'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-gray-500'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              預覽
            </button>
          </div>

          <button
            type="button"
            onClick={handleDuplicate}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            複製此單
          </button>

          <button
            type="button"
            onClick={() => navigate(`/quote/${quote.id}/preview`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            全螢幕檢視
          </button>
        </div>
      </header>

      {/* 核心雙欄佈局 (Desktop: 45% 編輯區 / 55% 固定預覽區) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 左側 45% (lg:col-span-5) 編輯區塊 */}
          <div
            className={`lg:col-span-5 space-y-4 ${
              mobileView === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Tabs 橫向快速切換選單 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-2xs overflow-x-auto">
              <div className="flex items-center gap-1 min-w-max">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Tab 內容卡片 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs">
              {activeTab === 'basic' && (
                <BasicInfoSection
                  quote={quote}
                  onChange={(patch) => updateCurrentQuotation(patch)}
                />
              )}

              {activeTab === 'sender' && (
                <SenderSection
                  sender={quote.sender}
                  onChange={(patch) =>
                    updateCurrentQuotation((prev) => ({
                      ...prev,
                      sender: { ...prev.sender, ...patch },
                    }))
                  }
                />
              )}

              {activeTab === 'client' && (
                <ClientSection
                  client={quote.client}
                  onChange={(patch) =>
                    updateCurrentQuotation((prev) => ({
                      ...prev,
                      client: { ...prev.client, ...patch },
                    }))
                  }
                />
              )}

              {activeTab === 'items' && (
                <ItemsSection
                  items={quote.items}
                  currency={quote.currency}
                  showCategory={quote.layout.showCategory}
                  showDiscount={quote.layout.showDiscount}
                  onChange={(items) => updateCurrentQuotation({ items })}
                />
              )}

              {activeTab === 'tax' && (
                <TaxCurrencySection
                  tax={quote.tax}
                  currency={quote.currency}
                  items={quote.items}
                  onTaxChange={(patch) =>
                    updateCurrentQuotation((prev) => ({
                      ...prev,
                      tax: { ...prev.tax, ...patch },
                    }))
                  }
                  onCurrencyChange={(currency) => updateCurrentQuotation({ currency })}
                />
              )}

              {activeTab === 'terms' && (
                <TermsSection
                  terms={quote.terms}
                  onChange={(terms) => updateCurrentQuotation({ terms })}
                />
              )}

              {activeTab === 'payment' && (
                <PaymentSignSection
                  payment={quote.payment}
                  signatures={quote.signatures}
                  onPaymentChange={(patch) =>
                    updateCurrentQuotation((prev) => ({
                      ...prev,
                      payment: { ...prev.payment, ...patch },
                    }))
                  }
                  onSignaturesChange={(patch) =>
                    updateCurrentQuotation((prev) => ({
                      ...prev,
                      signatures: { ...prev.signatures, ...patch },
                    }))
                  }
                />
              )}

              {activeTab === 'brand' && (
                <BrandLayoutSection
                  layout={quote.layout}
                  onChange={(patch) =>
                    updateCurrentQuotation((prev) => ({
                      ...prev,
                      layout: { ...prev.layout, ...patch },
                    }))
                  }
                />
              )}

              {/* 下一步切換按鈕 */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                <span className="text-gray-400">分頁 8 步驟指引</span>
                {(() => {
                  const currentIndex = tabs.findIndex((t) => t.id === activeTab);
                  if (currentIndex < tabs.length - 1) {
                    const nextTab = tabs[currentIndex + 1];
                    return (
                      <button
                        type="button"
                        onClick={() => setActiveTab(nextTab.id)}
                        className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        前往 {nextTab.label}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>

          {/* 右側 55% (lg:col-span-7) 即時預覽區 (Sticky 固定在視窗中) */}
          <div
            className={`lg:col-span-7 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] ${
              mobileView === 'editor' ? 'hidden lg:block' : 'block'
            }`}
          >
            <QuotePreview
              quote={quote}
              onTemplateChange={(template) =>
                updateCurrentQuotation((prev) => ({
                  ...prev,
                  layout: { ...prev.layout, template },
                }))
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};
