'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wifi, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DEMO_CREDENTIALS } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    if (user) router.push('/chat');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push('/chat');
    }
  };

  const fillDemo = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setShowDemo(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <Wifi className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">IT Assistant</h1>
          <p className="text-gray-500 mt-1">ผู้ช่วยไอทีอัจฉริยะโรงเรียน</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">เข้าสู่ระบบ</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                อีเมล
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@school.ac.th"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="รหัสผ่าน"
                  required
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
              เข้าสู่ระบบ
            </Button>
          </form>
        </div>

        {/* Demo accounts */}
        <div className="mt-4">
          <button
            onClick={() => setShowDemo(v => !v)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            บัญชีทดสอบ (Demo)
            <ChevronDown className={`w-4 h-4 transition-transform ${showDemo ? 'rotate-180' : ''}`} />
          </button>

          {showDemo && (
            <div className="mt-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.email}
                  onClick={() => fillDemo(cred)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{cred.label}</p>
                    <p className="text-xs text-gray-400">{cred.email}</p>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">เลือก</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          มีปัญหาเข้าสู่ระบบ? ติดต่อเจ้าหน้าที่ IT ห้อง IT ชั้น 1
        </p>
      </div>
    </div>
  );
}
