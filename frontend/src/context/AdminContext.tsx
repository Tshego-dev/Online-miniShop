import { createContext, useContext, useState, ReactNode } from 'react';

const ADMIN_PASSWORD = 'admin123';

interface AdminCtx { isAdmin: boolean; login: (pw: string) => boolean; logout: () => void; }
const Ctx = createContext<AdminCtx>(null!);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('isAdmin') === 'true');
  const login = (pw: string) => {
    if (pw === ADMIN_PASSWORD) { setIsAdmin(true); sessionStorage.setItem('isAdmin', 'true'); return true; }
    return false;
  };
  const logout = () => { setIsAdmin(false); sessionStorage.removeItem('isAdmin'); };
  return <Ctx.Provider value={{ isAdmin, login, logout }}>{children}</Ctx.Provider>;
}

export const useAdmin = () => useContext(Ctx);
