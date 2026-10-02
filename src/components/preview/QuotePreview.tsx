import React, { useState } from 'react';
import { Quotation } from '../../types/quote';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { exportQuotationToPdf, printQuotation } from '../../utils/pdfGenerator';
import { Download, Printer, ZoomIn, ZoomOut, Maximize2, Loader2, Sparkles } from 'lucide-react';

interface QuotePreviewProps {
  quote: Quotation;
  onTemplateChange?: (template: Quotation['layout']['template']) => void;
}

export const QuotePreview: React.FC<QuotePreviewProps> = ({ quote, onTemplateChange }) => {
  const [scale, setScale] = useState<number>(0.85);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExportPdf = () => {
    exportQuotationToPdf('quotation-print-area', quote, setIsExporting);
  };

  const renderTemplate = () => {
    switch (quote.layout.template) {
      case 'minimal':
        return <MinimalTemplate quote={quote} />;
      case 'corporate':
        return <CorporateTemplate quote={quote} />;
      case 'professional':
      default:
        return <ProfessionalTemplate quote={quote} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100/80 rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
      {/* 頂部操作工具列 (PDF 下載、列印、縮放、版型切換) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            即時預覽 (A4)
          </span>

          {onTemplateChange && (
            <div className="hidden sm:flex items-center gap-1 ml-2 bg-gray-100 p-0.5 rounded-lg text-2xs font-medium">
              <button
                type="button"
                onClick={() => onTemplateChange('professional')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  quote.layout.template === 'professional'
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                商務
              </button>
              <button
                type="button"
                onClick={() => onTemplateChange('minimal')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  quote.layout.template === 'minimal'
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                極簡
              </button>
              <button
                type="button"
                onClick={() => onTemplateChange('corporate')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  quote.layout.template === 'corporate'
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                格狀
              </button>
            </div>
          )}
        </div>

        {/* 右側按鈕：縮放、列印、下載 PDF */}
        <div className="flex items-center gap-2">
          {/* 縮放控制 */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 text-gray-600">
            <button
              type="button"
              onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
              className="p-1 hover:bg-white rounded transition-colors"
              title="縮小"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-2xs font-mono px-1 min-w-9 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setScale((s) => Math.min(1.2, s + 0.1))}
              className="p-1 hover:bg-white rounded transition-colors"
              title="放大"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setScale(0.85)}
              className="p-1 hover:bg-white rounded transition-colors"
              title="適中"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 列印 */}
          <button
            type="button"
            onClick={printQuotation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            title="瀏覽器原生列印"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">列印</span>
          </button>

          {/* 下載 PDF */}
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow-sm shadow-blue-200 transition-colors cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>生成中...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>下載 PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 畫布視窗與可捲動 A4 紙張區域 */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="shrink-0"
        >
          {/* A4 比例畫布：寬 210mm, 最小高 297mm */}
          <div
            id="quotation-print-area"
            className="bg-white shadow-xl shadow-gray-200/80 rounded-sm overflow-hidden"
            style={{
              width: '210mm',
              minHeight: '297mm',
              boxSizing: 'border-box',
            }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};
