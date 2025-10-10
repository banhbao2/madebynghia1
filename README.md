# Pho & Sushi - Restaurant Management System

A modern, full-featured restaurant website with online ordering and reservation management.

## 🚀 Features

### Customer-Facing
- ✅ **Online Ordering** - Browse menu, customize items, add to cart
- ✅ **Reservation System** - Book tables with date/time selection
- ✅ **Menu Search & Filter** - Find items by name, description, or price
- ✅ **Real-time Availability** - Live menu and time slot updates
- ✅ **QR Code Support** - Table ordering via QR codes
- ✅ **Email Notifications** - Order and reservation confirmations

### Admin Dashboard
- ✅ **Order Management** - View, update, and complete orders
- ✅ **Reservation Management** - Approve/decline reservations
- ✅ **Menu Editor** - Add, edit, and manage menu items
- ✅ **Settings** - Configure restaurant info, hours, pricing
- ✅ **Real-time Updates** - Live notifications for new orders/reservations

### UI/UX Enhancements
- ✨ **Menu Item Images** - Beautiful product photography display
- ✨ **Enhanced Hero Section** - Stats, trust badges, glassmorphism
- ✨ **Skeleton Loading** - Professional loading states
- ✨ **Search & Filters** - Advanced menu filtering
- ✨ **Smooth Animations** - Fade-in, slide-in effects

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Email**: Resend
- **Hosting**: Vercel (recommended)

## 📦 Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account ([supabase.com](https://supabase.com))
- Resend account for emails ([resend.com](https://resend.com))

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd pho-sushi
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
NOTIFICATION_EMAIL=your_email@example.com
```

4. **Set up database**
Run the SQL scripts in the `database/` folder in your Supabase SQL Editor:
- `admin-setup.sql` - Creates admin tables and user
- `reservations-setup.sql` - Creates reservation tables
- `enable-realtime.sql` - Enables real-time subscriptions

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📚 Documentation

- [Database Setup](database/README.md) - Database schema and setup
- [UI Improvements](UI_IMPROVEMENTS.md) - Recent UI/UX enhancements
- [Notification Improvements](NOTIFICATION_IMPROVEMENTS.md) - Admin notification features

## 🎨 Customization

### Add Menu Items
Update menu items in Supabase Table Editor or via SQL:
```sql
INSERT INTO menu_items (id, name, description, price, category, image, popular)
VALUES ('pho-tai', 'Pho Tai', 'Beef pho with rare steak', 12.99, 'pho', 'https://...jpg', true);
```

### Update Restaurant Info
Go to Admin Dashboard → Settings to update:
- Restaurant name, description, contact info
- Business hours
- Delivery settings and tax rate
- Social media links

### Customize Branding
Edit the following files:
- `src/lib/constants.ts` - Basic info
- `src/app/layout.tsx` - Meta tags
- `src/app/globals.css` - Colors and theme

## 🚢 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Deploy to Other Platforms
Build the project:
```bash
npm run build
npm start
```

## 📊 Admin Access

Default admin credentials (change after first login):
- Email: `admin@phosushi.com`
- Password: `admin123`

Access at: `/admin/login`

## 🔧 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

## 📁 Project Structure

```
pho-sushi/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── admin/        # Admin dashboard
│   │   ├── api/          # API routes
│   │   ├── menu/         # Menu page
│   │   └── reservations/ # Reservation pages
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript types
├── database/             # SQL migration scripts
└── public/               # Static assets
```

## 🎯 Roadmap

- [ ] Payment integration (Stripe)
- [ ] Loyalty program
- [ ] Gift cards
- [ ] Multi-location support
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

## 📄 License

This project is a template for building restaurant websites. Feel free to use and customize.

## 🤝 Support

For issues or questions, check the documentation files or create an issue in the repository.

---

**Built with ❤️ for restaurant owners**
