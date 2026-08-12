import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Resolves to null if getUser() takes longer than `ms` milliseconds */
async function getUserWithTimeout(
  supabase: ReturnType<typeof createServerClient>,
  ms = 3000,
) {
  const timeout = new Promise<null>((resolve) =>
    setTimeout(() => resolve(null), ms),
  );
  const getUser = supabase.auth
    .getUser()
    .then(({ data }: any) => data.user ?? null)
    .catch(() => null);
  return Promise.race([getUser, timeout]);
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Use a timeout so a slow/unreachable Supabase network won't stall every request
  const user = await getUserWithTimeout(supabase, 3000);

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/login");
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/customer") ||
    request.nextUrl.pathname.startsWith("/merchant");

  // DEVELOPMENT BYPASS
  if (process.env.NODE_ENV === "development") {
    const isMockBypass =
      request.cookies.get("dev_mock_bypass")?.value === "true";
    if (isMockBypass) {
      if (isAuthRoute) {
        const mockRole = request.cookies.get("dev_mock_role")?.value;
        const url = request.nextUrl.clone();
        url.pathname =
          mockRole === "MERCHANT"
            ? "/merchant/dashboard"
            : "/customer/dashboard";
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }
  }

  // If getUser timed out (user === null) on a protected route, don't hard-redirect —
  // let the client-side AuthGuard handle it once the Redux state resolves.
  // Only redirect to login if we definitively know there is no user.
  if (user === null && isProtectedRoute) {
    // Check for a session cookie as a lightweight indicator before hard-redirecting.
    // If any supabase session cookies exist, the client likely has a valid session
    // that just timed out server-side; let it through.
    const hasSessionCookie = request.cookies
      .getAll()
      .some((c) => c.name.includes("sb-") && c.name.includes("-auth-token"));
    if (!hasSessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (user && isAuthRoute) {
    const role = user.user_metadata?.role;
    const url = request.nextUrl.clone();
    if (role === "MERCHANT") {
      url.pathname = "/merchant/dashboard";
    } else {
      url.pathname = "/customer/dashboard";
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
