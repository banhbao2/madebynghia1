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

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  orderType: 'delivery' | 'pickup';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  estimatedTime: string;
  deliveryAddress?: string;
  orderDate: string;
}

export default function OrderConfirmationEmail({
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
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bestellbestätigung #{orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Vielen Dank für Ihre Bestellung!</Heading>
          <Text style={text}>Hallo {customerName},</Text>
          <Text style={text}>
            Ihre Bestellung wurde bestätigt und wird gerade zubereitet.
          </Text>

          <Section style={infoBox}>
            <Text style={infoText}>
              <strong>Bestellnummer:</strong> #{orderNumber}
            </Text>
            <Text style={infoText}>
              <strong>Bestellart:</strong> {orderType === 'delivery' ? 'Lieferung' : 'Abholung'}
            </Text>
            <Text style={infoText}>
              <strong>Bestelldatum:</strong> {orderDate}
            </Text>
            <Text style={infoText}>
              <strong>Voraussichtliche {orderType === 'delivery' ? 'Lieferzeit' : 'Abholzeit'}:</strong> {estimatedTime}
            </Text>
            {deliveryAddress && (
              <Text style={infoText}>
                <strong>Lieferadresse:</strong> {deliveryAddress}
              </Text>
            )}
          </Section>

          <Section style={orderDetails}>
            <Heading as="h2" style={h2}>Bestellte Artikel</Heading>
            {items.map((item, index) => (
              <Text key={index} style={itemText}>
                {item.quantity}x {item.name} - {(item.price * item.quantity).toFixed(2)}€
              </Text>
            ))}
            <div style={divider}></div>
            <Text style={itemText}>Zwischensumme: {subtotal.toFixed(2)}€</Text>
            <Text style={itemText}>MwSt (19%): {tax.toFixed(2)}€</Text>
            <Text style={totalText}>Gesamt: {total.toFixed(2)}€</Text>
          </Section>

          <Text style={text}>
            Wenn Sie Fragen zu Ihrer Bestellung haben, kontaktieren Sie uns bitte jederzeit.
          </Text>

          <Text style={footerText}>
            Vielen Dank, dass Sie sich für Nghia Demo entschieden haben!
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
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 48px',
};

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  margin: '16px 48px',
};

const orderDetails = {
  padding: '24px 48px',
  backgroundColor: '#f6f9fc',
};

const itemText = {
  color: '#333',
  fontSize: '14px',
  margin: '8px 0',
};

const totalText = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '16px 0 0',
};

const infoBox = {
  padding: '20px 48px',
  backgroundColor: '#fff3e0',
  borderLeft: '4px solid #ff6b35',
  marginBottom: '24px',
};

const infoText = {
  color: '#333',
  fontSize: '14px',
  margin: '8px 0',
  lineHeight: '1.6',
};

const divider = {
  borderTop: '1px solid #ddd',
  margin: '12px 0',
};

const footerText = {
  color: '#666',
  fontSize: '14px',
  margin: '24px 48px',
  textAlign: 'center' as const,
  fontStyle: 'italic',
};
