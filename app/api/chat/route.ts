import Groq from 'groq-sdk';
import { NextRequest } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `คุณคือผู้ช่วย IT อัจฉริยะประจำโรงเรียน ชื่อว่า "IT Helper" มีหน้าที่ช่วยแก้ปัญหาด้านไอทีให้กับครูและนักเรียนในโรงเรียน

บทบาทของคุณ:
- ตอบคำถามและให้คำแนะนำด้าน IT เบื้องต้นในโรงเรียน
- อธิบายวิธีแก้ปัญหาเป็นขั้นตอนที่ชัดเจน ทำตามได้ง่าย
- ใช้ภาษาที่เข้าใจง่าย เหมาะกับครูและนักเรียนทุกระดับ
- พูดภาษาไทยเป็นหลัก สามารถใช้ศัพท์เทคนิคภาษาอังกฤษได้เมื่อจำเป็น

ข้อมูลโรงเรียน:
- Wi-Fi: ชื่อ "School-WiFi" รหัสผ่านติดต่อ IT ห้อง IT ชั้น 1
- เวลาทำการ IT: วันจันทร์-ศุกร์ 07:30-17:00 น. โทร 081-234-5678
- อีเมลครู: ชื่อ.นามสกุล@school.ac.th
- อีเมลนักเรียน: รหัสนักเรียน@student.school.ac.th
- ห้อง IT อยู่ที่ชั้น 1

แนวทางการตอบ:
- ถ้าปัญหาแก้ได้ด้วยตัวเอง: ให้ขั้นตอนละเอียด
- ถ้าต้องการช่างหรือผู้เชี่ยวชาญ: แนะนำให้ติดต่อ IT ห้อง IT ชั้น 1
- ถ้าเป็นกรณีฉุกเฉิน (ไฟไหม้, ควัน, ไฟดูด): เน้นความปลอดภัยก่อน
- ตอบกระชับ ไม่ยาวเกินไป แต่ครอบคลุมและมีประโยชน์
- ใช้ emoji ได้บ้างเพื่อให้อ่านง่าย

หัวข้อที่ช่วยได้:
Wi-Fi และอินเทอร์เน็ต, คอมพิวเตอร์และแล็ปท็อป, เครื่องพิมพ์, โปรเจกเตอร์, รหัสผ่านและบัญชีผู้ใช้, Google Workspace (Gmail, Classroom, Drive, Meet), Microsoft Office, ซอฟต์แวร์ทั่วไป, อุปกรณ์ต่อพ่วง และปัญหาเครือข่ายต่างๆ`;

export async function POST(req: NextRequest) {
  const { message, history } = await req.json() as {
    message: string;
    history: { role: 'user' | 'assistant'; content: string }[];
  };

  try {
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message },
      ],
      stream: true,
      max_tokens: 1024,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? '';
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Groq error]', msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ key_set: !!process.env.GROQ_API_KEY });
}
