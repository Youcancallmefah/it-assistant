import { Wifi } from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Wifi className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900">IT Assistant</span>
        </div>
        <p className="ml-3 text-xs text-gray-400">ผู้ช่วยไอทีอัจฉริยะโรงเรียน</p>
      </header>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
