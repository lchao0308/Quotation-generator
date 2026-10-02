import { create } from 'zustand';
import { Quotation, QuotationStatus } from '../types/quote';
import { createDemoQuotation, createBlankQuotation, generateQuoteNumber, getTodayDateString } from '../utils/demoData';
import { calculateQuotationTotals, calculateValidUntil } from '../utils/calculations';

const STORAGE_KEY = 'antigravity_quotations_v1';
const SENDER_PRESET_KEY = 'antigravity_sender_preset_v1';

interface QuoteStoreState {
  quotations: Quotation[];
  currentQuotation: Quotation | null;
  searchQuery: string;
  statusFilter: QuotationStatus | 'all';
  sortBy: 'createdAt' | 'date' | 'totalAmount' | 'clientName';
  sortOrder: 'asc' | 'desc';
  isSaving: boolean;
  lastSavedAt: Date | null;

  // Actions
  initialize: () => void;
  getQuotation: (id: string) => Quotation | undefined;
  setCurrentQuotation: (quote: Quotation | null) => void;
  updateCurrentQuotation: (patch: Partial<Quotation> | ((prev: Quotation) => Quotation)) => void;
  saveQuotation: (quote: Quotation) => void;
  createNewQuotation: () => Quotation;
  duplicateQuotation: (id: string) => Quotation | null;
  deleteQuotation: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setStatusFilter: (s: QuotationStatus | 'all') => void;
  setSortBy: (sortBy: 'createdAt' | 'date' | 'totalAmount' | 'clientName') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;

  // Filtered & Sorted selector
  getFilteredQuotations: () => Quotation[];
}

// 輔助：計算當天現有最大的流水號
function getNextSequenceForDate(quotations: Quotation[], dateStr: string): number {
  const cleanDate = dateStr.replace(/-/g, '');
  const prefix = `Q-${cleanDate}-`;
  let maxSeq = 0;

  for (const q of quotations) {
    if (q.number && q.number.startsWith(prefix)) {
      const seqPart = q.number.substring(prefix.length);
      const num = parseInt(seqPart, 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  }

  return maxSeq + 1;
}

export const useQuoteStore = create<QuoteStoreState>((set, get) => ({
  quotations: [],
  currentQuotation: null,
  searchQuery: '',
  statusFilter: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  isSaving: false,
  lastSavedAt: null,

  initialize: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Quotation[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          set({ quotations: parsed });
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse quotations from localStorage', e);
    }

    // 首次進入：自動載入示範資料
    const demo = createDemoQuotation();
    set({ quotations: [demo] });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([demo]));
    } catch (e) {
      console.warn('LocalStorage quota or write error', e);
    }
  },

  getQuotation: (id: string) => {
    return get().quotations.find((q) => q.id === id);
  },

  setCurrentQuotation: (quote) => {
    set({ currentQuotation: quote });
  },

  updateCurrentQuotation: (patch) => {
    const current = get().currentQuotation;
    if (!current) return;

    const updated = typeof patch === 'function' ? patch(current) : { ...current, ...patch };
    updated.updatedAt = new Date().toISOString();

    set({ currentQuotation: updated });

    // 同步更新列表中對應項與 localStorage (Debounced in hook/editor)
    get().saveQuotation(updated);
  },

  saveQuotation: (quote) => {
    set({ isSaving: true });
    const { quotations } = get();
    const index = quotations.findIndex((q) => q.id === quote.id);
    let updatedList: Quotation[];

    if (index >= 0) {
      updatedList = [...quotations];
      updatedList[index] = quote;
    } else {
      updatedList = [quote, ...quotations];
    }

    // 記住最後一次填寫的公司資訊，以便下次新增報價單時預填
    if (quote.sender && quote.sender.companyName) {
      try {
        localStorage.setItem(SENDER_PRESET_KEY, JSON.stringify(quote.sender));
      } catch (e) {
        console.warn('Failed to save sender preset', e);
      }
    }

    set({ quotations: updatedList, isSaving: false, lastSavedAt: new Date() });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to write quotations to localStorage', e);
    }
  },

  createNewQuotation: () => {
    const today = getTodayDateString();
    const nextSeq = getNextSequenceForDate(get().quotations, today);
    const newQuote = createBlankQuotation(nextSeq);

    // 嘗試帶入上次儲存的寄件公司資訊
    try {
      const cachedSender = localStorage.getItem(SENDER_PRESET_KEY);
      if (cachedSender) {
        newQuote.sender = { ...newQuote.sender, ...JSON.parse(cachedSender) };
      }
    } catch (e) {
      // ignore
    }

    get().saveQuotation(newQuote);
    set({ currentQuotation: newQuote });
    return newQuote;
  },

  duplicateQuotation: (id: string) => {
    const origin = get().quotations.find((q) => q.id === id);
    if (!origin) return null;

    const today = getTodayDateString();
    const nextSeq = getNextSequenceForDate(get().quotations, today);
    const validUntil = calculateValidUntil(today, origin.validDays || 14);

    const duplicated: Quotation = {
      ...JSON.parse(JSON.stringify(origin)),
      id: `quote-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      number: generateQuoteNumber(today, nextSeq),
      date: today,
      validUntil,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    get().saveQuotation(duplicated);
    return duplicated;
  },

  deleteQuotation: (id: string) => {
    const filtered = get().quotations.filter((q) => q.id !== id);
    set({ quotations: filtered });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to update localStorage on delete', e);
    }
    if (get().currentQuotation?.id === id) {
      set({ currentQuotation: null });
    }
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  setStatusFilter: (s) => set({ statusFilter: s }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),

  getFilteredQuotations: () => {
    const { quotations, searchQuery, statusFilter, sortBy, sortOrder } = get();

    return quotations
      .filter((q) => {
        // 狀態篩選
        if (statusFilter !== 'all' && q.status !== statusFilter) {
          return false;
        }

        // 搜尋篩選（單號、客戶公司、客戶聯絡人、標題）
        if (searchQuery.trim()) {
          const qLower = searchQuery.toLowerCase().trim();
          const matchNumber = q.number?.toLowerCase().includes(qLower);
          const matchClient = q.client?.companyName?.toLowerCase().includes(qLower);
          const matchContact = q.client?.contactPerson?.toLowerCase().includes(qLower);
          const matchTitle = q.title?.toLowerCase().includes(qLower);
          if (!matchNumber && !matchClient && !matchContact && !matchTitle) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'createdAt') {
          diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === 'date') {
          diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortBy === 'clientName') {
          diff = (a.client?.companyName || '').localeCompare(b.client?.companyName || '', 'zh-Hant');
        } else if (sortBy === 'totalAmount') {
          const totalA = calculateQuotationTotals(a.items, a.tax).totalAmount;
          const totalB = calculateQuotationTotals(b.items, b.tax).totalAmount;
          diff = totalA - totalB;
        }
        return sortOrder === 'asc' ? diff : -diff;
      });
  },
}));
