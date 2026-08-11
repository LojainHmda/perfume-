import { create } from 'zustand';
import { CartItem, Fragrance } from '../types/fragrance';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (fragrance: Fragrance, size: '50ml' | '100ml', engravingText?: string) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  addItem: (fragrance, size, engravingText) => {
    const price = size === '50ml' ? fragrance.price50ml : fragrance.price100ml;
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => item.fragrance.id === fragrance.id && item.size === size && item.engravingText === engravingText
      );
      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += 1;
        return { items: newItems, isOpen: true };
      }
      return {
        items: [...state.items, { fragrance, size, price, quantity: 1, engravingText }],
        isOpen: true,
      };
    });
  },
  removeItem: (index) =>
    set((state) => ({
      items: state.items.filter((_, i) => i !== index),
    })),
  updateQuantity: (index, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((_, i) => i !== index) };
      }
      const newItems = [...state.items];
      newItems[index].quantity = quantity;
      return { items: newItems };
    }),
  clearCart: () => set({ items: [] }),
}));

interface UnboxingState {
  hasUnboxed: boolean;
  step: 1 | 2 | 3 | 4 | 5; // 1: closed, 2: seal fly, 3: box lid opening, 4: revealed bottles, 5: complete/closed overlay
  setStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  triggerUnboxing: () => void;
  skipUnboxing: () => void;
}

export const useUnboxingStore = create<UnboxingState>((set) => ({
  hasUnboxed: false,
  step: 1,
  setStep: (step) => set({ step, hasUnboxed: step === 5 }),
  triggerUnboxing: () => set({ step: 1, hasUnboxed: false }),
  skipUnboxing: () => set({ step: 5, hasUnboxed: true }),
}));

interface AudioState {
  isMuted: boolean;
  toggleAudio: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isMuted: true,
  toggleAudio: () => set((state) => ({ isMuted: !state.isMuted })),
}));

interface CursorState {
  cursorLabel: string;
  cursorVariant: 'default' | 'hover' | 'magnetic' | 'button' | 'video' | 'drag';
  setCursor: (label?: string, variant?: 'default' | 'hover' | 'magnetic' | 'button' | 'video' | 'drag') => void;
  resetCursor: () => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  cursorLabel: '',
  cursorVariant: 'default',
  setCursor: (label = '', variant = 'hover') => set({ cursorLabel: label, cursorVariant: variant }),
  resetCursor: () => set({ cursorLabel: '', cursorVariant: 'default' }),
}));
