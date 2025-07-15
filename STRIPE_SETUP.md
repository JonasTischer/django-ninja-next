# Stripe Integration Setup Guide

## Overview
This guide will help you set up Stripe payments in your Django + Next.js application.

## Backend Setup

### 1. Environment Variables
Add the following to your `backend/.env.local` file:

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2. Database Migration
Run the following commands to create the payment tables:

```bash
cd backend
python manage.py makemigrations payments
python manage.py migrate
```

### 3. Create Subscription Plans
Create your subscription plans in the database:

```bash
python manage.py create_plans
```

**Important**: After creating the plans, you need to:
1. Go to your Stripe Dashboard
2. Create products and pricing
3. Update the `stripe_price_id` fields in the Django admin for each plan

### 4. Set up Webhooks
1. Go to your Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhooks/stripe`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook secret to your environment variables

## Frontend Setup

### 1. Install Stripe JavaScript Library
```bash
cd frontend
npm install @stripe/stripe-js
```

### 2. Environment Variables
Add to your `frontend/.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 3. Update Stripe Configuration
Update `frontend/src/lib/stripe.ts`:

```typescript
import { loadStripe } from '@stripe/stripe-js';

export const getStripe = () => {
  if (typeof window !== 'undefined') {
    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return null;
};
```

## Features Implemented

### Backend API Endpoints
- `GET /api/payments/plans` - Get all subscription plans
- `GET /api/payments/subscription` - Get user's current subscription
- `POST /api/payments/checkout` - Create checkout session
- `POST /api/payments/cancel` - Cancel subscription
- `POST /api/payments/portal` - Create customer portal session
- `POST /api/payments/webhooks/stripe` - Handle Stripe webhooks

### Frontend Components
- **ProModal**: Beautiful pricing modal with plan selection
- **NavProUpgrade**: Sidebar upgrade component
- Stripe integration utilities

## Testing

### 1. Test Mode
Make sure you're using test API keys (`pk_test_` and `sk_test_`) for development.

### 2. Test Cards
Use Stripe's test cards:
- `4242424242424242` - Visa (succeeds)
- `4000000000000002` - Visa (declined)

### 3. Webhook Testing
Use Stripe CLI for local webhook testing:
```bash
stripe listen --forward-to localhost:8000/api/payments/webhooks/stripe
```

## Production Setup

### 1. Environment Variables
- Replace test keys with live keys (`pk_live_` and `sk_live_`)
- Update webhook endpoint to production URL
- Set up proper error monitoring

### 2. Security
- Ensure webhook signature verification is working
- Use HTTPS in production
- Set up proper CORS configuration

## Troubleshooting

### Common Issues
1. **"Stripe not configured"**: Install `@stripe/stripe-js` and update environment variables
2. **Webhook signature verification fails**: Check webhook secret in environment variables
3. **Plans not showing**: Run `python manage.py create_plans` and update Stripe price IDs

### Support
- Check Django logs for backend errors
- Use browser developer tools for frontend debugging
- Monitor Stripe Dashboard for payment events

## Next Steps
1. Customize the pricing plans in the management command
2. Add subscription status to user profile
3. Implement usage-based billing if needed
4. Add email notifications for subscription events
5. Create admin interface for subscription management