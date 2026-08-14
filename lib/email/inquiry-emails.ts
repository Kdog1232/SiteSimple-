import "server-only";
import { Resend } from "resend";
import type { Inquiry } from "@/lib/inquiry-schema";

type StoredInquiry = Inquiry & { inquiryId: string; createdAt: string };

const escapeHtml = (value: string | null) => (value || "Not provided").replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[character] as string));

function emailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INQUIRY_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Email is not configured");
  return { resend: new Resend(apiKey), from };
}

export async function sendOwnerInquiryEmail(inquiry: StoredInquiry) {
  const { resend, from } = emailConfig();
  const to = process.env.INQUIRY_NOTIFICATION_EMAIL;
  if (!to) throw new Error("Owner notification email is not configured");
  const rows = [
    ["Customer name", inquiry.name], ["Business", inquiry.businessName], ["Email", inquiry.email],
    ["Phone", inquiry.phone], ["Business type", inquiry.businessType], ["Current website", inquiry.currentWebsite],
    ["Package", inquiry.package], ["Domain status", inquiry.domain], ["Business description", inquiry.description],
    ["Website goal", inquiry.goal], ["Notes", inquiry.notes], ["Inquiry ID", inquiry.inquiryId],
    ["Submission time", inquiry.createdAt],
  ];
  const { data, error } = await resend.emails.send({
    from, to, replyTo: inquiry.email,
    subject: `New SiteSimple Inquiry — ${inquiry.businessName}`,
    html: `<h1>New SiteSimple inquiry</h1><table>${rows.map(([label, value]) => `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("")}</table>`,
  });
  if (error || !data?.id) throw new Error(error?.message || "Owner email was not accepted");
  return data.id;
}

export async function sendCustomerInquiryEmail(inquiry: StoredInquiry) {
  const { resend, from } = emailConfig();
  const { data, error } = await resend.emails.send({
    from, to: inquiry.email, replyTo: process.env.INQUIRY_REPLY_TO_EMAIL || undefined,
    subject: "We received your SiteSimple project inquiry",
    html: `<p>Hi ${escapeHtml(inquiry.name)},</p><p>Your project inquiry was successfully received. We’ll review the details and contact you regarding scope and next steps.</p><p>Submitting an inquiry does not obligate you to purchase anything.</p><h2>Inquiry summary</h2><p><strong>Business:</strong> ${escapeHtml(inquiry.businessName)}<br><strong>Package:</strong> ${escapeHtml(inquiry.package)}<br><strong>Website goal:</strong> ${escapeHtml(inquiry.goal)}</p><p>Thank you,<br>SiteSimple</p>`,
  });
  if (error || !data?.id) throw new Error(error?.message || "Customer email was not accepted");
  return data.id;
}
