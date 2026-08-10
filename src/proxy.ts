import { NextResponse, type NextRequest } from "next/server";

/**
 * Protects the analytics dashboard behind HTTP Basic Auth.
 *
 * Credentials are read from `DASHBOARD_USER` / `DASHBOARD_PASSWORD`
 * environment variables. If either is not configured, the dashboard
 * is blocked entirely (fail-safe closed) instead of falling back to
 * a default/hardcoded password.
 */
export function proxy(request: NextRequest) {
  const validUser = process.env.DASHBOARD_USER;
  const validPassword = process.env.DASHBOARD_PASSWORD;

  if (!validUser || !validPassword) {
    return new NextResponse("Dashboard is not configured.", { status: 503 });
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Basic ")) {
    const base64Credentials = authHeader.slice("Basic ".length);
    const [user, password] = atob(base64Credentials).split(":");

    if (user === validUser && password === validPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Dashboard", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
