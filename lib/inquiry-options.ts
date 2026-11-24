export const projectOptions = [
  "Launch Website — $199",
  "Business Website — $499",
  "Business Pro Website — $799",
  "DIY Website Rescue — Starting at $249",
  "Custom Business Forms — Starting at $149",
  "Online Booking Systems — Starting at $299",
  "Customer Portals — Starting at $799",
  "Business Dashboards — Starting at $999",
  "Custom Web Applications — Starting at $1,499",
  "Website Care Only",
  "Not Sure — Help Me Decide",
] as const;

export const [
  launch, business, businessPro, rescue, forms, booking, portals, dashboards, applications, careOnly,
] = projectOptions;

export const careOptions = [
  "Essential — $29/month",
  "Business Care — $49/month",
  "Premium Care — $99/month",
  "Custom Application Maintenance — Starting at $99/month",
  "Self-Managed Hosting",
  "Not Sure Yet",
] as const;

export const [essential, businessCare, premiumCare, applicationMaintenance] = careOptions;

export type ProjectOption = (typeof projectOptions)[number];
export type CareOption = (typeof careOptions)[number];
export type InquirySelection = { project: ProjectOption; care?: CareOption };
