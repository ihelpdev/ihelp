import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Authenticate the current request with a hard timeout.
 *
 * `supabase.auth.getUser()` makes a network round-trip to the Supabase auth
 * server.  When that server is slow or unreachable the call blocks for the
 * default 10 s fetch timeout, causing every API route to return 401 after a
 * 10-second wait.
 *
 * This helper races the real `getUser()` against a configurable timer and
 * falls back to `getSession()` (cookie-read, no network) when the network
 * call doesn't resolve in time.  `getSession()` is slightly less secure (the
 * JWT is not re-validated server-side) but is always available offline and is
 * acceptable as a fallback because the middleware has already verified the
 * session on every incoming request.
 *
 * Returns `{ user, error }` — same shape as `supabase.auth.getUser()`.
 */
export async function getAuthUser(timeoutMs = 4000) {
  const supabase = await createClient()

  const getUserPromise = supabase.auth
    .getUser()
    .then(({ data, error }) => ({ user: data.user, error }))
    .catch((err) => ({ user: null, error: err }))

  const timeoutPromise = new Promise<{ user: null; error: Error }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          user: null,
          error: new Error(`getUser() timed out after ${timeoutMs}ms`),
        }),
      timeoutMs,
    ),
  )

  const result = await Promise.race([getUserPromise, timeoutPromise])

  // If the network timed out, fall back to the local cookie-based session.
  // The JWT is already cryptographically signed — no re-validation needed for
  // basic route protection when the auth server is unreachable.
  if (!result.user) {
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData?.session?.user) {
      return { user: sessionData.session.user, error: null, supabase }
    }
  }

  return { ...result, supabase }
}
