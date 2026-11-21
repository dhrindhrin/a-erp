import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, decrypt } from "@/lib/session-token";

// Optimistic check only (cookie signature). Pages still verify via requireUser().
const protectedPrefixes = ["/dashboard"];
const authPages = ["/login", "/signup"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const session = await decrypt(req.cookies.get(SESSION_COOKIE)?.value);

  if (protectedPrefixes.some((p) => path.startsWith(p)) && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  if (authPages.includes(path) && session) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg|ico)$).*)"],
};
