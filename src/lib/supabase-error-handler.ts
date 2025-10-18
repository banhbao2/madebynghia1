/**
 * Supabase Error Handler
 * Suppresses authentication refresh token errors for guest users
 */

if (typeof window !== 'undefined') {
  // Clear invalid auth tokens on initial load
  try {
    const keys = Object.keys(localStorage)
    const authKeys = keys.filter(key =>
      key.includes('supabase.auth.token') ||
      key.includes('sb-') && key.includes('-auth-token')
    )

    authKeys.forEach(key => {
      try {
        const data = localStorage.getItem(key)
        if (data) {
          const parsed = JSON.parse(data)
          // If there's no valid session, clear it
          if (!parsed || !parsed.access_token || !parsed.refresh_token) {
            localStorage.removeItem(key)
          }
        }
      } catch {
        // Invalid JSON, remove it
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    // Ignore storage errors
  }

  // Override console.error to filter out Supabase refresh token errors
  const originalError = console.error

  console.error = (...args: any[]) => {
    // Check if this is a Supabase refresh token error
    const errorString = args.join(' ')

    if (
      errorString.includes('Invalid Refresh Token') ||
      errorString.includes('Refresh Token Not Found') ||
      errorString.includes('AuthApiError') ||
      errorString.includes('refresh_token_not_found')
    ) {
      // Silently ignore these errors - they're normal for guest users
      // Also try to clear any corrupt auth data
      try {
        const keys = Object.keys(localStorage)
        const authKeys = keys.filter(key =>
          key.includes('supabase.auth.token') ||
          key.includes('sb-') && key.includes('-auth-token')
        )
        authKeys.forEach(key => localStorage.removeItem(key))
      } catch {
        // Ignore
      }
      return
    }

    // Pass through all other errors
    originalError.apply(console, args)
  }
}

export {}
