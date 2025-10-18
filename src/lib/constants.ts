export const specialties = [
  {
    id: 'demo-feature-1',
    title: 'Demo-Feature 1',
    description:
      'Dies ist eine Demonstration eines Spezialitätenbereichs. Auf einer echten Restaurant-Website würden hier Signature-Gerichte und einzigartige Angebote mit schönen Bildern und überzeugenden Beschreibungen präsentiert.',
    image: '/vietnamese-placeholder.jpg',
    link: '/menu',
  },
  {
    id: 'demo-feature-2',
    title: 'Demo-Feature 2',
    description:
      'Ein weiterer Demonstrationsbereich, der zeigt, wie Spezialitäten angezeigt werden können. Diese Vorlage kann einfach für jede Art von Restaurant oder Gastronomieunternehmen angepasst werden.',
    image: '/sushi-placeholder.jpg',
    link: '/menu',
  },
]

export const navLinks = [
  { name: 'Speisekarte', href: '#menu' },
  { name: 'Über uns', href: '#about' },
  { name: 'Kontakt', href: '#contact' },
]

export const contactInfo = {
  address: 'Hauptstraße 123, 10115 Berlin',
  addressLink: 'https://maps.google.com/?q=Hauptstra%C3%9Fe+123+Berlin',
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
