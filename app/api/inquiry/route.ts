import "server-only";

import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  SiteSimpleInquiryInsert,
  SiteSimpleInquiryUpdate,
} from "@/lib/supabase/database.types";

const packages = [
  "Launch — $199",
  "Business — $499",
  "Business Pro — $799",
  "DIY Website Rescue — Starting at $249",
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
  package: z.enum(packages),
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
    ["Current website", inquiry.currentWebsite || "Not provided"], ["Selected package", inquiry.package],
    ["Domain ownership", inquiry.domain], ["Business description", inquiry.description],
    ["Website goals", inquiry.goal], ["Additional information", inquiry.notes || "None"],
    ["Submission date (UTC)", submittedAt],
  ];
  return fields.map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value).replace(/\r?\n/g, "<br>")}</p>`).join("");
}

async function updateEmailState(inquiryId: string, changes: SiteSimpleInquiryUpdate) {
  try {
    const { error } = await getSupabaseAdmin()
      .from("sitesimple_inquiries")
      .update(changes)
      .eq("id", inquiryId);
    if (error) console.error("Inquiry email status update failed", { inquiryId, code: error.code });
  } catch {
    console.error("Inquiry email status update threw", { inquiryId });
  }
}

async function sendInquiryEmail(kind: "owner" | "customer", inquiryId: string, inquiry: Inquiry, submittedAt: string) {
  const isOwner = kind === "owner";
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.INQUIRY_FROM_EMAIL?.trim();
  const owner = process.env.INQUIRY_NOTIFICATION_EMAIL?.trim();
  const to = isOwner ? owner : inquiry.email;
  const replyTo = isOwner ? inquiry.email : process.env.INQUIRY_REPLY_TO_EMAIL?.trim() || owner;
  const statusField = isOwner ? "owner_email_status" : "customer_email_status";
  const idField = isOwner ? "owner_email_id" : "customer_email_id";
  let failure = "Resend request failed.";

  try {
    const missing = [
      !apiKey && "RESEND_API_KEY",
      !from && "INQUIRY_FROM_EMAIL",
      !to && "INQUIRY_NOTIFICATION_EMAIL",
    ].filter(Boolean);
    if (!apiKey || !from || !to) {
      failure = `Missing settings: ${missing.join(", ")}`;
      throw new Error(failure);
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo,
      subject: isOwner ? "New Customer Inquiry — Adams Digital Co." : "We received your Adams Digital Co. project inquiry",
      html: isOwner
        ? ownerEmail(inquiry, submittedAt)
        : `<p>Hi ${escapeHtml(inquiry.name)},</p><p>Thanks! We've received your project inquiry for ${escapeHtml(inquiry.businessName)}. We'll review it and follow up about next steps.</p>`,
    });
    if (error || !data?.id) {
      failure = error ? `Resend rejected the message (${error.name}). Check Resend logs.` : "Resend returned no email ID.";
      throw new Error(failure);
    }

    console.info("Inquiry email accepted by Resend", { inquiryId, kind, emailId: data.id });
    await updateEmailState(inquiryId, {
      [statusField]: "sent",
      [idField]: data.id,
      ...(isOwner ? { email_last_error: null } : {}),
    });
  } catch {
    console.error("Inquiry email failed", { inquiryId, kind, reason: failure });
    await updateEmailState(inquiryId, {
      [statusField]: "failed",
      ...(isOwner ? { email_last_error: failure } : {}),
    });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    console.warn("Inquiry validation failed", { fields: parsed.error.issues.map((issue) => issue.path.join(".")) });
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const inquiry = parsed.data;
  let step = "supabase_configuration";
  try {
    console.info("Inquiry received", { submissionId: inquiry.submissionId });
    const supabase = getSupabaseAdmin();
    step = "rate_limit";
    const fingerprint = visitorFingerprint(request);
    const { data: allowed, error: rateLimitError } = await supabase.rpc(
      "sitesimple_check_inquiry_rate_limit",
      { p_fingerprint: fingerprint, p_max_requests: 5, p_window_minutes: 60 },
    );
    if (rateLimitError) throw new Error(rateLimitError.code || "Rate-limit check failed");
    if (allowed !== true) {
      console.warn("Inquiry rate limit reached", { submissionId: inquiry.submissionId });
      return NextResponse.json({ error: "Too many inquiries. Please try again later." }, { status: 429 });
    }

    step = "duplicate_lookup";
    const { data: existing, error: lookupError } = await supabase
      .from("sitesimple_inquiries").select("id").eq("submission_id", parsed.data.submissionId).maybeSingle();
    if (lookupError) throw new Error(lookupError.code || "Duplicate check failed");
    if (existing) {
      console.info("Inquiry already stored", { inquiryId: existing.id });
      return NextResponse.json({ success: true, inquiryId: existing.id });
    }

    step = "inquiry_insert";
    const record: SiteSimpleInquiryInsert = {
      name: inquiry.name,
      business_name: inquiry.businessName,
      email: inquiry.email,
      phone: inquiry.phone || null,
      business_type: inquiry.businessType,
      current_website: inquiry.currentWebsite || null,
      package_interest: inquiry.package,
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
      if (!error && raced) {
        console.info("Inquiry already stored by concurrent request", { inquiryId: raced.id });
        return NextResponse.json({ success: true, inquiryId: raced.id });
      }
    }
    if (insertError || !inserted) throw new Error(insertError?.code || "Insert returned no row");

    console.info("Inquiry saved to Supabase", { inquiryId: inserted.id, submissionId: inquiry.submissionId });
    await sendInquiryEmail("owner", inserted.id, inquiry, inserted.created_at);
    await sendInquiryEmail("customer", inserted.id, inquiry, inserted.created_at);
    return NextResponse.json({ success: true, inquiryId: inserted.id });
  } catch (error) {
    console.error("Inquiry could not be saved", {
      submissionId: inquiry.submissionId,
      step,
      reason: error instanceof Error && /^[A-Z0-9]{5,8}$/.test(error.message) ? error.message : "Check Supabase configuration and connectivity.",
    });
    return NextResponse.json({ error: "We couldn't save your inquiry. Please try again." }, { status: 503 });
  }
}
