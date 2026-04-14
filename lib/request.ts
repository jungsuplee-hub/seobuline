import { NextResponse } from "next/server";

function normalizeBaseUrl(value: string) {
  return value.trim().replace(/\/$/, "");
}

export function getAppBaseUrl(req?: Request) {
  const envBaseUrl = process.env.APP_BASE_URL?.trim();
  if (envBaseUrl) {
    return normalizeBaseUrl(envBaseUrl);
  }

  if (!req) {
    return "http://localhost:5050";
  }

  const url = new URL(req.url);
  const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = forwardedProto || url.protocol.replace(":", "");
  const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || req.headers.get("host") || url.host;
  const forwardedPort = req.headers.get("x-forwarded-port")?.split(",")[0]?.trim();

  if (forwardedHost) {
    return `${proto}://${forwardedHost}`;
  }

  if (!forwardedPort || host.includes(":")) {
    return `${proto}://${host}`;
  }

  if ((proto === "https" && forwardedPort === "443") || (proto === "http" && forwardedPort === "80")) {
    return `${proto}://${host}`;
  }

  return `${proto}://${host}:${forwardedPort}`;
}

export function getRequestOrigin(req: Request) {
  return getAppBaseUrl(req);
}

export function buildAbsoluteUrl(pathname: string, req?: Request) {
  const baseUrl = getAppBaseUrl(req);
  return new URL(pathname, `${baseUrl}/`).toString();
}

export function redirectWithForwardedHeaders(req: Request, pathname: string, status: 303 | 302 = 303) {
  return NextResponse.redirect(new URL(pathname, `${getRequestOrigin(req)}/`), { status });
}
