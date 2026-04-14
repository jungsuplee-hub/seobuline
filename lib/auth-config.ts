export const ADMIN_EMAILS = ["4728740@hanmail.net"] as const;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isAdminEmail(email: string) {
  const normalized = normalizeEmail(email);
  return ADMIN_EMAILS.some((adminEmail) => normalizeEmail(adminEmail) === normalized);
}
