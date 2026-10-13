/**
 * Next.js edge middleware — refreshes Supabase session, protects dashboard routes.
 */

import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PATHS = ["/dashboard"];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const hasSession = Array.from(request.cookies.getAll()).some(({ name }) =>
      name.startsWith("sb-") && name.endsWith("-auth-token")
    );

    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
