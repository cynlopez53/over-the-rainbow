# Environment Configuration

Create a `.env` file in the root of the project with your credentials:

```
# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_public_key

# PayPal (use sandbox for testing)
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Server
PORT=3000
NODE_ENV=development
```

## Getting API Keys

### Stripe
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** > **API Keys**
3. Copy the **Secret Key** (starts with `sk_`)
4. For webhook secret, go to **Webhooks** and create a new endpoint:
   - URL: `https://yourdomain.com/webhook/stripe`
   - Events: `charge.succeeded`, `payment_intent.succeeded`
   - Copy the **Signing Secret** (starts with `whsec_`)

### PayPal
1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Create an app in Sandbox
3. Copy **Client ID** and **Secret**
4. In your PayPal account settings, go to **Seller Account** > **Integration** > **IPN Settings**
5. Set IPN URL to: `https://yourdomain.com/webhook/paypal`

## Running the Server

```bash
npm install
npm start
```

Or with auto-reload (requires nodemon):
```bash
npm run dev
```

## Testing Locally

For local development, use ngrok to expose your server:

```bash
ngrok http 3000
```

Then use your ngrok URL for webhook configuration (e.g., `https://abc123.ngrok.io/webhook/stripe`).

## Payment Records

All verified payments are logged to `assets/data/payments.json` with:
- Payment provider (Stripe or PayPal)
- Amount and currency
- Transaction ID
- Payer email
- Item description
- Timestamp of verification
