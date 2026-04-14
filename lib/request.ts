import { NextResponse } from "next/server";

export function getRequestOrigin(req: Request) {
  const url = new URL(req.url);
  const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = forwardedProto || url.protocol.replace(":", "");
  const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || req.headers.get("host") || url.host;
  const forwardedPort = req.headers.get("x-forwarded-port")?.split(",")[0]?.trim();

  if (!forwardedPort || host.includes(":")) return `${proto}://${host}`;
  if ((proto === "https" && forwardedPort === "443") || (proto === "http" && forwardedPort === "80")) {
    return `${proto}://${host}`;
  }
  return `${proto}://${host}:${forwardedPort}`;
}

export function redirectWithForwardedHeaders(req: Request, pathname: string, status: 303 | 302 = 303) {
  return NextResponse.redirect(new URL(pathname, getRequestOrigin(req)), { status });
}
