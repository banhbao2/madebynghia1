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
      <Preview>Ihre Reservierung wurde bestätigt!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reservierung bestätigt! ✓</Heading>
          <Text style={text}>Hallo {customerName},</Text>
          <Text style={text}>
            Gute Nachrichten! Ihre Reservierung bei Nghia Demo wurde bestätigt.
          </Text>

          <Section style={infoBox}>
            <Text style={infoText}>
              <strong>Datum:</strong> {reservationDate}
            </Text>
            <Text style={infoText}>
              <strong>Uhrzeit:</strong> {reservationTime}
            </Text>
            <Text style={infoText}>
              <strong>Personenanzahl:</strong> {partySize} {partySize === 1 ? 'Person' : 'Personen'}
            </Text>
            {specialRequests && (
              <Text style={infoText}>
                <strong>Besondere Wünsche:</strong> {specialRequests}
              </Text>
            )}
          </Section>

          <Text style={text}>
            Wir freuen uns darauf, Sie zu bewirten! Bitte kommen Sie pünktlich, um sicherzustellen, dass Ihr Tisch bereit ist.
          </Text>

          <Text style={text}>
            Wenn Sie Ihre Reservierung stornieren oder ändern müssen, kontaktieren Sie uns bitte so schnell wie möglich.
          </Text>

          <Text style={footerText}>
            Bis bald bei Nghia Demo!
          </Text>

          <Section style={footer}>
            <Text style={footerSmallText}>
              Nghia Demo Restaurant<br />
              Fragen? Antworten Sie auf diese E-Mail oder rufen Sie uns an.<br />
              © {new Date().getFullYear()} Nghia Demo. Alle Rechte vorbehalten.
            </Text>
          </Section>
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

const footer = {
  borderTop: '1px solid #e5e7eb',
  marginTop: '32px',
  paddingTop: '24px',
};

const footerSmallText = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
  margin: '0 48px',
};
