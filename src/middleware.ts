import { NextResponse, type NextRequest } from "next/server";

/**
 * Protects the analytics dashboard behind HTTP Basic Auth.
 *
 * Credentials are read from `DASHBOARD_USER` / `DASHBOARD_PASSWORD`
 * environment variables. If either is not configured, the dashboard
 * is blocked entirely (fail-safe closed) instead of falling back to
 * a default/hardcoded password.
 */
export function middleware(request: NextRequest) {
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

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Authentication Required</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        h1 { font-size: 2rem; margin-bottom: 1rem; }
        p { color: #94a3b8; margin-bottom: 2rem; }
        a { background-color: #1a4a4e; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 0.5rem; font-weight: 500; transition: background-color 0.2s; }
        a:hover { background-color: #23686e; }
      </style>
    </head>
    <body>
      <h1>Access Denied</h1>
      <p>You need to provide valid credentials to view the dashboard.</p>
      <a href="/">Return to Home</a>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Dashboard", charset="UTF-8"',
      "Content-Type": "text/html",
    },
  });
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
