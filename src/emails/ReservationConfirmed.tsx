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

interface ReservationConfirmedEmailProps {
  customerName: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  specialRequests?: string;
}

export default function ReservationConfirmedEmail({
  customerName,
  reservationDate,
  reservationTime,
  partySize,
  specialRequests,
}: ReservationConfirmedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your reservation has been confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reservation Confirmed! ✓</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Great news! Your reservation at Pho & Sushi has been confirmed.
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
            {specialRequests && (
              <Text style={infoText}>
                <strong>Special Requests:</strong> {specialRequests}
              </Text>
            )}
          </Section>

          <Text style={text}>
            We look forward to serving you! Please arrive on time to ensure your table is ready.
          </Text>

          <Text style={text}>
            If you need to cancel or modify your reservation, please contact us as soon as possible.
          </Text>

          <Text style={footerText}>
            See you soon at Pho & Sushi!
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
  color: '#16a34a',
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
  backgroundColor: '#dcfce7',
  borderLeft: '4px solid #16a34a',
  marginBottom: '24px',
};

const infoText = {
  color: '#333',
  fontSize: '14px',
  margin: '8px 0',
  lineHeight: '1.6',
};

const footerText = {
  color: '#666',
  fontSize: '14px',
  margin: '24px 48px',
  textAlign: 'center' as const,
  fontStyle: 'italic',
};
