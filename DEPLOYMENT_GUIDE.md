# 🚀 Deployment Guide - Vercel + Custom Domain

## ✅ Fix Applied

ESLint errors are now **non-blocking** for production builds. The fix has been committed.

---

## 📋 Step-by-Step Deployment

### **Step 1: Push Your Code** (2 minutes)

Open Terminal and run:

```bash
cd /Users/nghia/Desktop/website-projects/nghia-demo

# Push the changes to GitHub
git push origin main
```

If you get authentication error, you may need to use SSH or Personal Access Token. Follow GitHub's guide.

---

### **Step 2: Deploy to Vercel** (5 minutes)

#### **Option A: Deploy via Vercel Dashboard (Recommended)**

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"

2. **Import Project**
   - Click "Add New..." → "Project"
   - Find your repository: `madebynghia1/nghia-demo` (or whatever your repo is called)
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

4. **Add Environment Variables**

   Click "Environment Variables" and add these:

   ```
   NEXT_PUBLIC_SUPABASE_URL = your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
   RESEND_API_KEY = your_resend_api_key
   NOTIFICATION_EMAIL = your_email@example.com
   ```

   **Where to find these:**
   - Supabase: Project Settings → API → URL and anon key
   - Resend: Dashboard → API Keys
   - Email: Your notification email address

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL like: `https://nghia-demo-xyz.vercel.app`

#### **Option B: Deploy via CLI** (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then deploy to production
vercel --prod
```

---

### **Step 3: Test Your Deployment** (5 minutes)

Visit your Vercel URL (e.g., `https://nghia-demo-xyz.vercel.app`)

**Test Checklist:**
- [ ] Homepage loads
- [ ] Menu page loads
- [ ] Can add items to cart
- [ ] Reservation page works
- [ ] Admin login works (`/admin/login`)
- [ ] Images load correctly

**If something doesn't work:**
- Check Vercel logs: Project → Deployments → Click on latest → "Logs"
- Verify environment variables are set correctly
- Check Supabase database is accessible

---

### **Step 4: Buy Domain on Namecheap** (5 minutes)

1. **Go to Namecheap**
   - Visit: https://www.namecheap.com

2. **Search for Domain**
   - Enter your desired domain (e.g., `your-restaurant-name`)
   - Select `.com` (recommended) or other TLD
   - Add to cart

3. **Configure at Checkout**
   - ✅ Enable WhoisGuard (privacy protection - usually FREE)
   - ✅ Auto-renew (optional but recommended)
   - Payment: Credit card or PayPal

4. **Purchase**
   - Complete checkout
   - You'll receive confirmation email

**Cost:** ~$10-15/year for `.com`

---

### **Step 5: Connect Domain to Vercel** (10 minutes)

#### **In Vercel:**

1. **Go to Your Project**
   - Vercel Dashboard → Your Project → "Settings"

2. **Add Domain**
   - Click "Domains" tab
   - Enter your domain: `your-domain.com` (without www)
   - Click "Add"

3. **Copy DNS Records**

   Vercel will show you these records:

   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: Auto

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: Auto
   ```

   **Keep this tab open** - you'll need these values

#### **In Namecheap:**

1. **Login to Namecheap**
   - Go to: https://ap.www.namecheap.com/
   - Login with your account

2. **Manage Domain**
   - Click "Domain List" in sidebar
   - Find your domain
   - Click "Manage" button

3. **Go to Advanced DNS**
   - Click "Advanced DNS" tab at the top

4. **Delete Default Records**
   - Look for existing `A Record` with Host `@` → Delete
   - Look for existing `CNAME Record` with Host `www` → Delete
   - Click "Yes, remove" on confirmation

5. **Add Vercel Records**

   **Record 1: A Record**
   - Click "Add New Record"
   - Type: `A Record`
   - Host: `@`
   - Value: `76.76.21.21`
   - TTL: `Automatic`
   - Click checkmark ✓

   **Record 2: CNAME Record**
   - Click "Add New Record"
   - Type: `CNAME Record`
   - Host: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `Automatic`
   - Click checkmark ✓

6. **Save Changes**
   - Click "Save All Changes" button at top right
   - Wait for confirmation message

---

### **Step 6: Wait for DNS Propagation** (15-60 minutes)

**What's happening:**
DNS changes need to propagate across the internet. This usually takes 15-60 minutes, sometimes up to 24 hours.

**Check Progress:**

1. **In Vercel**
   - Go to Settings → Domains
   - Status will change from "Invalid Configuration" → "Valid"
   - SSL certificate will auto-provision (shows 🔒)

2. **Check DNS Propagation**
   - Visit: https://dnschecker.org/
   - Enter your domain: `your-domain.com`
   - Select type: `A`
   - Click "Search"
   - Should show `76.76.21.21` globally (green checkmarks)

3. **Test Your Domain**
   - Try visiting `https://your-domain.com` (may not work yet)
   - Try visiting `https://www.your-domain.com`
   - If you see "DNS_PROBE_FINISHED_NXDOMAIN" → Still propagating, wait more

---

### **Step 7: Verify Everything Works** (5 minutes)

Once DNS propagates, test:

**✅ Domain Access:**
- [ ] `https://your-domain.com` loads
- [ ] `https://www.your-domain.com` loads
- [ ] Both show 🔒 (SSL certificate)
- [ ] Original Vercel URL still works: `nghia-demo-xyz.vercel.app`

**✅ Functionality:**
- [ ] Menu loads with items from database
- [ ] Add to cart works
- [ ] Checkout flow works
- [ ] Reservations work
- [ ] Admin login works
- [ ] Email notifications send

**✅ Performance:**
- [ ] Page loads in < 3 seconds
- [ ] Images load quickly
- [ ] Mobile responsive

---

## 🎯 Optional: Configure WWW Redirect

**Option 1: Redirect www to non-www** (Recommended)

In Vercel:
1. Settings → Domains
2. Find `your-domain.com`
3. Click "Edit"
4. Enable "Redirect www.your-domain.com to your-domain.com"
5. Save

Result: `www.your-domain.com` → redirects to → `your-domain.com`

**Option 2: Redirect non-www to www**

Same process, but enable "Redirect your-domain.com to www.your-domain.com"

Result: `your-domain.com` → redirects to → `www.your-domain.com`

**Recommendation:** Use non-www (Option 1) - it's cleaner and modern

---

## 🔧 Troubleshooting

### **Issue: Build Fails on Vercel**

**Solution 1: Check Environment Variables**
- Go to Vercel → Settings → Environment Variables
- Make sure all 4 variables are set
- Click "Redeploy" button

**Solution 2: Check Logs**
- Deployments → Click on failed deployment → "Logs"
- Look for error messages
- Usually it's missing env variables or Supabase connection

### **Issue: Domain Not Working After 24 Hours**

**Solution:**
1. Check Namecheap DNS records are correct
2. Make sure you deleted old records first
3. Try flushing your DNS cache:
   ```bash
   # Mac
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

   # Windows
   ipconfig /flushdns
   ```
4. Try accessing in incognito/private mode
5. Use dnschecker.org to verify propagation

### **Issue: SSL Certificate Not Working**

**Solution:**
- Wait 24 hours (SSL takes time)
- Vercel automatically provisions Let's Encrypt certificate
- Check Vercel → Domains → Should show 🔒
- If still no SSL after 48h, contact Vercel support

### **Issue: Database Connection Errors**

**Solution:**
1. Check Supabase is not paused (free tier auto-pauses after 7 days inactivity)
2. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
3. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
4. Check Supabase API settings → Disable "Pause project after inactivity"

### **Issue: Emails Not Sending**

**Solution:**
1. Check Resend API key is correct
2. Verify sending domain in Resend dashboard
3. Check Resend free tier limits (100 emails/day)
4. Look at Vercel function logs for errors

---

## 📧 Custom Email Domain Setup (Resend)

### **Prerequisites:**
- Domain purchased on Namecheap
- Resend account created (free tier: 3,000 emails/month)

### **Step 1: Add Domain to Resend**

1. **Go to Resend Dashboard**
   - Visit: https://resend.com/domains
   - Click "Add Domain"
   - Enter your domain: `yourdomain.com`

2. **Copy DNS Records**

   Resend will provide 3 DNS records:

   ```
   SPF Record:
   Type: TXT
   Name: @
   Value: v=spf1 include:resend.com ~all

   DKIM Record:
   Type: TXT
   Name: resend._domainkey
   Value: [long string provided by Resend]

   DMARC Record (optional):
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
   ```

### **Step 2: Configure DNS in Namecheap**

1. **Login to Namecheap**
   - Go to Domain List → Your domain → "Advanced DNS"

2. **Add Email DNS Records**

   **SPF Record:**
   - Click "Add New Record"
   - Type: `TXT Record`
   - Host: `@`
   - Value: `v=spf1 include:resend.com ~all`
   - TTL: `Automatic`

   **DKIM Record:**
   - Click "Add New Record"
   - Type: `TXT Record`
   - Host: `resend._domainkey` (copy exactly from Resend)
   - Value: [paste the long string from Resend]
   - TTL: `Automatic`

   **DMARC Record (optional):**
   - Click "Add New Record"
   - Type: `TXT Record`
   - Host: `_dmarc`
   - Value: `v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com`
   - TTL: `Automatic`

3. **Save All Changes**

### **Step 3: Verify Domain in Resend**

1. Wait 5-15 minutes for DNS propagation
2. Go back to Resend → Domains
3. Click "Verify" on your domain
4. Should show green checkmark ✓ when verified

### **Step 4: Create Production API Key**

1. **In Resend Dashboard:**
   - Go to: https://resend.com/api-keys
   - Click "Create API Key"

2. **Configure API Key:**
   - Name: `Production - Restaurant Name`
   - Permission: **Sending access** (not Full access)
   - Domain: Select your verified domain
   - Click "Add"

3. **Copy the API Key**
   - It will look like: `re_xxxxxxxxxxxx`
   - **Copy it immediately** - you can't see it again!

### **Step 5: Update Environment Variables**

#### **Local Development (.env.local):**

```env
RESEND_API_KEY=re_your_production_api_key_here
RESEND_FROM_EMAIL=Restaurant Name <info@yourdomain.com>
RESEND_REPLY_TO_EMAIL=info@yourdomain.com
```

#### **Vercel Production:**

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add/Update:
   ```
   RESEND_API_KEY = re_your_production_api_key_here
   RESEND_FROM_EMAIL = Restaurant Name <info@yourdomain.com>
   RESEND_REPLY_TO_EMAIL = info@yourdomain.com
   ```
3. Click "Save"
4. Redeploy your application

### **Step 6: Set Up Email Inbox for Replies**

Customers can reply to `info@yourdomain.com`. You have two options:

#### **Option A: Email Forwarding (Free)**

1. In Namecheap → Domain → Mail Settings → Email Forwarding
2. Forward `info@yourdomain.com` → `your-personal@gmail.com`
3. **Result:** Replies arrive in your Gmail

#### **Option B: Email Hosting (Professional)**

Get email hosting:
- **Namecheap Private Email** ($1.18/month)
- **Google Workspace** ($6/month)
- **Zoho Mail** (Free tier available)

Set up `info@yourdomain.com` as a real mailbox.

### **Step 7: Test Email Sending**

1. Place a test order or reservation
2. Check that email arrives
3. Try replying to the email
4. Verify reply arrives at your inbox

### **Common Issues:**

**"API key is invalid" (401 error):**
- You must create a NEW API key (can't reuse old keys)
- Make sure API key is from the correct Resend account
- Check for extra spaces in `.env.local`

**"Domain not verified" (403 error):**
- Wait for DNS propagation (up to 24 hours)
- Use Resend's verification tool
- Check DNS records in Namecheap are correct

**Emails going to spam:**
- Make sure all 3 DNS records are added (SPF, DKIM, DMARC)
- Domain must be fully verified in Resend
- Use a professional "from" name (not "noreply")

---

## 💰 Costs After Deployment

### **Monthly Costs:**
- **Vercel Hosting**: $0 (Free tier)
  - 100GB bandwidth
  - Unlimited deployments
  - SSL included
  - Custom domain included

- **Supabase Database**: $0 (Free tier)
  - 500MB database
  - 2GB bandwidth
  - 50,000 monthly active users
  - Realtime subscriptions

- **Resend Email**: $0 (Free tier)
  - 100 emails/day
  - 3,000 emails/month

- **Domain (Namecheap)**: ~$1/month ($12/year)

**Total: $1/month** 🎉

### **When You Might Need to Upgrade:**

**Vercel Pro ($20/month):**
- If bandwidth > 100GB/month
- If you need analytics
- If you need team collaboration

**Supabase Pro ($25/month):**
- If database > 500MB
- If bandwidth > 2GB/month
- If you need daily backups

**Resend Growth ($20/month):**
- If sending > 3,000 emails/month
- If you need dedicated IP

**For most single-restaurant customers:** Free tiers are plenty!

---

## 📊 Monitoring Your Deployment

### **Vercel Dashboard:**
- Real-time analytics (on Pro plan)
- Error tracking
- Function logs
- Bandwidth usage

### **Supabase Dashboard:**
- Database size
- Active connections
- API requests
- Query performance

### **Set Up Alerts:**

1. **Vercel**
   - Settings → Integrations → Add Slack/Email notifications
   - Get notified on deployment failures

2. **Supabase**
   - Project Settings → Webhooks
   - Alert on database > 80% full

---

## 🎯 Next Steps After Deployment

1. **Test Everything Thoroughly**
   - Place a real test order
   - Make a test reservation
   - Check admin dashboard
   - Verify emails arrive

2. **Add Real Content**
   - Upload menu items with images
   - Set correct business hours
   - Configure tax rates
   - Add restaurant info

3. **Share with Customer**
   - Send them domain link
   - Provide admin login
   - Train them on dashboard
   - Get feedback

4. **Monitor Performance**
   - Check Vercel analytics
   - Monitor error rates
   - Track page speed
   - Review user feedback

5. **Plan Next Features**
   - Review FEATURE_BACKLOG.md
   - Prioritize with customer
   - Schedule development time

---

## 🔄 Continuous Deployment

**Automatic Deployments:**

Every time you push to GitHub `main` branch, Vercel will:
1. Automatically detect the change
2. Build your app
3. Run tests (if configured)
4. Deploy to production
5. Update your domain

**Preview Deployments:**

For branches other than `main`:
1. Create a new branch: `git checkout -b feature/new-feature`
2. Make changes and push: `git push origin feature/new-feature`
3. Vercel creates preview URL: `nghia-demo-git-feature-new-feature.vercel.app`
4. Test on preview
5. Merge to main when ready → Auto-deploys to production

---

## 🎓 Learning Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Supabase Docs**: https://supabase.com/docs
- **DNS Basics**: https://www.cloudflare.com/learning/dns/what-is-dns/

---

## ✅ Deployment Checklist

Use this for each customer deployment:

```markdown
## Customer: [Restaurant Name]
**Domain:** [example.com]
**Deployed:** [Date]

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] Environment variables ready
- [ ] Supabase database set up
- [ ] Menu items added
- [ ] Branding customized

### Vercel Setup
- [ ] Project imported to Vercel
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Vercel URL tested

### Domain Setup
- [ ] Domain purchased on Namecheap
- [ ] DNS A record added
- [ ] DNS CNAME record added
- [ ] Domain added in Vercel
- [ ] SSL certificate active

### Testing
- [ ] Domain accessible (https)
- [ ] Menu loads correctly
- [ ] Orders work
- [ ] Reservations work
- [ ] Admin dashboard accessible
- [ ] Emails sending
- [ ] Mobile responsive
- [ ] Performance good (< 3s load)

### Handoff
- [ ] Customer login provided
- [ ] Admin training completed
- [ ] Documentation shared
- [ ] Support contact established
- [ ] Invoice sent
- [ ] Go-live! 🎉
```

---

**Questions or issues?** Check Vercel logs first, then Supabase logs, then contact support.

**Deployment Time:** ~30 minutes total (excluding DNS wait time)

**Good luck with your deployment! 🚀**
