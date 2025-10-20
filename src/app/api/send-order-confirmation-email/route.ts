import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * IMMEDIATE ORDER CONFIRMATION EMAIL
 *
 * Industry Standard (Amazon, DoorDash, Uber Eats):
 * - Send email IMMEDIATELY when order is placed
 * - Includes tracking link for real-time status updates
 * - No additional emails needed (customer uses tracking link)
 * - Reduces email spam, prevents admin mistakes from triggering duplicate emails
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerEmail,
      customerName,
      orderId,
      orderNumber,
      orderType,
      items,
      subtotal,
      tax,
      total,
      scheduledTime,
      deliveryAddress,
      restaurantName = 'Pho & Sushi',
      restaurantPhone = '+49 XXX XXXXXXX',
      restaurantAddress = 'Your Restaurant Address'
    } = body

    // Validate required fields
    if (!customerEmail || !customerName || !orderId || !items) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Build tracking URL
    const trackingUrl = `${request.nextUrl.origin}/checkout/confirmation?orderId=${orderId}&email=${encodeURIComponent(customerEmail)}&name=${encodeURIComponent(customerName)}&orderType=${orderType}&total=${total.toFixed(2)}`

    // Format items for email
    const itemsList = items.map((item: any) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; color: #374151;">
          <strong>${item.quantity}x</strong> ${item.name}
          ${item.customizations && Object.keys(item.customizations).length > 0
            ? `<br><span style="font-size: 12px; color: #6b7280;">${Object.values(item.customizations).join(', ')}</span>`
            : ''
          }
        </td>
        <td style="padding: 12px; text-align: right; color: #111827; font-weight: 600;">€${item.price.toFixed(2)}</td>
      </tr>
    `).join('')

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [customerEmail],
      replyTo: process.env.RESEND_REPLY_TO_EMAIL || process.env.RESEND_FROM_EMAIL,
      subject: `✅ Bestellung bestätigt - #${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmed</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                          Bestellung erhalten!
                        </h1>
                        <p style="margin: 12px 0 0 0; color: #d1fae5; font-size: 16px;">
                          Wir haben Ihre Bestellung erhalten und beginnen mit der Zubereitung
                        </p>
                      </td>
                    </tr>

                    <!-- Customer Info -->
                    <tr>
                      <td style="padding: 32px 40px;">
                        <p style="margin: 0; font-size: 18px; color: #111827;">
                          Hallo <strong>${customerName}</strong> 👋
                        </p>
                        <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                          Vielen Dank für Ihre Bestellung! Ihre Bestellung wurde erfolgreich an unser Restaurant gesendet.
                        </p>
                      </td>
                    </tr>

                    <!-- Order Details Box -->
                    <tr>
                      <td style="padding: 0 40px 32px 40px;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 2px solid #10b981;">
                          <tr>
                            <td style="padding: 24px;">
                              <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                                <div>
                                  <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">
                                    BESTELLNUMMER
                                  </div>
                                  <div style="font-size: 20px; font-weight: 700; color: #111827; font-family: 'Courier New', monospace;">
                                    #${orderNumber}
                                  </div>
                                </div>
                                <div style="text-align: right;">
                                  <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">
                                    ${orderType === 'delivery' ? 'LIEFERUNG' : 'ABHOLUNG'}
                                  </div>
                                  <div style="font-size: 16px; font-weight: 600; color: #111827;">
                                    ${scheduledTime ? new Date(scheduledTime).toLocaleString('de-DE', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }) : 'ASAP'}
                                  </div>
                                </div>
                              </div>
                              ${deliveryAddress ? `
                                <div style="padding-top: 16px; border-top: 1px solid #d1d5db;">
                                  <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">
                                    LIEFERADRESSE
                                  </div>
                                  <div style="font-size: 14px; color: #111827;">
                                    📍 ${deliveryAddress}
                                  </div>
                                </div>
                              ` : ''}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Order Items -->
                    <tr>
                      <td style="padding: 0 40px 32px 40px;">
                        <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #111827; font-weight: 700;">
                          📦 Ihre Bestellung
                        </h2>
                        <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                          ${itemsList}
                          <tr style="background-color: #f9fafb;">
                            <td style="padding: 12px; font-weight: 600; color: #6b7280;">Zwischensumme</td>
                            <td style="padding: 12px; text-align: right; color: #6b7280;">€${subtotal.toFixed(2)}</td>
                          </tr>
                          <tr style="background-color: #f9fafb;">
                            <td style="padding: 12px; font-weight: 600; color: #6b7280;">MwSt. (19%)</td>
                            <td style="padding: 12px; text-align: right; color: #6b7280;">€${tax.toFixed(2)}</td>
                          </tr>
                          <tr style="background-color: #10b981;">
                            <td style="padding: 16px; font-size: 18px; font-weight: 700; color: #ffffff;">Gesamt</td>
                            <td style="padding: 16px; text-align: right; font-size: 20px; font-weight: 700; color: #ffffff;">€${total.toFixed(2)}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Tracking Link - PROMINENT -->
                    <tr>
                      <td style="padding: 0 40px 32px 40px;">
                        <div style="background-color: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 24px; text-align: center;">
                          <p style="margin: 0 0 16px 0; font-size: 16px; color: #1e40af; font-weight: 600;">
                            📍 Verfolgen Sie Ihre Bestellung in Echtzeit
                          </p>
                          <a href="${trackingUrl}"
                             style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            🔍 Bestellung verfolgen
                          </a>
                          <p style="margin: 16px 0 0 0; font-size: 13px; color: #6b7280;">
                            Sehen Sie den aktuellen Status Ihrer Bestellung • Keine weiteren E-Mails nötig
                          </p>
                        </div>
                      </td>
                    </tr>

                    <!-- What's Next -->
                    <tr>
                      <td style="padding: 0 40px 32px 40px;">
                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px;">
                          <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #92400e; font-weight: 700;">
                            📋 Was passiert jetzt?
                          </h3>
                          <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 14px; line-height: 1.8;">
                            <li>Wir prüfen Ihre Bestellung und beginnen mit der Zubereitung</li>
                            <li>Sie können den Status jederzeit über den Link oben verfolgen</li>
                            <li>${orderType === 'delivery' ? 'Ihr Essen wird zum gewünschten Zeitpunkt geliefert' : 'Ihr Essen ist zur angegebenen Zeit zur Abholung bereit'}</li>
                          </ul>
                        </div>
                      </td>
                    </tr>

                    <!-- Restaurant Info -->
                    <tr>
                      <td style="padding: 0 40px 32px 40px;">
                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; border: 1px solid #e5e7eb;">
                          <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #111827; font-weight: 700;">
                            ${restaurantName}
                          </h3>
                          <div style="font-size: 14px; color: #6b7280; line-height: 1.6;">
                            <div style="margin-bottom: 8px;">📞 ${restaurantPhone}</div>
                            <div>📍 ${restaurantAddress}</div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                          Vielen Dank für Ihre Bestellung bei ${restaurantName}!<br>
                          Wir freuen uns darauf, Sie zu bewirten.
                        </p>
                        <p style="margin: 16px 0 0 0; font-size: 12px; color: #9ca3af;">
                          Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht darauf.<br>
                          Bei Fragen kontaktieren Sie uns unter ${restaurantPhone}
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
    })

    if (error) {
      console.error('Resend API error:', error)
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
