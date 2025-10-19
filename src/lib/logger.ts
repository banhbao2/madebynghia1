/**
 * Error Logging Service
 * Logs errors for debugging and monitoring
 * Can be integrated with Sentry, LogRocket, or other services
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

interface LogContext {
  userId?: string
  sessionId?: string
  url?: string
  userAgent?: string
  timestamp?: Date
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isClient = typeof window !== 'undefined'

  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context)
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context)
    }
    this.sendToMonitoring('info', message, context)
  }

  /**
   * Log warnings
   */
  warn(message: string, context?: LogContext) {
    console.warn(`[WARN] ${message}`, context)
    this.sendToMonitoring('warn', message, context)
  }

  /**
   * Log errors
   */
  error(message: string, error?: Error | any, context?: LogContext) {
    const errorInfo = this.formatError(error)
    const fullContext = {
      ...context,
      ...errorInfo,
      timestamp: new Date(),
      url: this.isClient ? window.location.href : undefined,
      userAgent: this.isClient ? navigator.userAgent : undefined
    }

    console.error(`[ERROR] ${message}`, fullContext)
    this.sendToMonitoring('error', message, fullContext)
  }

  /**
   * Log fatal errors (app-breaking)
   */
  fatal(message: string, error?: Error | any, context?: LogContext) {
    const errorInfo = this.formatError(error)
    const fullContext = {
      ...context,
      ...errorInfo,
      timestamp: new Date(),
      url: this.isClient ? window.location.href : undefined,
      userAgent: this.isClient ? navigator.userAgent : undefined
    }

    console.error(`[FATAL] ${message}`, fullContext)
    this.sendToMonitoring('fatal', message, fullContext)
  }

  /**
   * Format error object for logging
   */
  private formatError(error: any) {
    if (!error) return {}

    return {
      errorName: error.name,
      errorMessage: error.message,
      errorCode: error.code,
      errorStack: error.stack,
      statusCode: error.statusCode,
      metadata: error.metadata
    }
  }

  /**
   * Send logs to monitoring service
   * Integrate with Sentry, LogRocket, or custom backend
   */
  private sendToMonitoring(level: string, message: string, context?: any) {
    // Skip in development
    if (this.isDevelopment) return

    try {
      // TODO: Integrate with monitoring service
      // Example with Sentry:
      // if (window.Sentry) {
      //   if (level === 'error' || level === 'fatal') {
      //     Sentry.captureException(new Error(message), { extra: context })
      //   } else {
      //     Sentry.captureMessage(message, { level, extra: context })
      //   }
      // }

      // Example with custom backend:
      if (this.isClient && level === 'error' || level === 'fatal') {
        navigator.sendBeacon('/api/logs', JSON.stringify({
          level,
          message,
          context,
          timestamp: new Date().toISOString()
        }))
      }
    } catch (err) {
      // Don't let logging errors break the app
      console.error('Failed to send log to monitoring:', err)
    }
  }
}

// Export singleton instance
export const logger = new Logger()

/**
 * Log API request/response for debugging
 */
export function logApiCall(
  method: string,
  url: string,
  request?: any,
  response?: any,
  error?: any
) {
  const context = {
    method,
    url,
    request: request ? JSON.stringify(request).substring(0, 500) : undefined,
    response: response ? JSON.stringify(response).substring(0, 500) : undefined,
    error: error ? error.message : undefined
  }

  if (error) {
    logger.error(`API call failed: ${method} ${url}`, error, context)
  } else {
    logger.debug(`API call: ${method} ${url}`, context)
  }
}
