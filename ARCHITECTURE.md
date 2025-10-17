# 🏗️ Complete System Architecture Documentation

**Project:** Nghia Demo Restaurant Management System
**Last Updated:** October 18, 2025
**Tech Stack:** Next.js 15 + Supabase + TypeScript + Tailwind CSS

---

## 📑 Table of Contents

1. [High-Level Architecture Overview](#high-level-architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Database Schema & Relationships](#database-schema--relationships)
4. [Application Architecture](#application-architecture)
5. [Data Flow Diagrams](#data-flow-diagrams)
6. [Authentication & Authorization](#authentication--authorization)
7. [API Routes](#api-routes)
8. [Real-time Features](#real-time-features)
9. [State Management](#state-management)
10. [File Structure](#file-structure)
11. [Security Architecture](#security-architecture)
12. [Deployment Architecture](#deployment-architecture)

---

## 🎯 High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Customer   │  │    Admin     │  │   Mobile     │      │
│  │   Browser    │  │   Browser    │  │   Browser    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         └──────────────────┼──────────────────┘               │
│                            │                                  │
└────────────────────────────┼──────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   NEXT.JS 15    │
                    │   APP ROUTER    │
                    │   (Vercel)      │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼─────┐      ┌──────▼──────┐      ┌─────▼──────┐
   │ SSR/CSR  │      │ API Routes  │      │ Middleware │
   │  Pages   │      │  /api/*     │      │   Auth     │
   └────┬─────┘      └──────┬──────┘      └─────┬──────┘
        │                   │                    │
        └───────────────────┼────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼─────┐      ┌─────▼──────┐     ┌─────▼──────┐
   │ Supabase │      │   Resend   │     │   Stripe   │
   │ Database │      │   Email    │     │  Payment   │
   │ + Auth   │      │  Service   │     │ (Planned)  │
   │ + Realtime│     └────────────┘     └────────────┘
   └──────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15.5.4 (App Router)
- **Language:** TypeScript 5
- **UI Library:** React 19.1.0
- **Styling:** Tailwind CSS 4
- **State Management:** React Context API + Local Storage

### Backend
- **Runtime:** Node.js 20+
- **API:** Next.js API Routes (serverless functions)
- **Database:** Supabase (PostgreSQL 15)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime (WebSocket)

### Third-Party Services
- **Email:** Resend (transactional emails)
- **Hosting:** Vercel (Edge Network)
- **Storage:** Supabase Storage (for images)
- **Payment:** Stripe (planned)

### Development Tools
- **Package Manager:** npm
- **Linter:** ESLint 9
- **Build Tool:** Next.js (Turbopack)
- **Version Control:** Git

---

## 🗄️ Database Schema & Relationships

### Entity Relationship Diagram

```
┌─────────────────────┐
│   auth.users        │  (Supabase Auth - Built-in)
│─────────────────────│
│ id (PK, UUID)       │◄────────┐
│ email               │         │
│ encrypted_password  │         │
│ created_at          │         │
└─────────────────────┘         │
                                │ FK
                    ┌───────────┴────────────┐
                    │   admin_users          │
                    │────────────────────────│
                    │ id (PK, UUID)          │
                    │ email                  │
                    │ full_name              │
                    │ role (admin/super)     │
                    │ is_active              │
                    │ created_at             │
                    │ updated_at             │
                    └────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │    (manages)          │
                    ▼                       ▼

┌─────────────────────────┐   ┌─────────────────────────┐
│   menu_items            │   │   orders                │
│─────────────────────────│   │─────────────────────────│
│ id (PK, TEXT)           │   │ id (PK, UUID)           │
│ name                    │   │ customer_name           │
│ description             │   │ customer_phone          │
│ price (DECIMAL)         │   │ customer_email          │
│ category (TEXT)  ───────┼──►│ items (JSONB)           │
│ image (TEXT)            │   │ order_type              │
│ customizations (JSONB)  │   │ delivery_address        │
│ popular (BOOLEAN)       │   │ special_notes           │
│ is_available (BOOLEAN)  │   │ subtotal                │
│ sort_order              │   │ tax                     │
│ created_at              │   │ total                   │
│ updated_at              │   │ status                  │
└─────────────────────────┘   │ created_at              │
            │                 │ updated_at              │
            │                 └─────────────────────────┘
            │
            │ FK (category)           ┌─────────────────────────┐
            └─────────────────────────►│   categories            │
                                      │─────────────────────────│
                                      │ id (PK, TEXT)           │
                                      │ name                    │
                                      │ sort_order              │
                                      │ is_active               │
                                      │ created_at              │
                                      └─────────────────────────┘

┌─────────────────────────┐   ┌─────────────────────────┐
│   reservations          │   │   reservation_settings  │
│─────────────────────────│   │─────────────────────────│
│ id (PK, UUID)           │   │ id (PK, UUID)           │
│ customer_name           │   │ max_tables              │
│ customer_email          │   │ max_party_size          │
│ customer_phone          │   │ slot_duration_minutes   │
│ reservation_date        │   │ booking_window_days     │
│ reservation_time        │   │ reservation_start_time  │
│ party_size              │   │ reservation_end_time    │
│ status                  │   │ closed_days (JSONB)     │
│ special_requests        │   │ auto_confirm            │
│ table_number            │   │ min_advance_hours       │
│ admin_notes             │   │ created_at              │
│ created_at              │   │ updated_at              │
│ updated_at              │   └─────────────────────────┘
└─────────────────────────┘

┌─────────────────────────┐
│   restaurant_settings   │
│─────────────────────────│
│ id (PK, UUID)           │
│ restaurant_name         │
│ restaurant_description  │
│ phone                   │
│ email                   │
│ address, city, state    │
│ zip_code                │
│ business_hours (JSONB)  │
│ delivery_enabled        │
│ delivery_fee            │
│ delivery_minimum        │
│ free_delivery_threshold │
│ pickup_enabled          │
│ tax_rate                │
│ primary_color           │
│ logo_url                │
│ facebook_url            │
│ instagram_url           │
│ twitter_url             │
│ notification_email      │
│ order_notification_on   │
│ created_at              │
│ updated_at              │
└─────────────────────────┘
```

### Table Details

#### 1. **menu_items**
Stores all menu items with pricing and customization options.

**Key Fields:**
- `id`: Unique identifier (e.g., "pho-tai", "california-roll")
- `category`: Links to categories table
- `customizations`: JSONB array of customization options
  ```json
  [
    {
      "label": "Spice Level",
      "options": ["Mild", "Medium", "Spicy"]
    },
    {
      "label": "Noodle Type",
      "options": ["Regular", "Extra Noodles", "No Noodles"]
    }
  ]
  ```
- `popular`: Boolean flag for homepage display
- `is_available`: Toggle visibility without deletion

**Indexes:**
- Primary key on `id`
- Index on `category`
- Index on `is_available`

---

#### 2. **categories**
Defines menu categories for organization.

**Pre-populated Categories:**
- `all` - All Items (sort_order: 0)
- `pho` - Phở (sort_order: 1)
- `sushi` - Sushi (sort_order: 2)
- `appetizers` - Appetizers (sort_order: 3)
- `drinks` - Drinks (sort_order: 4)

---

#### 3. **orders**
Stores customer orders with line items.

**Key Fields:**
- `items`: JSONB array of ordered items
  ```json
  [
    {
      "id": "pho-tai",
      "name": "Phở Tái",
      "price": 13.99,
      "quantity": 2,
      "customizations": {
        "Spice Level": "Spicy",
        "Noodle Type": "Extra Noodles"
      }
    }
  ]
  ```
- `order_type`: Enum ('delivery' | 'pickup')
- `status`: Enum ('pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled')
- `subtotal`, `tax`, `total`: Calculated on client, stored for record

**Indexes:**
- Primary key on `id`
- Index on `status`
- Index on `created_at`

---

#### 4. **reservations**
Manages table reservations.

**Key Fields:**
- `reservation_date`: DATE type
- `reservation_time`: TIME type
- `party_size`: Integer (1-20)
- `status`: Enum ('pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show')
- `admin_notes`: Internal notes not visible to customer

**Indexes:**
- Primary key on `id`
- Index on `reservation_date`
- Index on `status`
- Composite index on `(reservation_date, reservation_time)`

---

#### 5. **admin_users**
Maps Supabase auth users to admin roles.

**Key Fields:**
- `id`: Foreign key to `auth.users(id)`
- `role`: 'admin' or 'super_admin'
- `is_active`: Soft delete flag

**Cascade Delete:** When auth user is deleted, admin_user is also deleted.

---

#### 6. **restaurant_settings**
Global restaurant configuration (single row).

**Key Fields:**
- `business_hours`: JSONB object with daily hours
  ```json
  {
    "monday": {"open": "11:00", "close": "21:00", "closed": false},
    "tuesday": {"open": "11:00", "close": "21:00", "closed": false}
  }
  ```
- `tax_rate`: Decimal (e.g., 0.0875 for 8.75%)
- `delivery_fee`, `delivery_minimum`, `free_delivery_threshold`

---

#### 7. **reservation_settings**
Reservation system configuration (single row).

**Key Fields:**
- `slot_duration_minutes`: Time between available slots (default: 30)
- `booking_window_days`: How far ahead bookings allowed (default: 30)
- `min_advance_hours`: Minimum advance booking time (default: 2)
- `closed_days`: JSONB array `["Sunday", "Monday"]`
- `auto_confirm`: If true, reservations auto-confirmed without admin approval

---

## 🏛️ Application Architecture

### Architecture Pattern: **Hybrid Rendering (SSR + CSR + API Routes)**

```
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP ROUTER                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │  PUBLIC ROUTES (Customer-Facing)                   │     │
│  ├────────────────────────────────────────────────────┤     │
│  │  / (Home)              - SSR + Hydration           │     │
│  │  /menu                 - CSR + Real-time           │     │
│  │  /order                - CSR                       │     │
│  │  /reservations         - CSR                       │     │
│  │  /reservations/confirm - CSR                       │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │  PROTECTED ROUTES (Admin Dashboard)                │     │
│  ├────────────────────────────────────────────────────┤     │
│  │  /admin/*              - Protected by Middleware   │     │
│  │  /admin                - Dashboard (CSR)           │     │
│  │  /admin/login          - Auth Page (CSR)           │     │
│  │  /admin/orders         - Order Management (CSR)    │     │
│  │  /admin/reservations   - Reservation Mgmt (CSR)    │     │
│  │  /admin/menu           - Menu Editor (CSR)         │     │
│  │  /admin/settings       - Settings (CSR)            │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │  API ROUTES (Serverless Functions)                 │     │
│  ├────────────────────────────────────────────────────┤     │
│  │  POST /api/orders                                  │     │
│  │  GET  /api/orders                                  │     │
│  │  PUT  /api/orders/[id]                             │     │
│  │  POST /api/reservations                            │     │
│  │  GET  /api/reservations                            │     │
│  │  GET  /api/reservations/availability               │     │
│  │  PUT  /api/reservations/[id]                       │     │
│  │  POST /api/send-order-email                        │     │
│  │  POST /api/send-reservation-email                  │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Rendering Strategy

| Route Type | Rendering | Reason |
|------------|-----------|--------|
| Homepage (`/`) | **SSR** | SEO, fast initial load, static content |
| Menu (`/menu`) | **CSR** | Real-time data, search/filter, interactivity |
| Order/Checkout | **CSR** | Complex state (cart), user interactions |
| Admin Dashboard | **CSR** | Real-time updates, frequent data mutations |
| API Routes | **Server-side** | Database access, security, validation |

---

## 🔄 Data Flow Diagrams

### 1. Order Placement Flow

```
┌─────────┐
│ Customer│
│ Browser │
└────┬────┘
     │ 1. Browse menu
     ▼
┌─────────────────┐
│ GET /menu       │
│ (Client-side)   │
└────┬────────────┘
     │ 2. Fetch menu items from Supabase
     ▼
┌──────────────────────┐
│ Supabase Query       │
│ SELECT * FROM        │
│ menu_items WHERE     │
│ is_available = true  │
└────┬─────────────────┘
     │ 3. Return menu data
     ▼
┌─────────────────┐
│ Display Menu    │
│ + Add to Cart   │
└────┬────────────┘
     │ 4. Add items (stored in Context + localStorage)
     ▼
┌─────────────────┐
│ Cart Context    │
│ (Client State)  │
└────┬────────────┘
     │ 5. Checkout clicked
     ▼
┌───────────────────────┐
│ POST /api/orders      │
│ {                     │
│   customer_name,      │
│   customer_phone,     │
│   items: [...],       │
│   order_type,         │
│   total: 45.99        │
│ }                     │
└────┬──────────────────┘
     │ 6. Validate & insert into DB
     ▼
┌──────────────────────┐
│ Supabase INSERT      │
│ INTO orders          │
└────┬─────────────────┘
     │ 7. Return order ID
     ▼
┌───────────────────────┐
│ POST /api/send-       │
│ order-email           │
│ (Trigger email)       │
└────┬──────────────────┘
     │ 8. Send via Resend
     ▼
┌──────────────────────┐
│ Resend API           │
│ (Transactional Email)│
└────┬─────────────────┘
     │ 9. Email sent
     ▼
┌──────────────────────┐
│ Customer receives    │
│ confirmation email   │
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│ Admin Dashboard      │
│ (Real-time update)   │
│ 🔔 New Order!        │
└──────────────────────┘
```

### 2. Admin Order Management Flow

```
┌─────────┐
│  Admin  │
│ Browser │
└────┬────┘
     │ 1. Navigate to /admin/orders
     ▼
┌─────────────────────────┐
│ Middleware Check        │
│ - Is user authenticated?│
│ - Is user active admin? │
└────┬────────────────────┘
     │ 2. Authorized ✓
     ▼
┌─────────────────────────┐
│ GET /api/orders         │
└────┬────────────────────┘
     │ 3. Fetch from Supabase
     ▼
┌──────────────────────────┐
│ Supabase Query           │
│ SELECT * FROM orders     │
│ ORDER BY created_at DESC │
└────┬─────────────────────┘
     │ 4. Return order list
     ▼
┌──────────────────────────┐
│ Display Orders           │
│ + Real-time Subscription │
└────┬─────────────────────┘
     │ 5. Supabase Realtime listens for changes
     ▼
┌──────────────────────────┐
│ useEffect(() => {        │
│   supabase.channel()     │
│     .on('INSERT')        │
│     .on('UPDATE')        │
│     .subscribe()         │
│ })                       │
└────┬─────────────────────┘
     │ 6. New order arrives → Auto-update UI
     ▼
┌──────────────────────────┐
│ Admin updates status     │
│ (pending → confirmed)    │
└────┬─────────────────────┘
     │ 7. PUT /api/orders/[id]
     ▼
┌──────────────────────────┐
│ Supabase UPDATE          │
│ UPDATE orders            │
│ SET status = 'confirmed' │
│ WHERE id = ?             │
└────┬─────────────────────┘
     │ 8. Broadcast change via Realtime
     ▼
┌──────────────────────────┐
│ All connected admins     │
│ see updated status       │
└──────────────────────────┘
```

### 3. Reservation System Flow

```
┌─────────┐
│ Customer│
└────┬────┘
     │ 1. Visit /reservations
     ▼
┌─────────────────────────────┐
│ Select date + time + party  │
└────┬────────────────────────┘
     │ 2. Check availability
     ▼
┌───────────────────────────────────┐
│ GET /api/reservations/availability│
│ ?date=2025-10-20&time=19:00       │
└────┬──────────────────────────────┘
     │ 3. Query existing reservations
     ▼
┌──────────────────────────────────┐
│ SELECT COUNT(*) FROM reservations│
│ WHERE reservation_date = ?       │
│   AND reservation_time = ?       │
│   AND status != 'cancelled'      │
└────┬─────────────────────────────┘
     │ 4. Check against max_tables
     ▼
┌──────────────────────────────────┐
│ Return availability: true/false  │
└────┬─────────────────────────────┘
     │ 5. If available, show form
     ▼
┌──────────────────────────────────┐
│ Customer fills details           │
│ - Name, email, phone             │
│ - Special requests               │
└────┬─────────────────────────────┘
     │ 6. Submit reservation
     ▼
┌──────────────────────────────────┐
│ POST /api/reservations           │
│ {                                │
│   customer_name,                 │
│   customer_email,                │
│   reservation_date,              │
│   reservation_time,              │
│   party_size,                    │
│   special_requests               │
│ }                                │
└────┬─────────────────────────────┘
     │ 7. Validate:
     │    - Date is in future
     │    - Within booking window
     │    - Min advance hours met
     │    - Slot still available
     ▼
┌──────────────────────────────────┐
│ INSERT INTO reservations         │
│ Status = auto_confirm ?          │
│   'confirmed' : 'pending'        │
└────┬─────────────────────────────┘
     │ 8. Send confirmation email
     ▼
┌──────────────────────────────────┐
│ POST /api/send-reservation-email │
└────┬─────────────────────────────┘
     │ 9. Email sent
     ▼
┌──────────────────────────────────┐
│ Redirect to confirmation page    │
│ /reservations/confirmation?id=...│
└──────────────────────────────────┘
```

---

## 🔐 Authentication & Authorization

### Authentication Flow (Supabase Auth)

```
┌─────────┐
│  Admin  │
└────┬────┘
     │ 1. Visit /admin/login
     ▼
┌──────────────────────────┐
│ Login Form               │
│ - Email                  │
│ - Password               │
└────┬─────────────────────┘
     │ 2. Submit credentials
     ▼
┌──────────────────────────────────┐
│ supabase.auth.signInWithPassword │
│ ({                               │
│   email: "admin@example.com",    │
│   password: "********"           │
│ })                               │
└────┬─────────────────────────────┘
     │ 3. Supabase validates
     ▼
┌──────────────────────────────────┐
│ Supabase Auth                    │
│ - Check bcrypt password hash     │
│ - Generate JWT access token      │
│ - Generate refresh token         │
└────┬─────────────────────────────┘
     │ 4. Return session
     ▼
┌──────────────────────────────────┐
│ Store in HTTP-only cookies       │
│ - sb-access-token                │
│ - sb-refresh-token               │
└────┬─────────────────────────────┘
     │ 5. Redirect to /admin
     ▼
┌──────────────────────────────────┐
│ Middleware intercepts request    │
│ /admin/*                         │
└────┬─────────────────────────────┘
     │ 6. Validate session
     ▼
┌──────────────────────────────────┐
│ supabase.auth.getUser()          │
│ - Decode JWT                     │
│ - Check expiration               │
└────┬─────────────────────────────┘
     │ 7. Check admin_users table
     ▼
┌──────────────────────────────────┐
│ SELECT is_active FROM admin_users│
│ WHERE id = auth.uid()            │
└────┬─────────────────────────────┘
     │ 8. If active → Allow
     │    If not → Redirect to login
     ▼
┌──────────────────────────────────┐
│ Admin Dashboard Loaded           │
└──────────────────────────────────┘
```

### Row Level Security (RLS) Policies

**Purpose:** Enforce access control at the database level, not just application level.

#### menu_items Policies

```sql
-- Public can read available items
CREATE POLICY "Allow public read access to menu_items"
  ON menu_items FOR SELECT
  USING (is_available = true);

-- Admins can insert
CREATE POLICY "Admins can insert menu items"
  ON menu_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Admins can update
CREATE POLICY "Admins can update menu items"
  ON menu_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Admins can delete
CREATE POLICY "Admins can delete menu items"
  ON menu_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );
```

#### orders Policies

```sql
-- Only admins can view orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Only admins can update orders
CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );
```

#### reservations Policies

```sql
-- Anyone can create reservations (public endpoint)
CREATE POLICY "Anyone can create reservations"
  ON reservations FOR INSERT
  WITH CHECK (true);

-- Customers can view their own (filtered in app)
CREATE POLICY "Customers can view own reservations"
  ON reservations FOR SELECT
  USING (true);

-- Admins can view all
CREATE POLICY "Admins can view all reservations"
  ON reservations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Admins can update status
CREATE POLICY "Admins can update reservations"
  ON reservations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );
```

### Middleware Protection

**File:** [src/middleware.ts](./src/middleware.ts)

```typescript
export async function middleware(request: NextRequest) {
  // Only run on /admin/* routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser()

    // Not authenticated → redirect to login
    if (!user && request.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Check if user is active admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('is_active')
      .eq('id', user.id)
      .single()

    if (!adminUser || !adminUser.is_active) {
      await supabase.auth.signOut()
      return NextResponse.redirect(
        new URL('/admin/login?error=unauthorized', request.url)
      )
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'], // Only protect /admin routes
}
```

---

## 🔌 API Routes

All API routes are serverless functions deployed on Vercel Edge Network.

### Orders API

#### `POST /api/orders`
Creates a new order.

**Request Body:**
```typescript
{
  customer_name: string
  customer_phone: string
  customer_email?: string
  order_type: 'delivery' | 'pickup'
  delivery_address?: string
  special_notes?: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    selectedCustomizations?: Record<string, string>
  }>
  subtotal: number
  tax: number
  total: number
}
```

**Response:**
```typescript
{
  success: true,
  order: {
    id: "uuid",
    status: "pending",
    created_at: "2025-10-18T12:00:00Z",
    // ... all order fields
  }
}
```

**Validation:**
- Required fields check
- Order type validation
- Delivery address required if delivery
- Price validation (calculated on client, stored for record)

**Side Effects:**
- Inserts into `orders` table
- Triggers email via `/api/send-order-email`
- Broadcasts real-time update to admin dashboard

---

#### `GET /api/orders`
Fetches all orders (admin only).

**Query Parameters:**
- `status` (optional): Filter by status

**Response:**
```typescript
{
  success: true,
  orders: Order[]
}
```

---

#### `PUT /api/orders/[id]`
Updates order status.

**Request Body:**
```typescript
{
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
}
```

**Authorization:** Admin only (checked via middleware + RLS)

---

### Reservations API

#### `POST /api/reservations`
Creates a new reservation.

**Request Body:**
```typescript
{
  customer_name: string
  customer_email: string
  customer_phone: string
  reservation_date: string // "YYYY-MM-DD"
  reservation_time: string // "HH:MM"
  party_size: number
  special_requests?: string
}
```

**Validation:**
1. Required fields check
2. Party size (1-20)
3. Date in future
4. Min advance hours
5. Within booking window
6. Slot availability

**Response:**
```typescript
{
  message: "Reservation created successfully",
  reservation: {
    id: "uuid",
    status: "pending" | "confirmed",
    // ... all reservation fields
  }
}
```

**Side Effects:**
- Inserts into `reservations` table
- Status based on `auto_confirm` setting
- Triggers email via `/api/send-reservation-email`

---

#### `GET /api/reservations/availability`
Checks if a time slot is available.

**Query Parameters:**
- `date`: "YYYY-MM-DD"
- `time`: "HH:MM"

**Logic:**
```sql
-- Count reservations at this time
SELECT COUNT(*) FROM reservations
WHERE reservation_date = ?
  AND reservation_time = ?
  AND status NOT IN ('cancelled', 'no_show')

-- Compare to max_tables setting
```

**Response:**
```typescript
{
  available: boolean,
  reason?: string // If not available
}
```

---

### Email API

#### `POST /api/send-order-email`
Sends order confirmation email via Resend.

**Request Body:**
```typescript
{
  customerEmail: string
  customerName: string
  orderNumber: string
  orderType: 'delivery' | 'pickup'
  items: Array<{ name, quantity, price }>
  subtotal: number
  tax: number
  total: number
  estimatedTime: string
  deliveryAddress?: string
  orderDate: string
}
```

**Resend Integration:**
```typescript
const { data, error } = await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL!,
  to: customerEmail,
  subject: `Order Confirmation #${orderNumber}`,
  react: OrderConfirmationEmail({ ...props }),
  replyTo: process.env.RESEND_REPLY_TO_EMAIL
})
```

**Email Template:** React component using `@react-email/components`

---

## ⚡ Real-time Features

### Supabase Realtime Architecture

Supabase Realtime uses PostgreSQL's logical replication feature to broadcast changes.

**Enabled Tables:**
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE reservations;
```

### Admin Dashboard Real-time Updates

**File:** [src/app/admin/orders/page.tsx](./src/app/admin/orders/page.tsx)

```typescript
useEffect(() => {
  const supabase = createClient()

  // Subscribe to changes
  const channel = supabase
    .channel('orders-channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders'
      },
      (payload) => {
        // New order → Add to list + show notification
        setOrders(prev => [payload.new, ...prev])
        showNotification('🔔 New Order!', payload.new)
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      },
      (payload) => {
        // Order updated → Update in list
        setOrders(prev =>
          prev.map(order =>
            order.id === payload.new.id ? payload.new : order
          )
        )
      }
    )
    .subscribe()

  // Cleanup
  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

**Events Supported:**
- `INSERT` - New record created
- `UPDATE` - Record modified
- `DELETE` - Record deleted

**Benefits:**
- No polling needed
- Instant updates across all connected clients
- Low latency (< 100ms)
- Automatic reconnection

---

## 🗂️ State Management

### Client-Side State Architecture

```
┌──────────────────────────────────────────────────┐
│               APPLICATION STATE                   │
├──────────────────────────────────────────────────┤
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │  React Context API                      │    │
│  ├─────────────────────────────────────────┤    │
│  │                                          │    │
│  │  CartContext                             │    │
│  │  ├── items: CartItem[]                   │    │
│  │  ├── itemCount: number                   │    │
│  │  ├── subtotal: number                    │    │
│  │  ├── tax: number                         │    │
│  │  ├── total: number                       │    │
│  │  ├── isCartOpen: boolean                 │    │
│  │  │                                        │    │
│  │  └── Actions:                            │    │
│  │      ├── addToCart()                     │    │
│  │      ├── removeFromCart()                │    │
│  │      ├── updateQuantity()                │    │
│  │      ├── clearCart()                     │    │
│  │      └── setIsCartOpen()                 │    │
│  └──────────────────────────────────────────┘    │
│                     │                             │
│                     │ Synced to                   │
│                     ▼                             │
│  ┌──────────────────────────────────────────┐    │
│  │  Browser localStorage                    │    │
│  │  Key: "nghia-demo-cart"                  │    │
│  │  Value: JSON.stringify(items)            │    │
│  └──────────────────────────────────────────┘    │
│                                                   │
└───────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│            SERVER-FETCHED STATE                   │
├──────────────────────────────────────────────────┤
│                                                   │
│  Component useState + useEffect                  │
│  ├── Menu Items (from Supabase)                  │
│  ├── Categories (from Supabase)                  │
│  ├── Orders (from Supabase + Real-time)          │
│  ├── Reservations (from Supabase + Real-time)    │
│  └── Settings (from Supabase)                    │
│                                                   │
└───────────────────────────────────────────────────┘
```

### Cart Context Implementation

**File:** [src/context/CartContext.tsx](./src/context/CartContext.tsx)

**Key Features:**
1. **Persistent Cart**: Synced to localStorage
2. **Unique Cart Items**: Same item + different customizations = separate cart entry
3. **Cart Item ID**: Generated from `${itemId}-${customizationsKey}`
4. **Auto-open**: Cart slides out when item added
5. **Tax Calculation**: German VAT (19%)

**Cart Item Structure:**
```typescript
interface CartItem {
  // From MenuItem
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  popular: boolean

  // Cart-specific
  quantity: number
  selectedCustomizations?: {
    "Spice Level": "Spicy",
    "Noodle Type": "Extra Noodles"
  }
  cartItemId: string // "pho-tai-SpiceLevel:Spicy|NoodleType:ExtraNoodles"
}
```

---

## 📁 File Structure

```
pho-sushi/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (providers)
│   │   ├── page.tsx                  # Homepage
│   │   ├── globals.css               # Global styles + Tailwind
│   │   │
│   │   ├── menu/
│   │   │   └── page.tsx              # Menu page (CSR)
│   │   │
│   │   ├── order/
│   │   │   └── page.tsx              # Order page (CSR)
│   │   │
│   │   ├── reservations/
│   │   │   ├── page.tsx              # Reservation form
│   │   │   └── confirmation/
│   │   │       └── page.tsx          # Confirmation page
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.tsx            # Admin layout (sidebar)
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Admin login
│   │   │   ├── orders/
│   │   │   │   └── page.tsx          # Order management
│   │   │   ├── reservations/
│   │   │   │   └── page.tsx          # Reservation management
│   │   │   ├── menu/
│   │   │   │   └── page.tsx          # Menu editor
│   │   │   └── settings/
│   │   │       └── page.tsx          # Restaurant settings
│   │   │
│   │   └── api/                      # API Routes (Serverless)
│   │       ├── orders/
│   │       │   ├── route.ts          # POST, GET /api/orders
│   │       │   └── [id]/
│   │       │       └── route.ts      # PUT, DELETE /api/orders/[id]
│   │       ├── reservations/
│   │       │   ├── route.ts          # POST, GET /api/reservations
│   │       │   ├── availability/
│   │       │   │   └── route.ts      # GET availability
│   │       │   └── [id]/
│   │       │       └── route.ts      # PUT /api/reservations/[id]
│   │       ├── send-order-email/
│   │       │   └── route.ts          # POST email trigger
│   │       └── send-reservation-email/
│   │           └── route.ts          # POST email trigger
│   │
│   ├── components/                   # React Components
│   │   ├── Header.tsx                # Sticky header + navigation
│   │   ├── Hero.tsx                  # Hero section (homepage)
│   │   ├── MenuItem.tsx              # Menu item card
│   │   ├── MenuItemSkeleton.tsx      # Loading skeleton
│   │   ├── CartSidebar.tsx           # Sliding cart panel
│   │   ├── CartItem.tsx              # Cart item row
│   │   ├── CheckoutModal.tsx         # Checkout flow
│   │   ├── Footer.tsx                # Site footer
│   │   ├── Specialties.tsx           # Specialties section
│   │   ├── TrustBadges.tsx           # Trust badges
│   │   ├── HowItWorks.tsx            # How it works section
│   │   ├── About.tsx                 # About section
│   │   ├── Contact.tsx               # Contact section
│   │   ├── InfoBanner.tsx            # Info banner
│   │   └── SpecialtyCard.tsx         # Specialty card
│   │
│   ├── context/                      # React Context
│   │   └── CartContext.tsx           # Cart state management
│   │
│   ├── lib/                          # Utilities
│   │   ├── supabase.ts               # Supabase client (basic)
│   │   ├── supabase-browser.ts       # Browser client (SSR)
│   │   ├── supabase-server.ts        # Server client (cookies)
│   │   ├── menuData.ts               # Menu types/utils
│   │   └── constants.ts              # App constants
│   │
│   ├── types/                        # TypeScript Types
│   │   ├── menu.ts                   # MenuItem, Category
│   │   ├── order.ts                  # Order, CreateOrderRequest
│   │   ├── reservation.ts            # Reservation types
│   │   └── settings.ts               # Settings types
│   │
│   ├── emails/                       # React Email Templates
│   │   ├── OrderConfirmation.tsx     # Order email
│   │   ├── ReservationConfirmed.tsx  # Reservation confirmed
│   │   └── ReservationDeclined.tsx   # Reservation declined
│   │
│   ├── hooks/                        # Custom Hooks
│   │   └── useNotification.ts        # Toast notifications
│   │
│   ├── middleware.ts                 # Next.js Middleware (auth)
│   │
│   └── config/
│       └── constants.ts              # Global constants
│
├── database/                         # SQL Migration Scripts
│   ├── README.md                     # Database docs
│   ├── supabase-setup.sql            # Menu items + categories
│   ├── admin-setup.sql               # Admin users + settings
│   ├── reservations-setup.sql        # Reservations tables
│   ├── enable-realtime.sql           # Enable Realtime
│   └── [other migration files]
│
├── public/                           # Static Assets
│   ├── hero-placeholder.jpg          # Hero image
│   └── [menu item images]
│
├── .env.local                        # Environment Variables
├── next.config.js                    # Next.js Config
├── tailwind.config.js                # Tailwind Config
├── tsconfig.json                     # TypeScript Config
├── package.json                      # Dependencies
├── README.md                         # Project README
├── FEATURE_BACKLOG.md                # Feature roadmap
├── DEPLOYMENT_GUIDE.md               # Deployment guide
├── RECOMMENDATIONS.md                # Next steps
└── ARCHITECTURE.md                   # This file
```

---

## 🔒 Security Architecture

### Security Layers

```
┌────────────────────────────────────────────┐
│  Layer 1: Network Security                 │
├────────────────────────────────────────────┤
│  • HTTPS/TLS encryption (Vercel)           │
│  • DDoS protection (Vercel Edge)           │
│  • Rate limiting (planned)                 │
└────────────────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  Layer 2: Application Security             │
├────────────────────────────────────────────┤
│  • Next.js Middleware (auth check)         │
│  • Input validation (API routes)           │
│  • XSS prevention (React sanitization)    │
│  • CSRF protection (SameSite cookies)     │
└────────────────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  Layer 3: Authentication                   │
├────────────────────────────────────────────┤
│  • Supabase Auth (JWT tokens)             │
│  • HTTP-only cookies                       │
│  • Bcrypt password hashing                │
│  • Session refresh                         │
└────────────────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  Layer 4: Authorization                    │
├────────────────────────────────────────────┤
│  • Row Level Security (RLS)               │
│  • Admin role checking                     │
│  • is_active flag                          │
└────────────────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  Layer 5: Database Security                │
├────────────────────────────────────────────┤
│  • Prepared statements (SQL injection)    │
│  • Supabase client (sanitized queries)    │
│  • RLS policies (row-level access)        │
└────────────────────────────────────────────┘
```

### Environment Variables Security

**Never commit to Git:**
- `.env.local` is in `.gitignore`
- Secrets stored in Vercel environment variables
- Different keys for dev/staging/production

**Required Variables:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_REPLY_TO_EMAIL=contact@yourdomain.com

# (Future) Stripe
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

### CORS & CSP

**CORS:** Handled by Next.js API routes
**CSP:** To be added for production

---

## 🚀 Deployment Architecture

### Production Deployment (Vercel)

```
┌──────────────────────────────────────────────────────┐
│              VERCEL EDGE NETWORK                      │
│              (100+ Global Locations)                  │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌────────────────────────────────────────────┐     │
│  │  Edge Functions (API Routes)               │     │
│  │  - Auto-scaling                            │     │
│  │  - 0ms cold start                          │     │
│  │  - Regional execution                      │     │
│  └────────────────────────────────────────────┘     │
│                                                       │
│  ┌────────────────────────────────────────────┐     │
│  │  Static Assets (CDN)                       │     │
│  │  - Images, CSS, JS                         │     │
│  │  - Brotli compression                      │     │
│  │  - Cache headers                           │     │
│  └────────────────────────────────────────────┘     │
│                                                       │
│  ┌────────────────────────────────────────────┐     │
│  │  Server-Side Rendering                     │     │
│  │  - On-demand ISR                           │     │
│  │  - Streaming SSR                           │     │
│  └────────────────────────────────────────────┘     │
│                                                       │
└───────────────────────┬───────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
   ┌────▼─────┐                  ┌─────▼──────┐
   │ Supabase │                  │   Resend   │
   │ Database │                  │   Email    │
   │ Oregon   │                  │  Service   │
   └──────────┘                  └────────────┘
```

### Deployment Process

```
┌──────────────┐
│ Developer    │
│ Git Push     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ GitHub Repo      │
│ (main branch)    │
└──────┬───────────┘
       │ Webhook trigger
       ▼
┌─────────────────────────────┐
│ Vercel Build System         │
│ 1. Clone repo               │
│ 2. npm install              │
│ 3. npm run build (Turbopack)│
│ 4. Optimize assets          │
│ 5. Generate static pages    │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Vercel Deployment           │
│ 1. Deploy to edge locations │
│ 2. Update DNS               │
│ 3. Invalidate CDN cache     │
│ 4. Health checks            │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Live in < 60 seconds        │
│ yourdomain.com              │
└─────────────────────────────┘
```

### Environment-Specific Deployments

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| Production | `main` | `yourdomain.com` | Live site |
| Preview | feature branches | `git-branch-name.vercel.app` | Testing |
| Development | local | `localhost:3000` | Development |

---

## 📊 Performance Optimizations

### Current Optimizations

1. **Next.js Image Optimization**
   - Automatic WebP conversion
   - Lazy loading
   - Responsive srcset

2. **Code Splitting**
   - Route-based splitting (automatic)
   - Dynamic imports for heavy components

3. **Caching Strategy**
   - Static assets: Cache-Control: public, max-age=31536000
   - API responses: No-cache for dynamic data
   - localStorage for cart persistence

4. **Database Query Optimization**
   - Indexes on frequently queried columns
   - SELECT only needed columns
   - Pagination for large lists

5. **Real-time Optimization**
   - Single WebSocket connection per client
   - Automatic reconnection
   - Message batching

---

## 🔮 Future Architecture Considerations

### Planned Additions

1. **Redis Cache Layer**
   - Cache menu items
   - Reduce database queries
   - Session storage

2. **Message Queue (Bull/BullMQ)**
   - Async email sending
   - Background job processing
   - Order queue management

3. **CDN for Images**
   - Cloudinary or Supabase Storage
   - Image transformations
   - Automatic optimization

4. **Analytics Pipeline**
   - Google Analytics or Plausible
   - Custom event tracking
   - Conversion funnels

5. **Monitoring & Logging**
   - Sentry for error tracking
   - LogRocket for session replay
   - Vercel Analytics

---

## 📚 Key Architectural Decisions

### Why Next.js App Router?
- **SSR + CSR Hybrid:** Best of both worlds
- **File-based routing:** Intuitive structure
- **API routes:** No separate backend needed
- **Vercel optimizations:** Built by same team

### Why Supabase?
- **PostgreSQL:** Powerful, standard SQL
- **Built-in Auth:** No custom auth needed
- **Real-time:** WebSocket out of the box
- **Row-level Security:** Database-level authorization
- **Free tier:** Great for small restaurants

### Why React Context over Redux?
- **Simpler:** No boilerplate
- **Sufficient:** Cart state is not complex
- **Built-in:** No extra dependencies
- **Performance:** localStorage sync is fast

### Why localStorage for Cart?
- **Persistence:** Cart survives page refresh
- **No backend:** No database needed for cart
- **Fast:** Synchronous access
- **Privacy:** Data stays on device

---

## 🎓 Learning Resources

### Understanding the Stack
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Architecture Patterns
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)

---

## 📝 Summary

This restaurant management system is built with a **modern, scalable architecture** using:

- **Next.js 15** for hybrid SSR/CSR rendering
- **Supabase** for PostgreSQL database + auth + real-time
- **Vercel** for edge deployment
- **React Context** for client state
- **TypeScript** for type safety
- **Tailwind CSS** for styling

**Key Strengths:**
- ✅ Secure (RLS + middleware + auth)
- ✅ Real-time (Supabase Realtime)
- ✅ Scalable (serverless architecture)
- ✅ Fast (edge deployment + caching)
- ✅ Maintainable (TypeScript + clean structure)
- ✅ Cost-effective ($1/month on free tiers!)

**Architecture Principles:**
- Separation of concerns (UI / API / Database)
- Defense in depth (multiple security layers)
- Progressive enhancement (works without JS for core features)
- Mobile-first responsive design
- Real-time first (WebSocket for live updates)

---

**Questions?** Refer to specific sections above or check the linked documentation files.

**Last Updated:** October 18, 2025
