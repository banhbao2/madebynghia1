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
      <Preview>Order Confirmation #{orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank you for your order!</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Your order has been confirmed and is being prepared.
          </Text>

          <Section style={infoBox}>
            <Text style={infoText}>
              <strong>Order Number:</strong> #{orderNumber}
            </Text>
            <Text style={infoText}>
              <strong>Order Type:</strong> {orderType === 'delivery' ? 'Delivery' : 'Pickup'}
            </Text>
            <Text style={infoText}>
              <strong>Order Date:</strong> {orderDate}
            </Text>
            <Text style={infoText}>
              <strong>Estimated {orderType === 'delivery' ? 'Delivery' : 'Pickup'} Time:</strong> {estimatedTime}
            </Text>
            {deliveryAddress && (
              <Text style={infoText}>
                <strong>Delivery Address:</strong> {deliveryAddress}
              </Text>
            )}
          </Section>

          <Section style={orderDetails}>
            <Heading as="h2" style={h2}>Order Items</Heading>
            {items.map((item, index) => (
              <Text key={index} style={itemText}>
                {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
              </Text>
            ))}
            <div style={divider}></div>
            <Text style={itemText}>Subtotal: ${subtotal.toFixed(2)}</Text>
            <Text style={itemText}>Tax (8.75%): ${tax.toFixed(2)}</Text>
            <Text style={totalText}>Total: ${total.toFixed(2)}</Text>
          </Section>

          <Text style={text}>
            If you have any questions about your order, please contact us at your convenience.
          </Text>

          <Text style={footerText}>
            Thank you for choosing Nghia Demo!
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
