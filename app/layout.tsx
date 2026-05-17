import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'IT Assistant - ผู้ช่วยไอทีอัจฉริยะโรงเรียน',
  description: 'ระบบผู้ช่วยไอทีอัจฉริยะสำหรับโรงเรียน',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
