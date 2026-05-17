-- ============================================================
-- IT Assistant - Supabase Database Schema
-- วิธีใช้: เปิด Supabase Dashboard → SQL Editor → วางโค้ดนี้ → Run
-- ============================================================

-- 1. Profiles (เชื่อมกับ auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'it_admin')),
  room        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tickets (แจ้งปัญหา IT)
CREATE TABLE IF NOT EXISTS public.tickets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number   TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  room            TEXT NOT NULL,
  priority        TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
  created_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_to     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  image_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

-- 3. Ticket Comments
CREATE TABLE IF NOT EXISTS public.ticket_comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id   UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Devices (อุปกรณ์)
CREATE TABLE IF NOT EXISTS public.devices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  device_type     TEXT NOT NULL CHECK (device_type IN ('computer','printer','projector','router','tablet','other')),
  room            TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','maintenance','broken')),
  serial_number   TEXT,
  purchased_date  DATE,
  notes           TEXT,
  last_maintained DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Device History (ประวัติซ่อม)
CREATE TABLE IF NOT EXISTS public.device_history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id     UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  action        TEXT NOT NULL CHECK (action IN ('repair','maintenance','status_change','install')),
  description   TEXT NOT NULL,
  performed_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ticket_id     UUID REFERENCES public.tickets(id) ON DELETE SET NULL,
  performed_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FAQ Categories
CREATE TABLE IF NOT EXISTS public.faq_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT '📁',
  color       TEXT NOT NULL DEFAULT 'blue',
  description TEXT,
  "order"     INT NOT NULL DEFAULT 0
);

-- 7. FAQ Items
CREATE TABLE IF NOT EXISTS public.faq_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   UUID NOT NULL REFERENCES public.faq_categories(id) ON DELETE CASCADE,
  question      TEXT NOT NULL,
  answer        TEXT NOT NULL,
  views         INT NOT NULL DEFAULT 0,
  tags          TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('ticket_created','ticket_updated','ticket_completed','system','announcement')),
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  ticket_id   UUID REFERENCES public.tickets(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: ทุกคนดูได้ แก้ได้เฉพาะของตัวเอง
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Tickets: ทุก user ดูได้, สร้างได้, IT Admin แก้ได้
CREATE POLICY "tickets_select" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "tickets_insert" ON public.tickets FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "tickets_update_admin" ON public.tickets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'it_admin')
);

-- Ticket Comments: ทุกคนดูได้, สร้างได้
CREATE POLICY "comments_select" ON public.ticket_comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON public.ticket_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Devices: ทุกคนดูได้, IT Admin แก้ได้
CREATE POLICY "devices_select" ON public.devices FOR SELECT USING (true);
CREATE POLICY "devices_manage" ON public.devices FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'it_admin')
);

-- Device History: ทุกคนดูได้, IT Admin เพิ่มได้
CREATE POLICY "device_history_select" ON public.device_history FOR SELECT USING (true);
CREATE POLICY "device_history_insert" ON public.device_history FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'it_admin')
);

-- FAQ: ทุกคนดูได้, IT Admin แก้ได้
CREATE POLICY "faq_select" ON public.faq_categories FOR SELECT USING (true);
CREATE POLICY "faq_items_select" ON public.faq_items FOR SELECT USING (true);
CREATE POLICY "faq_manage" ON public.faq_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'it_admin')
);
CREATE POLICY "faq_items_manage" ON public.faq_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'it_admin')
);

-- Notifications: ดูเฉพาะของตัวเอง
CREATE POLICY "notif_select" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notif_insert" ON public.notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "notif_update" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- ============================================================
-- Function: auto-create profile หลัง signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
