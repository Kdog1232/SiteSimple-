import "server-only";

import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import { careOptions, projectOptions } from "@/lib/inquiry-options";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  SiteSimpleInquiryInsert,
  SiteSimpleInquiryUpdate,
} from "@/lib/supabase/database.types";

const legacyPackages = [
  "Launch — $199",
  "Business — $499",
  "Business Pro — $799",
  "Custom Project",
  "Not Sure",
] as const;
const domainStatuses = ["Yes", "No", "Not sure"] as const;
const requiredText = (maximum: number) => z.string().trim().min(1).max(maximum);
const optionalText = (maximum: number) => z.string().trim().max(maximum);

const inquirySchema = z.object({
  name: requiredText(120),
  businessName: requiredText(160),
  email: z.string().trim().email().max(254),
  phone: optionalText(50),
  businessType: requiredText(120),
  currentWebsite: z.union([z.literal(""), z.string().trim().url().max(2048)]),
  package: z.enum([...projectOptions, ...legacyPackages]),
  websiteCareInterest: z.union([z.enum(careOptions), z.literal("")]).optional(),
  domain: z.enum(domainStatuses),
  description: requiredText(4000),
  goal: requiredText(4000),
  notes: optionalText(4000),
  submissionId: z.string().uuid(),
  website: z.string().max(0),
}).strict();

type Inquiry = z.infer<typeof inquirySchema>;

function visitorFingerprint(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const salt = process.env.INQUIRY_RATE_LIMIT_SALT;
  if (!salt) throw new Error("Inquiry rate-limit salt is not configured.");
  return createHash("sha256").update(`${salt}:${address}`).digest("hex");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character] ?? character);
}

function ownerEmail(inquiry: Inquiry, submittedAt: string) {
  const fields = [
    ["Customer name", inquiry.name], ["Business name", inquiry.businessName], ["Email address", inquiry.email],
    ["Phone number", inquiry.phone || "Not provided"], ["Business type", inquiry.businessType],
    ["Current website", inquiry.currentWebsite || "Not provided"], ["Project package", inquiry.package],
    ["Website Care plan", inquiry.websiteCareInterest || "Not specified"],
    ["Domain ownership", inquiry.domain], ["Business description", inquiry.description],
    ["Website or application goals", inquiry.goal], ["Additional information", inquiry.notes || "None"],
    ["Submission date (UTC)", new Date(submittedAt).toUTCString()],
  ];
  return fields.map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`).join("");
}

async function updateEmailState(
  inquiryId: string,
  changes: SiteSimpleInquiryUpdate,
) {
  try {
    const { error } = await getSupabaseAdmin()
      .from("sitesimple_inquiries")
      .update(changes)
      .eq("id", inquiryId);
    if (error) console.error("Inquiry email status update failed", { inquiryId, code: error.code });
  } catch {
    console.error("Inquiry email status update failed", { inquiryId });
  }
}

async function sendEmails(inquiryId: string, inquiry: Inquiry, submittedAt: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.INQUIRY_FROM_EMAIL?.trim();
  const owner = process.env.INQUIRY_NOTIFICATION_EMAIL?.trim();
  const replyTo = process.env.INQUIRY_REPLY_TO_EMAIL?.trim();
  if (!apiKey || !from) {
    await updateEmailState(inquiryId, {
      owner_email_status: "failed",
      customer_email_status: "failed",
      email_last_error: "Resend server configuration is incomplete.",
    });
    return;
  }

  const resend = new Resend(apiKey);
  let ownerError: string | null = null;
  try {
    if (!owner) throw new Error("Owner notification address is not configured.");
    const result = await resend.emails.send({
      from, to: owner, replyTo: inquiry.email,
      subject: `New Adams Digital Co. Inquiry — ${inquiry.businessName}`,
      html: ownerEmail(inquiry, submittedAt),
    });
    if (result.error) throw new Error(result.error.message);
    if (!result.data?.id) throw new Error("Resend returned no email ID.");
    await updateEmailState(inquiryId, {
      owner_email_status: "sent", owner_email_id: result.data.id, email_last_error: null,
    });
  } catch (error) {
    ownerError = error instanceof Error ? error.message : "Owner email failed.";
    await updateEmailState(inquiryId, {
      owner_email_status: "failed",
      email_last_error: ownerError,
    });
  }

  try {
    if (!replyTo) throw new Error("Customer confirmation reply-to address is not configured.");
    const result = await resend.emails.send({
      from, to: inquiry.email, replyTo,
      subject: "We received your Adams Digital Co. project inquiry",
      html: `<p>Hi ${escapeHtml(inquiry.name)},</p><p>Thanks! We've received your project inquiry for ${escapeHtml(inquiry.businessName)}. We'll review it and follow up about next steps.</p>`,
    });
    if (result.error) throw new Error(result.error.message);
    if (!result.data?.id) throw new Error("Resend returned no email ID.");
    await updateEmailState(inquiryId, {
      customer_email_status: "sent", customer_email_id: result.data.id,
    });
  } catch (error) {
    const customerError = error instanceof Error ? error.message : "Customer email failed.";
    await updateEmailState(inquiryId, {
      customer_email_status: "failed",
      email_last_error: ownerError ? `Owner: ${ownerError}\nCustomer: ${customerError}` : customerError,
    });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const fingerprint = visitorFingerprint(request);
    const { data: allowed, error: rateLimitError } = await supabase.rpc(
      "sitesimple_check_inquiry_rate_limit",
      { p_fingerprint: fingerprint, p_max_requests: 5, p_window_minutes: 60 },
    );
    if (rateLimitError) throw new Error(`Rate-limit check failed: ${rateLimitError.message}`);
    if (allowed !== true) {
      return NextResponse.json({ error: "Too many inquiries. Please try again later." }, { status: 429 });
    }

    const { data: existing, error: lookupError } = await supabase
      .from("sitesimple_inquiries").select("id").eq("submission_id", parsed.data.submissionId).maybeSingle();
    if (lookupError) throw new Error(`Duplicate check failed: ${lookupError.message}`);
    if (existing) return NextResponse.json({ success: true, inquiryId: existing.id });

    const inquiry = parsed.data;
    const record: SiteSimpleInquiryInsert = {
      name: inquiry.name,
      business_name: inquiry.businessName,
      email: inquiry.email,
      phone: inquiry.phone || null,
      business_type: inquiry.businessType,
      current_website: inquiry.currentWebsite || null,
      package_interest: inquiry.package,
      website_care_interest: inquiry.websiteCareInterest || null,
      owns_domain: inquiry.domain,
      description: inquiry.description,
      goal: inquiry.goal,
      notes: inquiry.notes || null,
      status: "new",
      source: "sitesimple_web",
      submission_id: inquiry.submissionId,
      owner_email_status: "pending",
      customer_email_status: "pending",
    };
    const { data: inserted, error: insertError } = await supabase
      .from("sitesimple_inquiries").insert(record).select("id, created_at").single();

    if (insertError?.code === "23505") {
      const { data: raced, error } = await supabase
        .from("sitesimple_inquiries").select("id").eq("submission_id", inquiry.submissionId).single();
      if (!error && raced) return NextResponse.json({ success: true, inquiryId: raced.id });
    }
    if (insertError || !inserted) throw new Error(`Inquiry insert failed: ${insertError?.message ?? "No row returned"}`);

    try {
      await sendEmails(inserted.id, inquiry, inserted.created_at);
    } catch (error) {
      console.error("Unable to complete inquiry email handling:", error instanceof Error ? error.message : "Unknown error");
    }
    return NextResponse.json({ success: true, inquiryId: inserted.id });
  } catch (error) {
    console.error("SiteSimple inquiry could not be accepted:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "We couldn't save your inquiry. Please try again." }, { status: 503 });
  }
}
