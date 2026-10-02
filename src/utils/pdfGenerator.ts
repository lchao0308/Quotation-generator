import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Quotation } from '../types/quote';
import { toast } from '../stores/useToastStore';

/**
 * 將 OKLAB 色彩轉為標準 sRGB
 */
function oklabToRgb(l: number, a: number, b: number, alpha?: number): string {
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const r = +4.0767434036 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bVal = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  const toGamma = (x: number) => {
    const clamped = Math.max(0, Math.min(1, x));
    return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };

  const R = Math.round(toGamma(r) * 255);
  const G = Math.round(toGamma(g) * 255);
  const B = Math.round(toGamma(bVal) * 255);

  if (alpha !== undefined && !isNaN(alpha) && alpha < 1) {
    return `rgba(${R}, ${G}, ${B}, ${alpha})`;
  }
  return `rgb(${R}, ${G}, ${B})`;
}

/**
 * 將 OKLCH 色彩轉為標準 sRGB
 */
function oklchToRgb(l: number, c: number, h: number, alpha?: number): string {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  return oklabToRgb(l, a, b, alpha);
}

/**
 * 徹底淨化所有現代 CSS 色彩函數 (color-mix, in oklab, oklch%, oklab%)
 */
function sanitizeModernCss(inputCss: string): string {
  if (!inputCss || typeof inputCss !== 'string') return inputCss;
  let css = inputCss;

  // 1. 移除 linear-gradient 中的 "in oklab" 等色彩空間指示
  css = css.replace(/\bin\s+(?:oklab|oklch|srgb|lab)\b/gi, '');

  // 2. 替換 color-mix(...) 函數為相容色彩
  let count = 0;
  while (css.includes('color-mix(') && count < 10) {
    css = css.replace(/color-mix\([^\(\)]*(\([^\(\)]*\)[^\(\)]*)*\)/gi, '#64748b');
    count++;
  }

  // 3. 替換 oklch(...) 支援百分比表示法
  css = css.replace(
    /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi,
    (_m, lStr, c, h, a) => {
      const l = lStr.endsWith('%') ? parseFloat(lStr) / 100 : parseFloat(lStr);
      let alpha = 1;
      if (a) alpha = a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a);
      return oklchToRgb(l, parseFloat(c), parseFloat(h), alpha);
    }
  );

  // 4. 替換 oklab(...) 支援百分比表示法
  css = css.replace(
    /oklab\(\s*([\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi,
    (_m, lStr, a, b, alphaStr) => {
      const l = lStr.endsWith('%') ? parseFloat(lStr) / 100 : parseFloat(lStr);
      let alpha = 1;
      if (alphaStr) alpha = alphaStr.endsWith('%') ? parseFloat(alphaStr) / 100 : parseFloat(alphaStr);
      return oklabToRgb(l, parseFloat(a), parseFloat(b), alpha);
    }
  );

  return css;
}

export async function exportQuotationToPdf(
  elementId: string,
  quote: Quotation,
  onProgress?: (loading: boolean) => void
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    toast.error('找不到報價單內容節點，無法產出 PDF');
    return;
  }

  try {
    onProgress?.(true);
    toast.info('正在渲染高畫質 PDF，請稍候...');

    // 等待所有圖片載入完成
    const images = element.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    // 高解析度 canvas 擷取
    const canvas = await html2canvas(element, {
      scale: 2, // 2x DPI Retina
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFFFF',
      logging: false,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (!clonedEl) return;

        // 確保克隆的 DOM 不受預覽縮放影響
        if (clonedEl.parentElement) {
          clonedEl.parentElement.style.transform = 'none';
        }
        clonedEl.style.transform = 'none';

        // ★ 核心修復：完全替換 <style> DOM 節點
        // html2canvas 從 CSSStyleSheet.cssRules 讀取樣式，
        // 僅改 textContent 不會觸發 re-parse，
        // 必須建立全新的 <style> 節點才能讓瀏覽器重建 CSSStyleSheet
        const styleElements = Array.from(clonedDoc.querySelectorAll('style'));
        for (const oldStyle of styleElements) {
          const rawCss = oldStyle.textContent || '';
          if (!rawCss) continue;
          const sanitizedCss = sanitizeModernCss(rawCss);
          const newStyle = clonedDoc.createElement('style');
          newStyle.textContent = sanitizedCss;
          oldStyle.parentNode?.insertBefore(newStyle, oldStyle);
          oldStyle.remove();
        }

        // 同樣處理 <link rel="stylesheet"> 對應的 CSSStyleSheet
        const linkSheets = Array.from(clonedDoc.querySelectorAll('link[rel="stylesheet"]'));
        for (const link of linkSheets) {
          try {
            const sheet = (link as HTMLLinkElement).sheet;
            if (!sheet) continue;
            let cssText = '';
            for (const rule of Array.from(sheet.cssRules)) {
              cssText += rule.cssText + '\n';
            }
            if (cssText.includes('oklch') || cssText.includes('oklab') || cssText.includes('color-mix')) {
              const newStyle = clonedDoc.createElement('style');
              newStyle.textContent = sanitizeModernCss(cssText);
              link.parentNode?.insertBefore(newStyle, link);
              link.remove();
            }
          } catch (_e) {
            // CORS 跨域樣式表無法讀取，略過
          }
        }

        // Belt-and-suspenders：遞迴將 computed 色彩屬性 bake 成 inline style
        const allElements = [clonedEl, ...Array.from(clonedEl.querySelectorAll('*'))] as HTMLElement[];
        const colorProps = [
          'color',
          'backgroundColor',
          'borderColor',
          'borderTopColor',
          'borderRightColor',
          'borderBottomColor',
          'borderLeftColor',
          'outlineColor',
        ] as const;

        for (const node of allElements) {
          if (!node.style) continue;
          const computed = clonedDoc.defaultView
            ? clonedDoc.defaultView.getComputedStyle(node)
            : window.getComputedStyle(node);
          for (const prop of colorProps) {
            const val = (computed as any)[prop];
            if (val && typeof val === 'string' && (val.includes('oklch') || val.includes('oklab') || val.includes('color-mix'))) {
              (node.style as any)[prop] = sanitizeModernCss(val);
            }
          }
        }
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // A4 規格 (mm)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // 第一頁
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 多頁自動分頁切片支援
    while (heightLeft > 5) {
      position = -(imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // 命名存檔：例如「報價單_產品開發_Q-20260909-001.pdf」
    const cleanTitle = (quote.title || '報價單').replace(/[\\/:*?"<>|]/g, '_');
    const cleanNumber = (quote.number || 'Q').replace(/[\\/:*?"<>|]/g, '_');
    const filename = `報價單_${cleanTitle}_${cleanNumber}.pdf`;

    pdf.save(filename);
    toast.success('PDF 報價單下載成功！');
  } catch (error) {
    console.error('PDF generation error:', error);
    toast.error('產出 PDF 時發生錯誤，請嘗試使用瀏覽器列印功能');
  } finally {
    onProgress?.(false);
  }
}

export function printQuotation(): void {
  window.print();
}
