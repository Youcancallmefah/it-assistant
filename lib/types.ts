export type UserRole = 'student' | 'teacher' | 'it_admin';

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  room?: string;
  avatar_initials: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tags: string[];
}
