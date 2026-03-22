import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../api';

export interface CartItem extends Product { quantity: number; }

interface CartCtx {
  items: CartItem[];
  sessionId: string;
  add: (p: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
}

const Ctx = createContext<CartCtx>(null!);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [sessionId] = useState(() => {
    const s = localStorage.getItem('sessionId');
    if (s) return s;
    const id = crypto.randomUUID();
    localStorage.setItem('sessionId', id);
    return id;
  });

  const add = (p: Product) =>
    setItems(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...p, quantity: 1 }];
    });

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems(prev => qty < 1 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return <Ctx.Provider value={{ items, sessionId, add, remove, setQty, clear, total }}>{children}</Ctx.Provider>;
}

export const useCart = () => useContext(Ctx);
