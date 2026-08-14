import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.businessName || !body?.email || !body?.businessType || !body?.package || !body?.domain || !body?.description || !body?.goal) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }
  // Integration seam: forward validated data to Resend, Supabase, or a CRM here.
  if (!process.env.INQUIRY_WEBHOOK_URL) {
    return NextResponse.json({ error: "Inquiry delivery is not configured yet. Please try again later." }, { status: 503 });
  }
  const result = await fetch(process.env.INQUIRY_WEBHOOK_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  if (!result.ok) return NextResponse.json({ error: "We couldn't send your inquiry. Please try again." }, { status: 502 });
  return NextResponse.json({ success: true });
}
