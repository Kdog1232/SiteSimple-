import { z } from "zod";

export const PACKAGE_OPTIONS = [
  "Launch — $199",
  "Business — $499",
  "Business Pro — $799",
  "DIY Website Rescue — Starting at $249",
  "Custom Project",
  "Not Sure",
] as const;

export const DOMAIN_OPTIONS = ["Yes", "No", "Not sure"] as const;

const requiredText = (label: string, maximum: number) =>
  z.string().trim().min(1, `${label} is required.`).max(maximum, `${label} is too long.`);

const optionalText = (maximum: number) =>
  z.union([z.string().trim().max(maximum), z.null()]).transform((value) => value || null);

const optionalUrl = z
  .union([z.string().trim().max(2_048).url("Enter a valid current website URL."), z.literal(""), z.null()])
  .transform((value) => value || null);

export const inquirySchema = z.object({
  name: requiredText("Name", 120),
  businessName: requiredText("Business name", 160),
  email: z.string().trim().max(254).email("Enter a valid email address."),
  phone: optionalText(40),
  businessType: requiredText("Business type", 120),
  currentWebsite: optionalUrl,
  package: z.enum(PACKAGE_OPTIONS),
  domain: z.enum(DOMAIN_OPTIONS),
  description: requiredText("Business description", 3_000),
  goal: requiredText("Website goal", 3_000),
  notes: optionalText(3_000),
  submissionId: z.string().uuid("Invalid submission identifier."),
  website: z.string().trim().max(200),
}).strict();

export type Inquiry = z.infer<typeof inquirySchema>;
