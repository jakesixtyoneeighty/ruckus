import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export default async function proxy(request: NextRequest) {
  // Refresh the Supabase session cookies first so getUser() below is accurate.
  const response = await updateSession(request);

  // updateSession() returns a NextResponse.next() chain — read the user from
  // the request cookies via the refreshed response is complex here, so do a
  // lightweight session check: the presence of a Supabase auth cookie.
  // The server components on / and /project/[id] do the authoritative check
  // and render the landing gate when unauthenticated; this middleware just
  // keeps deep links tidy by sending unauthenticated /project/* hits to /.
  if (request.nextUrl.pathname.startsWith("/project")) {
    const hasSession = request.cookies
      .getAll()
      .some(
        (c) =>
          c.name.startsWith("sb-") &&
          (c.name.endsWith("-auth-token") || c.name.includes("-auth-token"))
      );
    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/project/:path*"],
};
