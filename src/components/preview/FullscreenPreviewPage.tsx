import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuoteStore } from '../../stores/useQuoteStore';
import { QuotePreview } from './QuotePreview';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { toast } from '../../stores/useToastStore';

export const FullscreenPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getQuotation, setCurrentQuotation, currentQuotation } = useQuoteStore();

  useEffect(() => {
    if (id) {
      const q = getQuotation(id);
      if (q) {
        setCurrentQuotation(q);
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
          <p className="text-sm text-gray-500 font-medium">載入預覽中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 頂部導覽 */}
      <div className="no-print bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/quote/${currentQuotation.id}`)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              全螢幕檢視與列印 — {currentQuotation.title}
            </h2>
            <span className="text-2xs font-mono text-gray-400">
              {currentQuotation.number}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/quote/${currentQuotation.id}`)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          返回編輯區
        </button>
      </div>

      {/* 預覽核心 */}
      <div className="flex-1 p-4 sm:p-8 flex justify-center items-start">
        <div className="max-w-5xl w-full h-full">
          <QuotePreview quote={currentQuotation} />
        </div>
      </div>
    </div>
  );
};
