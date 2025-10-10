import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import OrderConfirmationEmail from '@/emails/OrderConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const {
      customerEmail,
      customerName,
      orderNumber,
      orderType,
      items,
      subtotal,
      tax,
      total,
      estimatedTime,
      deliveryAddress,
      orderDate
    } = await req.json();

    console.log('Sending email to:', customerEmail);
    console.log('From:', process.env.RESEND_FROM_EMAIL);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: customerEmail,
      subject: `Order Confirmation #${orderNumber}`,
      react: OrderConfirmationEmail({
        customerName,
        orderNumber,
        orderType,
        items,
        subtotal,
        tax,
        total,
        estimatedTime,
        deliveryAddress,
        orderDate,
      }),
      replyTo: process.env.RESEND_REPLY_TO_EMAIL || process.env.RESEND_FROM_EMAIL!,
    });

    if (error) {
      console.error('========== RESEND ERROR ==========');
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('From email:', process.env.RESEND_FROM_EMAIL);
      console.error('Reply-to email:', process.env.RESEND_REPLY_TO_EMAIL);
      console.error('==================================');
      return NextResponse.json({ error }, { status: 400 });
    }

    console.log('Email sent successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
