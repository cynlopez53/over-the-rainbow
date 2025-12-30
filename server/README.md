# Over the Rainbow - Secure Payment Backend

## Overview

This backend securely handles donations and purchases using **Stripe** and **PayPal** webhooks. All payments are **cryptographically verified** before being recorded, preventing fraudulent claims.

## Security Features

✅ **Webhook Signature Verification** - Only accepts signed requests from Stripe/PayPal  
✅ **No Card Data Storage** - Payments handled by PCI-compliant providers  
✅ **Immutable Payment Log** - All verified transactions recorded with timestamp  
✅ **Provider Agnostic** - Works with both Stripe and PayPal simultaneously  

## How It Works

1. **User initiates payment** via Stripe or PayPal (on frontend)
2. **Payment provider processes** the transaction
3. **Webhook is sent** to `/webhook/stripe` or `/webhook/paypal` with signed payload
4. **Backend verifies signature** using secret keys (only valid if signed by provider)
5. **Payment logged** in `assets/data/payments.json` if verified
6. **Frontend can check** payment status by reading the log or polling the server

## Installation & Setup

See [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md) for detailed configuration steps.

### Quick Start

```bash
npm install
npm start
```

Then configure webhooks in Stripe/PayPal dashboards pointing to your server URL.

## API Endpoints

### POST `/webhook/stripe`
Receives and verifies Stripe events (charge.succeeded, payment_intent.succeeded).

### POST `/webhook/paypal`
Receives and verifies PayPal IPN notifications.

### GET `/api/payments`
Returns all verified payments (use for admin dashboard).

### GET `/health`
Health check endpoint.

## Payment Log Format

Each recorded payment in `assets/data/payments.json`:

```json
{
  "provider": "stripe",
  "amount": 25.00,
  "currency": "USD",
  "chargeId": "ch_1234567890",
  "email": "donor@example.com",
  "description": "Memorial Stone",
  "status": "completed",
  "verified": true,
  "timestamp": "2025-12-29T12:34:56.789Z"
}
```

## Testing

**Local Testing with ngrok:**
```bash
# Terminal 1
npm start

# Terminal 2
ngrok http 3000
# Use the ngrok URL in webhook settings
```

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

**PayPal Sandbox:**
- Test accounts available in PayPal Developer dashboard

## Production Deployment

1. Add environment variables to your hosting platform (Heroku, AWS, etc.)
2. Use `STRIPE_WEBHOOK_SECRET` and PayPal credentials
3. Update webhook URLs in provider dashboards to your production domain
4. Set `NODE_ENV=production` and `PAYPAL_MODE=live`
5. Consider adding rate limiting and request validation
6. Implement admin authentication for `/api/payments` endpoint

---

**Questions?** Refer to:
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [PayPal IPN](https://developer.paypal.com/docs/classic/products/instant-payment-notification/)
