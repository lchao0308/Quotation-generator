import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useQuoteStore } from './stores/useQuoteStore';
import { QuoteDashboard } from './components/dashboard/QuoteDashboard';
import { QuoteEditor } from './components/editor/QuoteEditor';
import { FullscreenPreviewPage } from './components/preview/FullscreenPreviewPage';
import { ToastContainer } from './components/common/ToastContainer';

export const App: React.FC = () => {
  const initialize = useQuoteStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <div className="min-h-screen text-gray-800 antialiased selection:bg-blue-100 selection:text-blue-900">
        <Routes>
          <Route path="/" element={<QuoteDashboard />} />
          <Route path="/quote/new" element={<QuoteEditor />} />
          <Route path="/quote/:id" element={<QuoteEditor />} />
          <Route path="/quote/:id/preview" element={<FullscreenPreviewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ToastContainer />
      </div>
    </BrowserRouter>
  );
};

export default App;
