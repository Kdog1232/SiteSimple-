const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value: string | undefined): URL | null {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  const valueWithProtocol = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const url = new URL(valueWithProtocol);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    url.pathname = url.pathname.replace(/\/$/, "");
    return url;
  } catch {
    return null;
  }
}

// Prefer an explicitly configured canonical domain. Vercel's generated URL
// variables contain hostnames without a protocol, so normalize them first.
export const metadataBase =
  normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  normalizeSiteUrl(process.env.VERCEL_URL) ??
  new URL(LOCAL_SITE_URL);

export const siteUrl = metadataBase.origin;
