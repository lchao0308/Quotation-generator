import { Quotation, TermItem } from '../types/quote';
import { calculateValidUntil } from './calculations';

export const DEFAULT_TERMS: TermItem[] = [
  {
    id: 'term-1',
    title: '報價有效期限',
    content: '本報價單有效期限為自開立日起算 14 天內有效，逾期需重新評估報價。',
  },
  {
    id: 'term-2',
    title: '付款方式與條件',
    content: '簽約後支付總額 50% 為訂金；完成交付並驗收無誤後 7 個工作日內支付尾款 50%。',
  },
  {
    id: 'term-3',
    title: '交貨 / 製作時間',
    content: '本案自訂金確認入帳且相關設計規格定案之次日起算，約需 30 個工作天完成初版交付。',
  },
  {
    id: 'term-4',
    title: '修改規範',
    content: '專案包含 2 次合約範圍內之細節微調修改。若超出原需求範疇或結構性變更，費用另計。',
  },
  {
    id: 'term-5',
    title: '取消 / 退費規範',
    content: '專案啟動後若因甲方因素終止，訂金不予退還；已完成階段成果按工作進度比例結算。',
  },
  {
    id: 'term-6',
    title: '智慧財產權與保密',
    content: '全額款項結清前，智慧財產權仍屬本公司所有。雙方就本案涉獵之商業機密均負嚴格保密義務。',
  },
];

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateQuoteNumber(dateStr: string, sequence: number = 1): string {
  const cleanDate = dateStr.replace(/-/g, '');
  const seqStr = String(sequence).padStart(3, '0');
  return `Q-${cleanDate}-${seqStr}`;
}

// 預設示範簽名向量/圖片 (精緻 SVG base64)
const DEMO_SIGNATURE_PARTY_A = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80"><path d="M 20 50 Q 50 15 90 40 T 150 30 T 180 50" fill="none" stroke="%231E40AF" stroke-width="3" stroke-linecap="round"/><path d="M 40 45 Q 80 55 120 42" fill="none" stroke="%231E40AF" stroke-width="2" stroke-linecap="round"/></svg>';

export function createDemoQuotation(): Quotation {
  const today = getTodayDateString();
  const validUntil = calculateValidUntil(today, 14);

  return {
    id: 'demo-quotation-001',
    number: generateQuoteNumber(today, 1),
    title: '產品開發與模具打樣製作報價單',
    date: today,
    validDays: 14,
    validUntil,
    status: 'draft',
    currency: 'TWD',
    sender: {
      companyName: '極致工藝科技顧問有限公司',
      taxId: '83124567',
      representative: '林大為',
      contactPerson: '陳俊宏',
      phone: '02-2789-5678',
      email: 'service@apex-craft.com.tw',
      address: '台北市信義區信義路五段 7 號 35 樓',
      website: 'https://www.apex-craft.com.tw',
      logo: '',
    },
    client: {
      companyName: '未來生活智慧科技股份有限公司',
      taxId: '24681357',
      contactPerson: '張雅婷 協理',
      phone: '03-578-9988',
      email: 'yt.chang@futurelife.io',
      address: '新竹市東區光復路二段 101 號 8 樓',
      notes: '聯絡時間請避開每週一上午主管例會。',
    },
    items: [
      {
        id: 'item-1',
        category: '產品設計',
        name: '外觀與人體工學機構設計',
        description: '包含外觀 3D 渲染圖、結構拆件設計、CMF 材質規格書，提供 2 次修改',
        unitPrice: 85000,
        quantity: 1,
        discount: 0,
      },
      {
        id: 'item-2',
        category: '模具工程',
        name: '精密塑膠射出鋼模 (主機外殼)',
        description: '採用 SKD61 耐磨工具鋼，單穴模具，壽命保證 30 萬模次以上',
        unitPrice: 160000,
        quantity: 1,
        discount: 5,
      },
      {
        id: 'item-3',
        category: '打樣檢驗',
        name: 'T0~T1 試模打樣與三次元檢測報告',
        description: '提供 10 組工程樣品 (ABS+PC 材質)，附全尺寸量測品檢數據表',
        unitPrice: 30000,
        quantity: 1,
        discount: 0,
      },
      {
        id: 'item-4',
        category: '初期試產',
        name: '首批小量試產 (500 pcs)',
        description: '含進料檢驗、射出成型、表面消光噴塗及獨立靜電袋包裝',
        unitPrice: 140,
        quantity: 500,
        discount: 0,
      },
    ],
    tax: {
      mode: 'exclusive',
      rate: 5,
    },
    terms: [...DEFAULT_TERMS],
    payment: {
      method: 'remittance',
      bankName: '玉山商業銀行 (808)',
      branchName: '信義分行',
      accountNumber: '0123-987-654321',
      accountName: '極致工藝科技顧問有限公司',
      terms: '簽約支付 50% 定金，交付驗收後 7 日內付清尾款 50%。',
    },
    signatures: {
      partyA: DEMO_SIGNATURE_PARTY_A,
      partyB: '',
    },
    layout: {
      template: 'professional',
      primaryColor: '#2563EB',
      fontFamily: 'sans',
      showCategory: true,
      showDiscount: true,
    },
    notes: '感謝貴公司的支持與信任。如對報價內容有任何疑問，歡迎隨時與專案負責人聯繫！',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createBlankQuotation(sequenceNumber: number = 1): Quotation {
  const today = getTodayDateString();
  const validUntil = calculateValidUntil(today, 14);

  return {
    id: `quote-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    number: generateQuoteNumber(today, sequenceNumber),
    title: '專案服務報價單',
    date: today,
    validDays: 14,
    validUntil,
    status: 'draft',
    currency: 'TWD',
    sender: {
      companyName: '',
      taxId: '',
      representative: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      website: '',
      logo: '',
    },
    client: {
      companyName: '',
      taxId: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
    },
    items: [
      {
        id: `item-${Date.now()}-1`,
        category: '服務項目',
        name: '專業顧問諮詢與實作',
        description: '依據雙方約定之專案需求範圍進行交付',
        unitPrice: 10000,
        quantity: 1,
        discount: 0,
      },
    ],
    tax: {
      mode: 'exclusive',
      rate: 5,
    },
    terms: [...DEFAULT_TERMS],
    payment: {
      method: 'remittance',
      bankName: '',
      branchName: '',
      accountNumber: '',
      accountName: '',
      terms: '簽約支付 50% 訂金，完成後支付 50% 尾款。',
    },
    signatures: {
      partyA: '',
      partyB: '',
    },
    layout: {
      template: 'professional',
      primaryColor: '#2563EB',
      fontFamily: 'sans',
      showCategory: true,
      showDiscount: true,
    },
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
