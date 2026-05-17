'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Wifi } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 shrink-0">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Wifi className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900">IT Assistant</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 leading-none">{user.full_name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {user.role === 'student' ? 'นักเรียน' : user.role === 'teacher' ? 'ครู' : 'เจ้าหน้าที่ IT'}
              {user.room ? ` • ${user.room}` : ''}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
            {user.avatar_initials}
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="ออกจากระบบ"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
