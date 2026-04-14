import { NextResponse } from "next/server";

export function getRequestOrigin(req: Request) {
  const proto = req.headers.get("x-forwarded-proto") ?? new URL(req.url).protocol.replace(":", "");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? new URL(req.url).host;
  return `${proto}://${host}`;
}

export function redirectWithForwardedHeaders(req: Request, pathname: string, status: 303 | 302 = 303) {
  return NextResponse.redirect(new URL(pathname, getRequestOrigin(req)), { status });
}
