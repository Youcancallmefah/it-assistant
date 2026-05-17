import type { AuthUser } from './types';

export const MOCK_USERS: AuthUser[] = [
  { id: 'u1', full_name: 'สมชาย ใจดี', email: 'somchai@school.ac.th', role: 'teacher', room: 'ห้อง 201', avatar_initials: 'สช' },
  { id: 'u2', full_name: 'นักเรียน ทดสอบ', email: 'student@school.ac.th', role: 'student', room: 'ม.3/2', avatar_initials: 'นท' },
  { id: 'u3', full_name: 'วิทยา ไอที', email: 'it@school.ac.th', role: 'it_admin', avatar_initials: 'วท' },
];

export const DEMO_CREDENTIALS = [
  { email: 'somchai@school.ac.th', password: 'teacher123', label: 'ครู - สมชาย' },
  { email: 'student@school.ac.th', password: 'student123', label: 'นักเรียน' },
  { email: 'it@school.ac.th', password: 'itadmin123', label: 'เจ้าหน้าที่ IT' },
];
