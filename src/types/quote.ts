export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'completed' | 'expired';

export type Currency = 'TWD' | 'USD' | 'JPY' | 'EUR' | 'CNY' | 'HKD';

export type TaxMode = 'exclusive' | 'inclusive' | 'exempt' | 'custom';

export type TemplateType = 'professional' | 'minimal' | 'corporate';

export interface QuoteItem {
  id: string;
  category: string;
  name: string;
  description: string;
  unitPrice: number;
  quantity: number;
  discount: number; // percentage, e.g. 0 or 10
}

export interface SenderInfo {
  companyName: string;
  taxId: string;
  representative: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  logo: string; // Base64 data URL
}

export interface ClientInfo {
  companyName: string;
  taxId: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

export interface TermItem {
  id: string;
  title: string;
  content: string;
}

export type PaymentMethodType = 'remittance' | 'cash' | 'credit_card' | 'other';

export interface PaymentInfo {
  method: PaymentMethodType;
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountName: string;
  terms: string; // 付款條件，如「簽約支付 50%，交貨驗收後支付 50%」
}

export interface Signatures {
  partyA: string; // 甲方簽章 Base64
  partyB: string; // 乙方簽章 Base64
}

export interface LayoutSettings {
  template: TemplateType;
  primaryColor: string;
  fontFamily: string;
  showCategory: boolean;
  showDiscount: boolean;
}

export interface TaxSettings {
  mode: TaxMode;
  rate: number; // percentage, default 5
}

export interface QuotationCalculation {
  subtotal: number;       // 各項目原價加總
  discountTotal: number;  // 總折扣金額
  amountBeforeTax: number;// 未稅總計
  taxAmount: number;      // 稅金
  totalAmount: number;    // 含稅總金額
}

export interface Quotation {
  id: string;
  number: string;
  title: string;
  date: string; // YYYY-MM-DD
  validDays: number; // e.g. 14
  validUntil: string; // YYYY-MM-DD
  status: QuotationStatus;
  currency: Currency;
  sender: SenderInfo;
  client: ClientInfo;
  items: QuoteItem[];
  tax: TaxSettings;
  terms: TermItem[];
  payment: PaymentInfo;
  signatures: Signatures;
  layout: LayoutSettings;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
