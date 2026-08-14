import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { inquirySchema } from "@/lib/inquiry-schema";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendCustomerInquiryEmail, sendOwnerInquiryEmail } from "@/lib/email/inquiry-emails";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 32 * 1024;
const publicError = "We couldn't save your inquiry. Please try again.";

function responseError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

function fingerprint(request: Request) {
  const salt = process.env.INQUIRY_RATE_LIMIT_SALT;
  if (!salt) throw new Error("Inquiry rate limiting is not configured");
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const identifyingData = [forwarded, request.headers.get("user-agent") || "", request.headers.get("accept-language") || ""].join("|");
  return createHash("sha256").update(`${salt}|${identifyingData}`).digest("hex");
}

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) return responseError("The inquiry is too large.", 413);

  let rawBody: string;
  let body: unknown;
  try {
    rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) return responseError("The inquiry is too large.", 413);
    body = JSON.parse(rawBody);
  } catch {
    return responseError("The request was not valid JSON.", 400);
  }

  const validation = inquirySchema.safeParse(body);
  if (!validation.success) return responseError(validation.error.issues[0]?.message || "Check the form and try again.", 400);
  if (validation.data.website) return responseError("The inquiry could not be accepted.", 400);

  try {
    const supabase = getSupabaseAdmin();
    const { data: existing, error: lookupError } = await supabase
      .from("inquiries").select("id").eq("submission_id", validation.data.submissionId).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) return NextResponse.json({ success: true, inquiryId: existing.id });

    const { data: allowed, error: rateError } = await supabase.rpc("check_inquiry_rate_limit", {
      p_fingerprint_hash: fingerprint(request), p_maximum_requests: 5, p_window_seconds: 3600,
    });
    if (rateError) throw rateError;
    if (!allowed) return responseError("Too many inquiries have been submitted. Please try again later.", 429);

    const inquiry = validation.data;
    const record = {
      name: inquiry.name, business_name: inquiry.businessName, email: inquiry.email, phone: inquiry.phone,
      business_type: inquiry.businessType, current_website: inquiry.currentWebsite, package_interest: inquiry.package,
      owns_domain: inquiry.domain, description: inquiry.description, goal: inquiry.goal, notes: inquiry.notes,
      submission_id: inquiry.submissionId,
    };
    const { data: stored, error: insertError } = await supabase.from("inquiries").insert(record).select("id, created_at").single();
    if (insertError) {
      if (insertError.code === "23505") {
        const { data: duplicate } = await supabase.from("inquiries").select("id").eq("submission_id", inquiry.submissionId).single();
        if (duplicate) return NextResponse.json({ success: true, inquiryId: duplicate.id });
      }
      throw insertError;
    }

    const emailInquiry = { ...inquiry, inquiryId: stored.id, createdAt: stored.created_at };
    const [ownerResult, customerResult] = await Promise.allSettled([
      sendOwnerInquiryEmail(emailInquiry), sendCustomerInquiryEmail(emailInquiry),
    ]);
    const ownerFailed = ownerResult.status === "rejected";
    const customerFailed = customerResult.status === "rejected";
    const emailUpdate = {
      owner_email_status: ownerFailed ? "failed" : "sent",
      owner_email_id: ownerFailed ? null : ownerResult.value,
      customer_email_status: customerFailed ? "failed" : "sent",
      customer_email_id: customerFailed ? null : customerResult.value,
      email_last_error: ownerFailed || customerFailed ? [ownerFailed && "Owner notification failed", customerFailed && "Customer confirmation failed"].filter(Boolean).join("; ") : null,
    };
    const { error: updateError } = await supabase.from("inquiries").update(emailUpdate).eq("id", stored.id);
    if (updateError) console.error("Unable to record inquiry email status", stored.id);

    return NextResponse.json({ success: true, inquiryId: stored.id });
  } catch (error) {
    console.error("Inquiry submission failed", error instanceof Error ? error.message : "Unknown error");
    return responseError(publicError, 503);
  }
}
