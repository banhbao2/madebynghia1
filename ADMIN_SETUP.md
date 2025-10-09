# Admin Panel Setup Guide

## 🎯 What You've Built

✅ Admin authentication system
✅ Protected admin routes with middleware
✅ Admin dashboard with stats
✅ Navigation sidebar
✅ Database schema for admin users and restaurant settings

---

## 📋 Setup Steps

### Step 1: Run the SQL Script

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Open `database/admin-setup.sql` and copy all the SQL
5. Paste into the editor and click **Run**

This will create:
- `admin_users` table
- `restaurant_settings` table
- Proper Row Level Security (RLS) policies
- Triggers for auto-updating timestamps

---

### Step 2: Create Your First Admin User

1. In Supabase Dashboard, go to **Authentication** > **Users**
2. Click **Add User** (manual method)
3. Enter your email and password
4. Copy the generated **User UUID**
5. Go back to **SQL Editor** and run this SQL (replace with your details):

```sql
INSERT INTO admin_users (id, email, full_name, role)
VALUES (
  'paste-user-uuid-here',
  'your-email@example.com',
  'Your Name',
  'super_admin'
);
```

---

### Step 3: Test the Admin Panel

1. Start your dev server: `npm run dev`
2. Go to http://localhost:3000/admin
3. You'll be redirected to login page
4. Login with the credentials you created
5. You should see the admin dashboard!

---

## 🔐 Admin Panel Features

### Current Features:
- ✅ Secure authentication
- ✅ Dashboard with stats
- ✅ Navigation sidebar
- ✅ User profile display
- ✅ Logout functionality

### Routes:
- `/admin/login` - Login page
- `/admin` - Dashboard
- `/admin/orders` - Orders management (coming next)
- `/admin/menu` - Menu management (coming next)
- `/admin/settings` - Restaurant settings (coming next)

---

## 🛡️ Security Features

### Middleware Protection:
- All `/admin/*` routes require authentication
- Unauthenticated users redirected to login
- Inactive admins are logged out automatically

### Row Level Security (RLS):
- Admin users can only see/edit authorized data
- Public routes still work normally
- Database-level security enforcement

---

## 🚀 Next Steps

Now that authentication is working, we'll build:

1. **Menu Management UI** - Add/edit/delete menu items with image upload
2. **Order Management** - View and update order statuses
3. **Restaurant Settings** - Configure business info, hours, delivery, etc.

---

## 📝 Notes

- Keep your admin credentials secure
- Only create admin accounts for trusted users
- The super_admin role is for future multi-tier access
- Restaurant settings table is pre-populated with defaults

---

## 🐛 Troubleshooting

### Can't login?
- Check that you created the user in Supabase Auth
- Verify you added the user to `admin_users` table
- Check `is_active` is `true` in `admin_users`

### Redirected to login immediately?
- Check browser console for errors
- Verify middleware is working
- Check Supabase connection in `.env.local`

### Database errors?
- Ensure you ran `admin-setup.sql` completely
- Check RLS policies are enabled
- Verify tables exist in Supabase
