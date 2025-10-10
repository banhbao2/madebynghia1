import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import ReservationConfirmedEmail from '@/emails/ReservationConfirmed';
import ReservationDeclinedEmail from '@/emails/ReservationDeclined';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const {
      type,
      customerEmail,
      customerName,
      reservationDate,
      reservationTime,
      partySize,
      specialRequests,
      reason,
    } = await req.json();

    if (!['confirmed', 'declined'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid email type. Must be "confirmed" or "declined"' },
        { status: 400 }
      );
    }

    console.log(`Sending ${type} reservation email to:`, customerEmail);

    const emailTemplate = type === 'confirmed'
      ? ReservationConfirmedEmail({
          customerName,
          reservationDate,
          reservationTime,
          partySize,
          specialRequests,
        })
      : ReservationDeclinedEmail({
          customerName,
          reservationDate,
          reservationTime,
          partySize,
          reason,
        });

    const subject = type === 'confirmed'
      ? 'Your Reservation is Confirmed! ✓'
      : 'Update About Your Reservation Request';

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: customerEmail,
      subject,
      react: emailTemplate,
      replyTo: process.env.RESEND_REPLY_TO_EMAIL || process.env.RESEND_FROM_EMAIL!,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error }, { status: 400 });
    }

    console.log('Reservation email sent successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
