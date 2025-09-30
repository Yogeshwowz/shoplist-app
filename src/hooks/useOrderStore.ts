import { create } from "zustand";

export interface OrderItem {
  id: string;
  category: string;
  description: string;
  packaging: string;
  quantity: number;
  chefComment?: string;
  shopperComment?: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  boatName: string;
  orderDate: string;
  deliverBy: string;
  orderName: string;
  orderNumber: string;
}

interface OrderState {
  items: Record<string, OrderItem[]>; // category -> items
  customer: CustomerDetails;
  updateItem: (category: string, id: string, field: 'quantity' | 'chefComment' | 'shopperComment', value: string | number) => void;
  setCustomer: (field: keyof CustomerDetails, value: string) => void;
  reset: () => void;
}

function generateOrderNumber() {
  // Simple order number: ORD + timestamp
  return 'ORD' + Date.now();
}

const STORAGE_KEY = 'order-store';

function loadPersistedState() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return undefined;
}

function savePersistedState(state: any) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

const initialState = loadPersistedState() || {
  items: {},
  customer: {
    name: '',
    email: '',
    phone: '',
    boatName: '',
    orderDate: '',
    deliverBy: '',
    orderName: '',
    orderNumber: generateOrderNumber(),
  },
};

const useOrderStore = create<OrderState>((set, get) => ({
  ...initialState,
  updateItem: (category, id, field, value) => set((state) => {
    const catItems = state.items[category] || [];
    const idx = catItems.findIndex(item => item.id === id);
    let newItems = [...catItems];
    if (idx >= 0) {
      newItems[idx] = { ...newItems[idx], [field]: value };
    } else {
      newItems.push({ id, category, description: '', packaging: '', quantity: 0, [field]: value });
    }
    const newState = { ...state, items: { ...state.items, [category]: newItems } };
    savePersistedState({ items: newState.items, customer: newState.customer });
    return { items: newState.items };
  }),
  setCustomer: (field, value) => set((state) => {
    const newCustomer = { ...state.customer, [field]: value };
    savePersistedState({ items: state.items, customer: newCustomer });
    return { customer: newCustomer };
  }),
  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      items: {},
      customer: {
        name: '',
        email: '',
        phone: '',
        boatName: '',
        orderDate: '',
        deliverBy: '',
        orderName: '',
        orderNumber: generateOrderNumber(),
      },
    });
  },
}));

export default useOrderStore;