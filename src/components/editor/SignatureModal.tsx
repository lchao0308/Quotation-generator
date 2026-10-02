import React, { useRef, useState, useEffect } from 'react';
import { X, RotateCcw, Check, Upload, PenTool } from 'lucide-react';
import { toast } from '../../stores/useToastStore';

interface SignatureModalProps {
  isOpen: boolean;
  title: string;
  initialSignature?: string;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  title,
  initialSignature,
  onSave,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');
  const [uploadedImage, setUploadedImage] = useState<string>('');

  useEffect(() => {
    if (isOpen && mode === 'draw') {
      setTimeout(initCanvas, 50);
    }
  }, [isOpen, mode]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Support High DPI
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Clear background to transparent
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.closePath();
  };

  const handleClear = () => {
    initCanvas();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('請上傳有效的圖片檔案 (PNG, JPG, SVG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('檔案大小不可超過 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setUploadedImage(base64);
      toast.success('簽名圖片載入成功');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) {
        toast.warning('請先在畫布上簽名');
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    } else {
      if (!uploadedImage) {
        toast.warning('請先上傳簽名圖檔');
        return;
      }
      onSave(uploadedImage);
    }
    toast.success('簽名已儲存');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 mt-4 p-1 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              mode === 'draw'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <PenTool className="w-4 h-4" />
            線上親筆手寫
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              mode === 'upload'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            上傳簽名圖檔
          </button>
        </div>

        <div className="mt-4">
          {mode === 'draw' ? (
            <div className="flex flex-col items-center">
              <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 relative overflow-hidden touch-none cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full block"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 text-sm">
                    在此區域滑鼠或觸控手寫簽名
                  </div>
                )}
              </div>
              <div className="w-full flex justify-between items-center mt-2 px-1 text-xs text-gray-500">
                <span>支援觸控筆與手機手寫</span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 text-gray-600 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  清空重新簽署
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <label className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100/50 transition-colors p-4">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded signature"
                    className="max-h-36 max-w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center text-gray-500">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700">點擊上傳簽名圖檔</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG, SVG (建議去背透明背景)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {uploadedImage && (
                <button
                  type="button"
                  onClick={() => setUploadedImage('')}
                  className="mt-2 text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  移除重新選擇
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200 transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            套用簽名
          </button>
        </div>
      </div>
    </div>
  );
};
