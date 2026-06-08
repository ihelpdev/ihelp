import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/register') || request.nextUrl.pathname.startsWith('/login')
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/customer') || request.nextUrl.pathname.startsWith('/merchant')

  // DEVELOPMENT BYPASS
  if (process.env.NODE_ENV === 'development') {
    const isMockBypass = request.cookies.get('dev_mock_bypass')?.value === 'true';
    if (isMockBypass) {
      if (isAuthRoute) {
        const mockRole = request.cookies.get('dev_mock_role')?.value;
        const url = request.nextUrl.clone();
        url.pathname = mockRole === 'MERCHANT' ? '/merchant/dashboard' : '/customer/dashboard';
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }
  }

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    const role = user.user_metadata?.role;
    const url = request.nextUrl.clone()
    if (role === 'MERCHANT') {
       url.pathname = '/merchant/dashboard';
    } else {
       url.pathname = '/customer/dashboard';
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
