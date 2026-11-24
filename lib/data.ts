import { applications, booking, business, businessCare, businessPro, dashboards, essential, forms, launch, portals, premiumCare } from "./inquiry-options";

export const packages = [
  { name: "Launch", option: launch, price: "$199", blurb: "Perfect for getting your business online.", cta: "Start My Site", features: ["One-page professional website", "Mobile-responsive design", "Services section", "Contact or quote request form", "Click-to-call button", "Social media links", "Domain connection", "One revision round"] },
  { name: "Business", option: business, price: "$499", blurb: "Everything a growing local business needs.", cta: "Build My Website", popular: true, features: ["Up to 5 pages", "Custom business design", "Mobile optimization", "Home, About, and Services pages", "Gallery or portfolio", "Contact page and quote forms", "Google Maps integration", "Social media links", "Basic SEO setup", "Analytics setup", "Domain connection", "Copy cleanup", "One revision round"] },
  { name: "Business Pro", option: businessPro, price: "$799", blurb: "More content, tools, and flexibility.", cta: "Go Pro", features: ["Up to 8 pages", "Everything in Business", "Blog setup", "Booking integrations", "Testimonials and reviews sections", "Enhanced forms", "Additional SEO setup", "Analytics", "Two revision rounds", "Priority turnaround"] },
];

export const projects = [
  { name: "DFW Elite Lawn Care", category: "Landscaping", description: "A fresh, confident lead-generation concept built around simple service choices and fast quotes.", services: ["Web design", "Mobile layout", "Quote form"], theme: "green", eyebrow: "Your lawn, handled.", action: "Get a free quote" },
  { name: "Bella's Cleaning Co.", category: "Residential Cleaning", description: "A bright, welcoming concept that makes recurring home cleaning feel easy to book.", services: ["Brand direction", "Service pages", "Booking flow"], theme: "blue", eyebrow: "A cleaner home. More time for you.", action: "See cleaning plans" },
  { name: "Texas Mobile Detail", category: "Automotive Detailing", description: "A bold mobile-first concept designed to turn local drivers into scheduled appointments.", services: ["Responsive design", "Package layout", "Calls to action"], theme: "orange", eyebrow: "Showroom shine, wherever you park.", action: "Book your detail" },
];

export const carePlans = [
  {
    name: "Essential", price: "$29", option: essential, cta: "Choose Essential",
    blurb: "Reliable hosting and technical peace of mind.",
    features: ["Managed website hosting", "SSL certificate", "Website uptime monitoring", "Basic security maintenance", "Domain management assistance", "Technical troubleshooting for covered services"],
    note: "Content updates and additional development are billed separately.",
  },
  {
    name: "Business Care", price: "$49", option: businessCare, cta: "Choose Business Care", popular: true,
    blurb: "Everything you need to keep your website current.",
    features: ["Everything in Essential", "Up to 30 minutes of minor website updates per month", "Text and photo updates", "Business hours and contact information updates", "Contact form functionality checks", "Ongoing technical support"],
  },
  {
    name: "Premium Care", price: "$99", option: premiumCare, cta: "Choose Premium Care",
    blurb: "More support for businesses that are growing.",
    features: ["Everything in Business Care", "Up to 60 total minutes of minor website updates per month", "Priority support", "Monthly website analytics summary", "Basic SEO monitoring", "Website performance reviews"],
  },
];

export const applicationServices = [
  { name: "Custom Business Forms", price: "$149", option: forms },
  { name: "Online Booking Systems", price: "$299", option: booking },
  { name: "Customer Portals", price: "$799", option: portals },
  { name: "Business Dashboards", price: "$999", option: dashboards },
  { name: "Custom Web Applications", price: "$1,499", option: applications },
];

export const applicationExamples = [
  "Customer management systems", "Employee dashboards", "Appointment scheduling", "Automated workflows",
  "Digital forms and questionnaires", "Inventory management tools", "Internal business tools",
  "Subscription-based platforms", "Custom database applications", "Customer-facing portals",
];

export const careTerms = [
  ["Billing and hosting", "Website Care plans are billed monthly. Standard hosting is included for eligible business websites. Your domain belongs to you, and domain registration and renewal fees are separate. Premium third-party services, advanced databases, and unusually high hosting usage may require additional fees."],
  ["Included edits and additional work", "Unused monthly editing time does not roll over. Minor updates include changes to existing text, images, contact information, business hours, and similar content. New pages, redesigns, custom features, and advanced development are outside the plans. Additional development is available at $75 per hour with your approval."],
  ["Support response times", "Standard support requests receive a response within two business days. Priority support requests receive a response within one business day. Resolution time depends on the issue."],
  ["Cancellation and website transfer", "You may cancel before the next billing cycle. If you cancel managed hosting, arrange alternative hosting before service ends. We’ll give you a reasonable opportunity to transfer your website and applicable customer-owned data."],
];

export const hostingOptions = [
  ["Self-Managed Website", [
    "One-time development payment",
    "You arrange and manage your own hosting",
    "You pay applicable hosting and third-party fees",
    "You manage future updates",
    "Additional Adams Digital Co. support is available upon request",
    "Website handoff and account setup assistance",
  ]],
  ["Adams Digital Managed Website", [
    "One-time development payment",
    "Monthly Website Care subscription",
    "Adams Digital Co. manages standard website hosting",
    "Ongoing monitoring and technical maintenance",
    "Website updates based on the selected plan",
    "No technical experience required",
  ]],
] as const;
