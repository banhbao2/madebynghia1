import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerEmail,
      customerName,
      orderNumber,
      orderType,
      items,
      subtotal,
      tax,
      total,
      scheduledTime,
      deliveryAddress,
      status, // 'preparing' or 'cancelled'
      restaurantName = 'Pho & Sushi',
      restaurantPhone = '+49 XXX XXXXXXX',
      restaurantAddress = 'Your Restaurant Address'
    } = body

    // Validate required fields
    if (!customerEmail || !customerName || !status || !items) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const isAccepted = status === 'preparing'
    const subject = isAccepted
      ? `✅ Order Confirmed - ${restaurantName} #${orderNumber}`
      : `❌ Order Declined - ${restaurantName} #${orderNumber}`

    // Format items for email
    const itemsList = items.map((item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <div style="font-weight: 600; color: #111827;">${item.quantity}x ${item.name}</div>
          ${item.customizations && Object.keys(item.customizations).length > 0 ? `
            <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">
              ${Object.entries(item.customizations).map(([key, value]) =>
                `• ${value}`
              ).join('<br>')}
            </div>
          ` : ''}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #111827;">
          €${item.price.toFixed(2)}
        </td>
      </tr>
    `).join('')

    // Create HTML email based on status
    const htmlContent = isAccepted ? `
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
                        Order Confirmed!
                      </h1>
                      <p style="margin: 12px 0 0 0; color: #d1fae5; font-size: 16px;">
                        We're preparing your delicious meal
                      </p>
                    </td>
                  </tr>

                  <!-- Customer Info -->
                  <tr>
                    <td style="padding: 32px 40px;">
                      <p style="margin: 0; font-size: 18px; color: #111827;">
                        Hi <strong>${customerName}</strong> 👋
                      </p>
                      <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                        Great news! Your order has been <strong style="color: #10b981;">accepted</strong> and our kitchen is already working on it.
                      </p>
                    </td>
                  </tr>

                  <!-- Order Details Box -->
                  <tr>
                    <td style="padding: 0 40px 32px 40px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 2px solid #10b981;">
                        <tr>
                          <td style="padding: 24px;">
                            <div style="display: flex; align-items: center; margin-bottom: 16px;">
                              <div style="font-size: 32px; margin-right: 12px;">${orderType === 'delivery' ? '🚚' : '🏪'}</div>
                              <div>
                                <div style="font-size: 14px; color: #6b7280; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">
                                  ${orderType === 'delivery' ? 'DELIVERY' : 'PICKUP'}
                                </div>
                                ${scheduledTime ? `
                                  <div style="font-size: 24px; font-weight: 700; color: #111827; margin-top: 4px;">
                                    ${new Date(scheduledTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                  <div style="font-size: 14px; color: #6b7280; margin-top: 2px;">
                                    ${new Date(scheduledTime).toLocaleDateString('de-DE', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </div>
                                ` : `
                                  <div style="font-size: 20px; font-weight: 700; color: #111827; margin-top: 4px;">
                                    ASAP
                                  </div>
                                `}
                              </div>
                            </div>
                            ${deliveryAddress ? `
                              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                                <div style="font-size: 13px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">
                                  📍 DELIVERY ADDRESS
                                </div>
                                <div style="font-size: 15px; color: #111827;">
                                  ${deliveryAddress}
                                </div>
                              </div>
                            ` : ''}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Order Number -->
                  <tr>
                    <td style="padding: 0 40px 24px 40px;">
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px;">
                        <div style="font-size: 12px; color: #92400e; font-weight: 600; margin-bottom: 4px;">
                          ORDER NUMBER
                        </div>
                        <div style="font-size: 20px; font-weight: 700; color: #78350f; font-family: 'Courier New', monospace;">
                          #${orderNumber}
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Order Items -->
                  <tr>
                    <td style="padding: 0 40px 32px 40px;">
                      <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #111827; font-weight: 700;">
                        📦 Your Order
                      </h2>
                      <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                        ${itemsList}
                        <tr style="background-color: #f9fafb;">
                          <td style="padding: 12px; font-weight: 600; color: #6b7280;">Subtotal</td>
                          <td style="padding: 12px; text-align: right; color: #6b7280;">€${subtotal.toFixed(2)}</td>
                        </tr>
                        <tr style="background-color: #f9fafb;">
                          <td style="padding: 12px; font-weight: 600; color: #6b7280;">Tax</td>
                          <td style="padding: 12px; text-align: right; color: #6b7280;">€${tax.toFixed(2)}</td>
                        </tr>
                        <tr style="background-color: #10b981;">
                          <td style="padding: 16px; font-size: 18px; font-weight: 700; color: #ffffff;">Total</td>
                          <td style="padding: 16px; text-align: right; font-size: 20px; font-weight: 700; color: #ffffff;">€${total.toFixed(2)}</td>
                        </tr>
                      </table>
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
                        Thank you for choosing ${restaurantName}!<br>
                        We look forward to serving you.
                      </p>
                      <p style="margin: 16px 0 0 0; font-size: 12px; color: #9ca3af;">
                        This is an automated confirmation email. Please do not reply.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Declined</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px; text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 16px;">❌</div>
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                        Order Declined
                      </h1>
                      <p style="margin: 12px 0 0 0; color: #fecaca; font-size: 16px;">
                        We're sorry, we cannot fulfill this order
                      </p>
                    </td>
                  </tr>

                  <!-- Customer Info -->
                  <tr>
                    <td style="padding: 32px 40px;">
                      <p style="margin: 0; font-size: 18px; color: #111827;">
                        Hi <strong>${customerName}</strong>,
                      </p>
                      <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                        We sincerely apologize, but we are <strong style="color: #ef4444;">unable to accept</strong> your order at this time.
                      </p>
                      <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                        This could be due to:
                      </p>
                      <ul style="margin: 12px 0 0 24px; font-size: 15px; color: #6b7280; line-height: 1.8;">
                        <li>High order volume</li>
                        <li>Temporary unavailability of ingredients</li>
                        <li>Delivery area restrictions</li>
                        <li>Kitchen capacity</li>
                      </ul>
                    </td>
                  </tr>

                  <!-- Order Number -->
                  <tr>
                    <td style="padding: 0 40px 24px 40px;">
                      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 6px;">
                        <div style="font-size: 12px; color: #991b1b; font-weight: 600; margin-bottom: 4px;">
                          ORDER NUMBER
                        </div>
                        <div style="font-size: 20px; font-weight: 700; color: #7f1d1d; font-family: 'Courier New', monospace;">
                          #${orderNumber}
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- What's Next -->
                  <tr>
                    <td style="padding: 0 40px 32px 40px;">
                      <div style="background-color: #eff6ff; border-radius: 8px; padding: 24px; border: 2px solid #3b82f6;">
                        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1e40af; font-weight: 700;">
                          💡 What's next?
                        </h3>
                        <p style="margin: 0; font-size: 15px; color: #1e3a8a; line-height: 1.6;">
                          You can try ordering again later, or feel free to contact us directly at <strong>${restaurantPhone}</strong> to discuss your order.
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Restaurant Info -->
                  <tr>
                    <td style="padding: 0 40px 32px 40px;">
                      <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; border: 1px solid #e5e7eb;">
                        <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #111827; font-weight: 700;">
                          Contact ${restaurantName}
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
                        We apologize for the inconvenience and hope to serve you soon.<br>
                        Thank you for your understanding.
                      </p>
                      <p style="margin: 16px 0 0 0; font-size: 12px; color: #9ca3af;">
                        This is an automated notification email. Please do not reply.
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

    // Send email
    // IMPORTANT: Change this to your verified Resend domain
    // For testing, use onboarding@resend.dev
    // For production, use your own verified domain
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

    const { data, error } = await resend.emails.send({
      from: `${restaurantName} <${fromEmail}>`,
      to: [customerEmail],
      subject,
      html: htmlContent,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully',
        emailId: data?.id
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
