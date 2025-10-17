# Quick Start Guide

Get your Remi AI app running with Clerk + Stripe in 10 minutes!

## Prerequisites Checklist

- [ ] Node.js installed
- [ ] Clerk account created ([clerk.com](https://clerk.com))
- [ ] Stripe account created ([stripe.com](https://stripe.com))
- [ ] Stripe CLI installed (optional for local testing)

---

## 5-Step Setup

### 1️⃣ Get Your API Keys

**Clerk** ([dashboard.clerk.com](https://dashboard.clerk.com))
- Create an application
- Copy `Publishable key` and `Secret key` from API Keys section

**Stripe** ([dashboard.stripe.com](https://dashboard.stripe.com))
- Switch to Test Mode (top right)
- Go to Developers > API keys
- Copy `Publishable key` and `Secret key`

### 2️⃣ Create Stripe Product

1. Go to Products in Stripe dashboard
2. Click "Add Product"
3. Set name and price (e.g., $29/month)
4. Copy the **Price ID** (starts with `price_...`)

### 3️⃣ Configure Environment

Create `.env.local` in the `frontend` folder:

```bash
cp .env.local.example .env.local
```

Fill in the values:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PRICE_ID=price_xxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Leave these as-is for now:
```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # We'll set this up in step 4
```

### 4️⃣ Set Up Webhooks (Local Testing)

**Option A: Using Stripe CLI (Recommended)**
```bash
# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

Copy the webhook secret it displays and add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**Option B: Using ngrok**
```bash
# Start ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Go to Stripe Dashboard > Developers > Webhooks
# Add endpoint: https://abc123.ngrok.io/api/stripe-webhook
# Copy the webhook secret to .env.local
```

### 5️⃣ Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Testing the Flow

### Test Authentication
1. Click "Start free trial"
2. Sign up with an email
3. You should land on `/dashboard`

### Test Payment
1. On dashboard, click "Start Your Free Trial"
2. Use Stripe test card: `4242 4242 4242 4242`
3. Use any future date, any CVC, any ZIP
4. Complete checkout
5. You should see the success page
6. Check Stripe CLI for webhook events

---

## What's Next?

### For Production (Render Deployment)

1. **Update environment variables in Render**:
   - Add all variables from `.env.local`
   - Change `NEXT_PUBLIC_APP_URL` to your Render URL

2. **Create production webhook in Stripe**:
   - Go to Stripe Dashboard > Webhooks
   - Add endpoint: `https://your-app.onrender.com/api/stripe-webhook`
   - Select these events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy webhook secret to Render environment variables

3. **Switch to production keys**:
   - In Stripe, copy your **Live** mode API keys
   - In Clerk, use production keys
   - Update environment variables in Render

### Add Database (Recommended)

To store subscription data, integrate a database:

1. **Choose a database**:
   - PostgreSQL (Render, Supabase, Neon)
   - MongoDB (MongoDB Atlas)
   - Firebase Firestore

2. **Update webhook handler** (`pages/api/stripe-webhook.js`):
   - Save subscription data on `checkout.session.completed`
   - Update status on subscription events

3. **Update dashboard** (`pages/dashboard.js`):
   - Fetch real subscription data
   - Show trial status, plan details, etc.

4. **Use subscription utilities** (`lib/subscription.js`):
   - Implement the placeholder functions
   - Use them to check subscription status

---

## File Structure

```
frontend/
├── pages/
│   ├── _app.js                          ✏️ Modified (ClerkProvider)
│   ├── index.js                         (Landing page)
│   ├── dashboard.js                     ✨ New (Protected route)
│   ├── success.js                       ✨ New (Checkout success)
│   └── api/
│       ├── create-checkout-session.js   ✨ New (Stripe checkout)
│       └── stripe-webhook.js            ✨ New (Webhook handler)
├── components/
│   └── Navigation.js                    ✏️ Modified (Clerk auth)
├── lib/
│   └── subscription.js                  ✨ New (Utility functions)
├── middleware.ts                        ✨ New (Clerk middleware)
├── .env.local.example                   ✨ New (Env template)
├── .env.local                          🔒 Create this (Your secrets)
├── SETUP-GUIDE.md                       📚 Detailed setup guide
└── QUICK-START.md                       📚 This file
```

---

## Common Issues

**"Clerk: Missing publishable key"**
- Make sure `.env.local` exists and has `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Restart dev server: `npm run dev`

**"No such price: price_xxxxx"**
- Verify `STRIPE_PRICE_ID` matches your Stripe product's price ID
- Make sure you're in the right mode (test/live)

**Webhook not receiving events**
- If using Stripe CLI: Make sure `stripe listen` is running
- If using ngrok: Make sure ngrok is running and webhook URL is updated
- Check `STRIPE_WEBHOOK_SECRET` is correct

**Dashboard redirects to sign-in**
- This is expected! Dashboard requires authentication
- Sign up/sign in first

---

## Resources

- **Full Setup Guide**: See [SETUP-GUIDE.md](SETUP-GUIDE.md)
- **Clerk Docs**: [clerk.com/docs/quickstarts/nextjs](https://clerk.com/docs/quickstarts/nextjs)
- **Stripe Docs**: [stripe.com/docs/payments/checkout](https://stripe.com/docs/payments/checkout)
- **Stripe Test Cards**: [stripe.com/docs/testing](https://stripe.com/docs/testing)

---

## Support

Need help? Check:
1. [SETUP-GUIDE.md](SETUP-GUIDE.md) for detailed instructions
2. [Clerk Discord](https://clerk.com/discord)
3. [Stripe Support](https://support.stripe.com/)

---

**Happy coding! 🚀**
