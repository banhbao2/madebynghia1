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
      <Preview>Update zu Ihrer Reservierungsanfrage</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reservierungsaktualisierung</Heading>
          <Text style={text}>Hallo {customerName},</Text>
          <Text style={text}>
            Es tut uns leid, aber wir können Ihre Reservierungsanfrage zu diesem Zeitpunkt leider nicht berücksichtigen.
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
            {reason && (
              <Text style={reasonText}>
                <strong>Grund:</strong> {reason}
              </Text>
            )}
          </Section>

          <Text style={text}>
            Wir entschuldigen uns für die Unannehmlichkeiten. Bitte kontaktieren Sie uns direkt, um alternative Daten oder Uhrzeiten zu besprechen, die besser passen könnten.
          </Text>

          <Text style={text}>
            Wir würden uns freuen, Sie zu einem anderen Zeitpunkt zu bewirten!
          </Text>

          <Text style={footerText}>
            Vielen Dank für Ihr Verständnis,<br />
            Ihr Nghia Demo Team
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
