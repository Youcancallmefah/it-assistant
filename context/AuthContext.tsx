'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser } from '@/lib/types';
import { MOCK_USERS, DEMO_CREDENTIALS } from '@/lib/mock-data';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('it_assistant_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const cred = DEMO_CREDENTIALS.find(c => c.email === email && c.password === password);
    if (!cred) return { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };

    const found = MOCK_USERS.find(u => u.email === email);
    if (!found) return { error: 'ไม่พบข้อมูลผู้ใช้' };

    setUser(found);
    localStorage.setItem('it_assistant_user', JSON.stringify(found));
    return {};
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('it_assistant_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
