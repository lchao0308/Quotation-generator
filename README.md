# 專業報價單生成器 (Professional Quotation Generator)

一套為中小企業、自由接案者、顧問與各行業設計的現代化報價單生成器 Web App。採用 React 19、TypeScript、Vite、Tailwind CSS v4 與 Zustand 開發，提供即時雙欄預覽、自動稅額計算、多幣別格式化、線上手寫簽章、三款高階商業範本與一鍵高畫質 A4 PDF 匯出。

## 🌟 核心特色
- **即時雙欄同步預覽**：左側 8 大分頁步驟引導，右側即時呈現標準 A4 比例畫布。
- **全自動金額與稅額計算**：支援單價、數量、折扣（%）、未稅合計、折讓總額、營業稅（外加稅 5%、內含稅、零稅率、自訂稅率）及含稅總計。
- **三款精緻範本**：商務型（Professional）、極簡型（Minimal）、經典格狀（Corporate），並支援自訂品牌主色。
- **線上手寫簽章**：甲乙方皆支援 Canvas 高解析度親筆簽名與印章圖檔上傳。
- **高畫質 A4 PDF 輸出**：完美相容現代 CSS 色彩空間，產出清晰穩定的多頁 PDF。
- **Local-First 資料安全**：所有報價資料自動保存在本機 LocalStorage，不外傳第三方，支援複製、搜尋、篩選與排序。

## 🛠 技術架構
- **Frontend**：React 19, TypeScript
- **Build Tool**：Vite 8
- **Styling**：Tailwind CSS v4
- **State Management**：Zustand
- **PDF Export**：jsPDF, html2canvas
- **Icons**：Lucide React
