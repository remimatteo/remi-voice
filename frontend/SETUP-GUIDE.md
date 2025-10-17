# Clerk + Stripe Integration Setup Guide

This guide will walk you through setting up Clerk authentication and Stripe payments for your Remi AI application.

## What Was Implemented

### Files Created:
- `middleware.ts` - Clerk authentication middleware
- `pages/dashboard.js` - Protected dashboard for authenticated users
- `pages/success.js` - Checkout success page
- `pages/api/create-checkout-session.js` - Stripe checkout API
- `pages/api/stripe-webhook.js` - Stripe webhook handler
- `.env.local.example` - Environment variables template

### Files Modified:
- `pages/_app.js` - Added ClerkProvider wrapper
- `components/Navigation.js` - Added Clerk auth components (SignIn/SignUp/UserButton)
- `package.json` - Added @clerk/nextjs, stripe, and @stripe/stripe-js

---

## Step 1: Set Up Clerk

### 1.1 Create a Clerk Account
1. Go to [https://dashboard.clerk.com/sign-up](https://dashboard.clerk.com/sign-up)
2. Create a new account (free tier supports 10,000 MAU)
3. Create a new application

### 1.2 Get Your Clerk Keys
1. In your Clerk dashboard, go to **API Keys**
2. Copy the following:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_...`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_...`)

### 1.3 Configure Clerk Settings (Optional)
1. Go to **User & Authentication** > **Email, Phone, Username**
2. Configure which fields you want to collect during sign-up
3. Go to **Customization** to customize the sign-in/sign-up appearance

---

## Step 2: Set Up Stripe

### 2.1 Create a Stripe Account
1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Create a new account
3. Toggle to **Test Mode** in the dashboard (top right)

### 2.2 Get Your Stripe API Keys
1. Go to **Developers** > **API keys**
2. Copy the following:
   - `Publishable key` (starts with `pk_test_...`)
   - `Secret key` (starts with `sk_test_...` - click "Reveal test key")

### 2.3 Create a Product with Trial
1. Go to **Products** in the Stripe dashboard
2. Click **+ Add Product**
3. Fill in:
   - **Name**: "Remi AI Subscription" (or your preferred name)
   - **Description**: Optional description
   - **Pricing**:
     - Choose **Recurring**
     - Set your price (e.g., $29/month)
     - Select billing period (Monthly/Yearly)
4. Click **Add product**
5. On the product page, find the **Price ID** (starts with `price_...`)
6. Copy this Price ID - you'll need it for `.env.local`

### 2.4 Set Up Webhook
1. Go to **Developers** > **Webhooks**
2. Click **+ Add endpoint**
3. Enter your webhook URL:
   - **Development**: Use [ngrok](https://ngrok.com/) or [Stripe CLI](https://stripe.com/docs/stripe-cli)
     - With ngrok: `https://your-ngrok-url.ngrok.io/api/stripe-webhook`
     - With Stripe CLI: It forwards automatically
   - **Production (Render)**: `https://your-app.onrender.com/api/stripe-webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)

---

## Step 3: Configure Environment Variables

### 3.1 Create .env.local
1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in all the values:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price ID
STRIPE_PRICE_ID=price_your_price_id_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.2 Important Notes
- **NEVER commit `.env.local`** to git (it's already in .gitignore)
- Use **test keys** during development (they start with `_test_`)
- Use **production keys** when deploying to Render

---

## Step 4: Test Locally

### 4.1 Install Dependencies (Already Done)
```bash
npm install
```

### 4.2 Test Clerk Authentication
1. Start your dev server:
   ```bash
   npm run dev
   ```
2. Visit [http://localhost:3000](http://localhost:3000)
3. Click **"Start free trial"** or **"Sign in"**
4. Complete the sign-up flow
5. You should be redirected to `/dashboard`

### 4.3 Test Stripe Checkout with Stripe CLI

#### Install Stripe CLI
- **Windows**: Download from [https://github.com/stripe/stripe-cli/releases/latest](https://github.com/stripe/stripe-cli/releases/latest)
- **Mac**: `brew install stripe/stripe-cli/stripe`
- **Linux**: Download binary from releases

#### Forward Webhooks Locally
1. Login to Stripe CLI:
   ```bash
   stripe login
   ```

2. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```

3. Copy the webhook signing secret it displays (starts with `whsec_...`)

4. Update your `.env.local` with this secret

5. In another terminal, start your dev server:
   ```bash
   npm run dev
   ```

#### Test the Checkout Flow
1. Sign in to your app
2. Go to the dashboard
3. Click **"Start Your Free Trial"**
4. You'll be redirected to Stripe checkout
5. Use a test card:
   - **Card Number**: `4242 4242 4242 4242`
   - **Expiry**: Any future date
   - **CVC**: Any 3 digits
   - **ZIP**: Any 5 digits
6. Complete checkout
7. You should be redirected to the success page
8. Check the Stripe CLI output for webhook events

---

## Step 5: Deploy to Render

### 5.1 Update Environment Variables for Production
When deploying to Render, add these environment variables in your Render dashboard:

1. Go to your Render service
2. Click **Environment**
3. Add all variables from `.env.local`
4. **Important**: Change `NEXT_PUBLIC_APP_URL` to your Render URL:
   ```
   NEXT_PUBLIC_APP_URL=https://your-app.onrender.com
   ```

### 5.2 Update Stripe Webhook for Production
1. Go to Stripe Dashboard > **Developers** > **Webhooks**
2. Add a new endpoint with your production URL:
   ```
   https://your-app.onrender.com/api/stripe-webhook
   ```
3. Copy the new webhook secret
4. Update `STRIPE_WEBHOOK_SECRET` in Render environment variables

### 5.3 Update Clerk URLs (Optional)
If you want to use your custom domain:
1. Go to Clerk Dashboard > **Domains**
2. Add your production domain
3. Update the Clerk environment variables if needed

---

## Step 6: How It Works

### Authentication Flow
1. User clicks "Start free trial" or "Sign in"
2. Clerk modal appears for authentication
3. After sign-up/sign-in, user is redirected to `/dashboard`
4. Dashboard is protected by `middleware.ts` (requires authentication)

### Payment Flow
1. Authenticated user clicks "Start Your Free Trial" on dashboard
2. Frontend calls `/api/create-checkout-session`
3. API creates Stripe checkout session with:
   - 7-day trial period
   - Clerk user ID in metadata
4. User is redirected to Stripe checkout
5. After successful checkout, user goes to `/success`
6. Success page redirects to dashboard after 5 seconds
7. Stripe sends webhook events to `/api/stripe-webhook`
8. Webhook handler processes subscription events

### Protected Routes
The following routes are protected (require authentication):
- `/dashboard` - Main dashboard
- `/api/create-checkout-session` - Checkout API

Protected routes are configured in [middleware.ts](middleware.ts:5-7).

---

## Step 7: Next Steps

### Database Integration (Recommended)
The current implementation logs events to the console. For production, you should:

1. Set up a database (PostgreSQL, MongoDB, etc.)
2. Store user subscription data:
   - Clerk User ID
   - Stripe Customer ID
   - Stripe Subscription ID
   - Subscription status
   - Trial end date
   - Current plan

3. Update `pages/api/stripe-webhook.js` to save to database
4. Update `pages/dashboard.js` to fetch real subscription data

### LiveKit Integration
After payments are working, integrate LiveKit for voice calls:
1. Set up LiveKit Cloud or self-hosted server
2. Add LiveKit credentials to `.env.local`
3. Create API route to generate LiveKit tokens
4. Build voice call UI in dashboard

### Email Notifications
Set up email notifications for:
- Welcome email after sign-up
- Trial ending reminders
- Payment success/failure
- Subscription cancellation

You can use:
- [Resend](https://resend.com/)
- [SendGrid](https://sendgrid.com/)
- [Postmark](https://postmarkapp.com/)

---

## Testing

### Test Cards (Stripe Test Mode)
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### Testing Webhooks
Use Stripe CLI to trigger test events:
```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger invoice.payment_succeeded
```

---

## Troubleshooting

### Clerk Issues
- **"Clerk: Missing publishable key"**: Check `.env.local` has `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- **Authentication not working**: Restart dev server after adding env variables

### Stripe Issues
- **"No such price"**: Verify `STRIPE_PRICE_ID` is correct in `.env.local`
- **Webhook not firing**: Ensure Stripe CLI is running or webhook endpoint is configured
- **"Invalid signature"**: Check `STRIPE_WEBHOOK_SECRET` matches your webhook endpoint

### General Issues
- **Environment variables not loading**: Restart dev server (`npm run dev`)
- **404 on dashboard**: Ensure `middleware.ts` is in the correct location
- **Build errors**: Run `npm install` to ensure all dependencies are installed

---

## Resources

### Documentation
- [Clerk Next.js Docs](https://clerk.com/docs/quickstarts/nextjs)
- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

### Support
- [Clerk Discord](https://clerk.com/discord)
- [Stripe Support](https://support.stripe.com/)
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)

---

## Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] Never commit API keys to git
- [ ] Use test keys during development
- [ ] Verify webhook signatures in production
- [ ] Use HTTPS in production
- [ ] Validate user input in API routes
- [ ] Use Clerk's built-in CSRF protection
- [ ] Set up proper CORS headers if needed

---

**You're all set!** Follow the steps above to get Clerk and Stripe fully configured. If you run into any issues, refer to the troubleshooting section or the official documentation.
