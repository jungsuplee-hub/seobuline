import { clearSession } from "@/lib/auth";
import { redirectWithForwardedHeaders } from "@/lib/request";

export async function POST(req: Request) {
  await clearSession();
  return redirectWithForwardedHeaders(req, "/");
}
