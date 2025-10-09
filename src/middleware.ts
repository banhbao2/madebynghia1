import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser()

    // If not authenticated, redirect to login
    if (!user && request.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // If authenticated and trying to access login page, redirect to dashboard
    if (user && request.nextUrl.pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    // Check if user is an active admin
    if (user && request.nextUrl.pathname !== '/admin/login') {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('is_active')
        .eq('id', user.id)
        .single()

      if (!adminUser || !adminUser.is_active) {
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
