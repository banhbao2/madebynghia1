export const specialties = [
  {
    id: 'demo-feature-1',
    title: 'Demo-Feature 1',
    description:
      'Dies ist eine Demonstration eines Spezialitätenbereichs. Auf einer echten Restaurant-Website würden hier Signature-Gerichte und einzigartige Angebote mit schönen Bildern und überzeugenden Beschreibungen präsentiert.',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect width="600" height="400" fill="%23e74c3c"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" opacity="0.7"%3EYOUR CUSTOM%3C/text%3E%3Ctext x="50%25" y="60%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" opacity="0.7"%3EPICTURE HERE%3C/text%3E%3C/svg%3E',
    link: '/menu',
  },
  {
    id: 'demo-feature-2',
    title: 'Demo-Feature 2',
    description:
      'Ein weiterer Demonstrationsbereich, der zeigt, wie Spezialitäten angezeigt werden können. Diese Vorlage kann einfach für jede Art von Restaurant oder Gastronomieunternehmen angepasst werden.',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect width="600" height="400" fill="%23f39c12"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" opacity="0.7"%3EYOUR CUSTOM%3C/text%3E%3Ctext x="50%25" y="60%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" opacity="0.7"%3EPICTURE HERE%3C/text%3E%3C/svg%3E',
    link: '/menu',
  },
]

export const navLinks = [
  { name: 'Speisekarte', href: '#menu' },
  { name: 'Über uns', href: '#about' },
  { name: 'Kontakt', href: '#contact' },
]

export const contactInfo = {
  address: 'Torstraße 125, 10119 Berlin',
  coordinates: {
    lat: 52.5297,
    lng: 13.4019
  },
  addressLink: 'https://maps.google.com/?q=Torstra%C3%9Fe+125,+10119+Berlin',
  phone: '+49 30 12345678',
  email: 'hallo@nghiademo.com',
  social: [
    { name: 'Facebook', url: 'https://facebook.com' },
    { name: 'Instagram', url: 'https://instagram.com' },
    { name: 'Twitter', url: 'https://twitter.com' },
  ],
  openingHours: [
    { days: 'Montag - Donnerstag', hours: '11:00 - 21:00 Uhr' },
    { days: 'Freitag - Samstag', hours: '11:00 - 22:00 Uhr' },
    { days: 'Sonntag', hours: '12:00 - 20:00 Uhr' },
  ],
}

// Structured opening hours for time slot generation
export const operatingHours = {
  // Monday = 1, Tuesday = 2, ..., Sunday = 0
  1: { open: '11:00', close: '21:00' }, // Monday
  2: { open: '11:00', close: '21:00' }, // Tuesday
  3: { open: '11:00', close: '21:00' }, // Wednesday
  4: { open: '11:00', close: '21:00' }, // Thursday
  5: { open: '11:00', close: '22:00' }, // Friday
  6: { open: '11:00', close: '22:00' }, // Saturday
  0: { open: '12:00', close: '20:00' }, // Sunday
}

export const howItWorksSteps = [
  {
    id: 'browse',
    title: 'Menü durchsuchen',
    description: 'Erkunden Sie den Demo-Menübereich, der zeigt, wie Artikel organisiert, angezeigt und zum Warenkorb hinzugefügt werden können.',
  },
  {
    id: 'order',
    title: 'Bestellung aufgeben',
    description: 'Testen Sie den Bestellablauf von der Warenkorbverwaltung bis zur Kasse und erleben Sie moderne E-Commerce-Muster.',
  },
  {
    id: 'enjoy',
    title: 'Genießen',
    description: 'Erleben Sie ein vollständiges Restaurant-Bestellsystem mit Reservierungen, Admin-Panel und E-Mail-Benachrichtigungen.',
  },
]
