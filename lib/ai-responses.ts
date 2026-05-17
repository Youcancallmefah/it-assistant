import type { FaqItem } from './types';

interface AiResponse {
  text: string;
  related_faqs?: FaqItem[];
}

const KEYWORD_MAP: Record<string, string[]> = {
  wifi: ['wifi', 'wi-fi', 'ไวไฟ', 'อินเทอร์เน็ต', 'internet', 'เน็ต', 'เชื่อมต่อ'],
  printer: ['เครื่องพิมพ์', 'ปริ้น', 'printer', 'กระดาษติด', 'print'],
  password: ['รหัสผ่าน', 'password', 'ลืม', 'login', 'เข้าไม่ได้', 'reset'],
  computer: ['คอมพิวเตอร์', 'คอม', 'computer', 'เปิดไม่ติด', 'ช้า', 'หน้าจอ', 'จอ'],
  projector: ['โปรเจกเตอร์', 'projector', 'display', 'ฉาย'],
  email: ['อีเมล', 'email', 'gmail', 'mail', 'google'],
  classroom: ['classroom', 'google classroom', 'เรียน', 'ออนไลน์'],
  software: ['โปรแกรม', 'software', 'ติดตั้ง', 'install', 'office', 'word', 'excel'],
};

const INLINE_FAQS: FaqItem[] = [
  { id: 'f1', question: 'Wi-Fi ของโรงเรียนชื่ออะไร รหัสผ่านคืออะไร?', answer: '', tags: ['wifi', 'internet'] },
  { id: 'f2', question: 'เชื่อมต่อ Wi-Fi แล้วแต่ไม่มีอินเทอร์เน็ต ทำอย่างไร?', answer: '', tags: ['wifi', 'troubleshoot'] },
  { id: 'f3', question: 'คอมพิวเตอร์เปิดไม่ติด ทำอย่างไร?', answer: '', tags: ['computer', 'hardware'] },
  { id: 'f4', question: 'คอมพิวเตอร์ช้ามาก ทำอย่างไร?', answer: '', tags: ['computer', 'performance'] },
  { id: 'f5', question: 'ลืมรหัสผ่าน ทำอย่างไร?', answer: '', tags: ['password', 'reset'] },
  { id: 'f6', question: 'เครื่องพิมพ์กระดาษติด แก้ไขอย่างไร?', answer: '', tags: ['printer'] },
  { id: 'f7', question: 'โปรเจกเตอร์ไม่แสดงภาพ ทำอย่างไร?', answer: '', tags: ['projector'] },
  { id: 'f8', question: 'Google Classroom เข้าไม่ได้ ทำอย่างไร?', answer: '', tags: ['classroom', 'google'] },
];

function findRelatedFaqs(input: string): FaqItem[] {
  const lower = input.toLowerCase();
  return INLINE_FAQS.filter(item =>
    item.tags.some(tag => KEYWORD_MAP[tag]?.some(kw => lower.includes(kw)) || lower.includes(tag))
  ).slice(0, 3);
}

function generateResponse(input: string): string {
  const lower = input.toLowerCase();

  if (/สวัสดี|hello|hi|หวัดดี/.test(lower)) {
    return 'สวัสดีครับ! 👋 ผมคือผู้ช่วย IT ของโรงเรียน ยินดีช่วยเหลือเรื่องปัญหาไอทีครับ\n\nสามารถถามเรื่องอะไรก็ได้เลยครับ เช่น:\n- ปัญหา Wi-Fi / อินเทอร์เน็ต\n- คอมพิวเตอร์ทำงานผิดปกติ\n- ลืมรหัสผ่าน\n- ปัญหาเครื่องพิมพ์';
  }

  if (/ขอบคุณ|thank/.test(lower)) {
    return 'ยินดีครับ! 😊 ถ้ามีปัญหาเพิ่มเติมถามได้เลยนะครับ';
  }

  if (KEYWORD_MAP.wifi.some(k => lower.includes(k))) {
    if (lower.includes('รหัส') || lower.includes('password') || lower.includes('ชื่อ')) {
      return '**Wi-Fi โรงเรียน:**\n\n📶 ชื่อ Wi-Fi (SSID): **School-WiFi**\n🔑 รหัสผ่าน: ติดต่อเจ้าหน้าที่ IT ห้อง IT ชั้น 1 ได้เลยครับ\n\n⏰ ใช้งานได้เวลา 07:30–17:00 น. ในวันเรียน';
    }
    return '**ปัญหาเครือข่าย/อินเทอร์เน็ต:**\n\nลองทำตามขั้นตอนนี้ก่อนครับ:\n1. รีสตาร์ทเครื่อง\n2. ลืม Wi-Fi แล้วเชื่อมต่อใหม่\n3. เปิด/ปิด Airplane Mode\n4. ตรวจสอบวันที่/เวลาในเครื่อง\n\nถ้ายังไม่หาย แจ้งเจ้าหน้าที่ IT ที่ห้อง IT ชั้น 1 ครับ 🛠️';
  }

  if (KEYWORD_MAP.printer.some(k => lower.includes(k))) {
    return '**ปัญหาเครื่องพิมพ์:**\n\n**กระดาษติด:**\n1. ปิดเครื่องก่อน\n2. เปิดฝาครอบ ดึงกระดาษออกตามทิศทางกระดาษ\n3. ห้ามดึงย้อนทิศ (กระดาษจะขาดในเครื่อง)\n4. เปิดเครื่องใหม่\n\n**พิมพ์ไม่ออก:**\n1. ตรวจสอบ Queue งานพิมพ์ (อาจค้าง)\n2. รีสตาร์ท Printer\n\nถ้ายังไม่ได้ แจ้ง IT ได้เลยครับ 🖨️';
  }

  if (KEYWORD_MAP.password.some(k => lower.includes(k))) {
    return '**ปัญหารหัสผ่าน:**\n\n🔐 **ลืมรหัสผ่าน Windows:**\nติดต่อเจ้าหน้าที่ IT ที่ห้อง IT ชั้น 1 พร้อมบัตรประจำตัว\n\n🔐 **เปลี่ยนรหัสผ่าน Windows:**\nกด Ctrl+Alt+Delete → Change a password\n\n🔐 **รหัสผ่าน Google/Gmail โรงเรียน:**\nไปที่ accounts.google.com/signin/recovery\n\n⏰ เวลาทำการ IT: จ-ศ 07:30–17:00 น.';
  }

  if (KEYWORD_MAP.computer.some(k => lower.includes(k))) {
    if (lower.includes('ช้า')) {
      return '**คอมพิวเตอร์ทำงานช้า:**\n\n1. รีสตาร์ทเครื่อง (สำคัญมาก!)\n2. ปิดโปรแกรมที่ไม่ใช้ (Ctrl+Alt+Del → Task Manager)\n3. อย่าเปิดหลายแท็บใน Browser พร้อมกัน\n4. ล้าง Downloads folder เก่าๆ ทิ้ง\n\nถ้าช้าเป็นประจำ แจ้ง IT เพื่อทำความสะอาดระบบครับ 💻';
    }
    if (lower.includes('เปิดไม่') || lower.includes('ติดไม่')) {
      return '**คอมพิวเตอร์เปิดไม่ติด:**\n\n1. ตรวจสอบสายไฟเสียบแน่นหรือไม่\n2. กดปุ่ม Power ค้าง 5 วินาที\n3. ตรวจสอบไฟ UPS\n4. ลองเปลี่ยนเต้ารับ\n\n⚠️ ถ้าได้กลิ่นไหม้หรือมีควัน **ถอดปลั๊กทันที** และแจ้ง IT ครับ';
    }
    return '**ปัญหาคอมพิวเตอร์:**\n\nช่วยบอกอาการให้ชัดเจนกว่านี้ได้ครับ เช่น:\n- เปิดไม่ติด\n- ทำงานช้า\n- หน้าจอมีปัญหา\n- Internet ไม่ได้\n\nหรือติดต่อ IT ที่ห้อง IT ชั้น 1 ได้โดยตรงครับ 🛠️';
  }

  if (KEYWORD_MAP.projector.some(k => lower.includes(k))) {
    return '**ปัญหาโปรเจกเตอร์:**\n\n**ไม่แสดงภาพ:**\n1. ตรวจสอบสาย HDMI/VGA เสียบแน่น\n2. กด Win+P เลือก Duplicate\n3. ตรวจสอบ Input บนโปรเจกเตอร์\n\n**เปิดไม่ติด:**\n1. ตรวจสอบสายไฟ\n2. กดปุ่ม Power ค้าง 3 วินาที\n\nถ้ายังไม่ได้ แจ้ง IT ทันทีครับ 📽️';
  }

  if (KEYWORD_MAP.software.some(k => lower.includes(k))) {
    return '**ปัญหาซอฟต์แวร์/โปรแกรม:**\n\n**Office ไม่เปิด:**\n1. รีสตาร์ทเครื่องก่อน\n2. คลิกขวา → Run as Administrator\n3. ซ่อมผ่าน Control Panel → Programs\n\n**ต้องการติดตั้งโปรแกรมใหม่:**\nแจ้ง IT ที่ห้อง IT ชั้น 1 พร้อมระบุชื่อโปรแกรมและเหตุผล\nเจ้าหน้าที่จะดำเนินการภายใน 1–2 วันทำการครับ ⚙️';
  }

  if (KEYWORD_MAP.email.some(k => lower.includes(k)) || KEYWORD_MAP.classroom.some(k => lower.includes(k))) {
    return '**อีเมลและ Google Workspace:**\n\n📧 **รูปแบบอีเมล:**\n- ครู: ชื่อ.นามสกุล@school.ac.th\n- นักเรียน: รหัสนักเรียน@student.school.ac.th\n\n**เข้าไม่ได้:**\n1. ตรวจสอบว่าใช้อีเมลโรงเรียน (ไม่ใช่ Gmail ส่วนตัว)\n2. ล้าง Cache: Ctrl+Shift+Del\n3. ลอง Incognito Mode (Ctrl+Shift+N)\n\nถ้ายังไม่ได้ แจ้ง IT ครับ';
  }

  return `ขอโทษครับ ไม่เข้าใจคำถาม "${input}" ลองถามใหม่ด้วยคำที่ชัดเจนขึ้นครับ\n\n**หัวข้อที่ช่วยได้:**\n- 🌐 Wi-Fi / อินเทอร์เน็ต\n- 💻 คอมพิวเตอร์ทำงานผิดปกติ\n- 🔐 ลืมรหัสผ่าน\n- 🖨️ เครื่องพิมพ์\n- 📽️ โปรเจกเตอร์\n- ⚙️ ติดตั้งโปรแกรม\n- 📧 อีเมลโรงเรียน`;
}

export function getAiResponse(input: string): AiResponse {
  return {
    text: generateResponse(input),
    related_faqs: findRelatedFaqs(input),
  };
}

export function getWelcomeMessage(): string {
  return 'สวัสดีครับ! 👋 ผมคือ **ผู้ช่วย IT อัจฉริยะ** ของโรงเรียน\n\nพิมพ์ปัญหาที่คุณพบได้เลยครับ เช่น:\n- "Wi-Fi ใช้ไม่ได้"\n- "คอมพิวเตอร์เปิดไม่ติด"\n- "ลืมรหัสผ่าน"\n- "เครื่องพิมพ์กระดาษติด"';
}
