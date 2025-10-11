import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ReservationDeclinedEmailProps {
  customerName: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  reason?: string;
}

export default function ReservationDeclinedEmail({
  customerName,
  reservationDate,
  reservationTime,
  partySize,
  reason,
}: ReservationDeclinedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Update about your reservation request</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reservation Update</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            We're sorry, but we are unable to accommodate your reservation request at this time.
          </Text>

          <Section style={infoBox}>
            <Text style={infoText}>
              <strong>Date:</strong> {reservationDate}
            </Text>
            <Text style={infoText}>
              <strong>Time:</strong> {reservationTime}
            </Text>
            <Text style={infoText}>
              <strong>Party Size:</strong> {partySize} {partySize === 1 ? 'guest' : 'guests'}
            </Text>
            {reason && (
              <Text style={reasonText}>
                <strong>Reason:</strong> {reason}
              </Text>
            )}
          </Section>

          <Text style={text}>
            We apologize for any inconvenience. Please feel free to contact us directly to discuss alternative dates or times that might work better.
          </Text>

          <Text style={text}>
            We'd love to serve you another time!
          </Text>

          <Text style={footerText}>
            Thank you for your understanding,<br />
            Nghia Demo Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#dc2626',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 48px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  margin: '16px 48px',
};

const infoBox = {
  padding: '20px 48px',
  backgroundColor: '#fee2e2',
  borderLeft: '4px solid #dc2626',
  marginBottom: '24px',
};

const infoText = {
  color: '#333',
  fontSize: '14px',
  margin: '8px 0',
  lineHeight: '1.6',
};

const reasonText = {
  color: '#991b1b',
  fontSize: '14px',
  margin: '12px 0 0',
  lineHeight: '1.6',
  fontWeight: 'bold' as const,
};

const footerText = {
  color: '#666',
  fontSize: '14px',
  margin: '24px 48px',
  textAlign: 'center' as const,
  fontStyle: 'italic',
};
