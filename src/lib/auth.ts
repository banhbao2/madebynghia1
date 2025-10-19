import { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Validate admin authentication using Supabase session
 * Integrates with existing Supabase Auth system
 */
export async function validateAdminAuth(request: NextRequest): Promise<boolean> {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return false
    }

    // Verify user is an admin in admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('is_active, role')
      .eq('id', user.id)
      .single()

    if (adminError || !adminUser) {
      return false
    }

    // Check if admin is active
    if (!adminUser.is_active) {
      return false
    }

    return true
  } catch (error) {
    console.error('Error validating admin auth:', error)
    return false
  }
}

/**
 * Rate limiting helper (simple in-memory implementation)
 * For production, use Redis or a proper rate limiting service
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  // Skip rate limiting in development or for localhost
  if (process.env.NODE_ENV === 'development' || identifier.includes('localhost') || identifier.includes('127.0.0.1') || identifier === 'unknown') {
    return { allowed: true, remaining: 999 }
  }

  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: maxRequests - record.count }
}

/**
 * Get client IP address for rate limiting
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}
