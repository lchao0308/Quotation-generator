import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QuoteDashboard } from './components/dashboard/QuoteDashboard';
import { QuoteEditor } from './components/editor/QuoteEditor';
import { FullscreenPreviewPage } from './components/preview/FullscreenPreviewPage';
import { ToastContainer } from './components/common/ToastContainer';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900">
        <Routes>
          {/* 首頁 / 報價單總覽列表 */}
          <Route path="/" element={<QuoteDashboard />} />

          {/* 新增報價單 (轉址進入自動產生的單號頁面) */}
          <Route path="/quote/new" element={<QuoteEditor isNew />} />

          {/* 編輯既有報價單 */}
          <Route path="/quote/:id" element={<QuoteEditor />} />

          {/* 全螢幕預覽模式 */}
          <Route path="/quote/:id/preview" element={<FullscreenPreviewPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* 全域 Toast 通知容器 */}
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
};

export default App;
