# Environment Configuration

Create a `.env` file in the root of the project with your credentials (do NOT commit `.env`):

```
# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_public_key

# PayPal (use sandbox for testing)
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Healing agent (if used)
HEALING_AGENT_ID=x9818qg581ivqrmi
HEALING_AGENT_API_KEY=sk_healingagent_your_secret_key
HEALING_AGENT_URL=https://agent.ai/agent/modularhealingagent
HEALING_AGENT_WEBHOOK_SECRET=your_webhook_secret_token_here

# Admin
ADMIN_PASSWORD=your_admin_password

# Server
PORT=3000
NODE_ENV=development
```

## Getting API Keys

### Stripe
1. Go to the Stripe Dashboard: https://dashboard.stripe.com
2. Navigate to **Developers** → **API Keys** and copy your **Secret Key** (starts with `sk_`).
3. For webhooks, go to **Developers** → **Webhooks**, create a new endpoint and copy the **Signing Secret** (starts with `whsec_`).
   - URL example: `https://yourdomain.com/webhook/stripe`
   - Limit events to only what you need (recommended: `payment_intent.succeeded`, `payment_intent.payment_failed`), avoid subscribing to broad event sets.

### PayPal (IPN / Webhooks)
1. Go to PayPal Developer: https://developer.paypal.com/
2. Create an app (Sandbox for testing) and copy **Client ID** and **Secret**.
3. For IPN: configure the IPN URL in your seller account to `https://yourdomain.com/webhook/paypal`.
   - PayPal IPN verification: PayPal will POST the notification to your endpoint; you must POST the same payload back to PayPal's verification URL and check for the literal response `VERIFIED`.
   - Sandbox verification URL: `https://www.sandbox.paypal.com/cgi-bin/webscr`
   - Live verification URL: `https://www.paypal.com/cgi-bin/webscr`

## Running the Server

Install dependencies and start the server:

```bash
npm install
npm start
```

Or with auto-reload (requires nodemon):

```bash
npm run dev
```

## Testing Locally (securely)

Use a tunnel to expose your local server for webhook testing. Two recommended options:

- ngrok:

```bash
ngrok http 3000
```

Then use the ngrok HTTPS URL when configuring webhook endpoints in provider dashboards (this is for testing only — use HTTPS and your real domain in production).

- Stripe CLI (alternative to ngrok):

```bash
stripe listen --forward-to localhost:3000/webhook/stripe
```

This forwards Stripe events locally and prints event payloads for easier debugging.

## Webhook Security & Best Practices

- Always use HTTPS for webhook endpoints in production.
- Verify signatures for incoming webhooks:
  - For Stripe: verify using the `STRIPE_WEBHOOK_SECRET` with the Stripe SDK's `constructEvent`.
  - For PayPal: POST back to PayPal's verify URL and accept only `VERIFIED` responses.
- Limit webhook subscriptions to only required events.
- Use a separate webhook signing secret for each environment (dev/staging/prod) and rotate keys periodically.
- Validate incoming payloads and rate-limit the endpoint to reduce abuse.

## Healing Agent Notes

- If you're integrating a healing agent (agent.ai or another provider) put its credentials in `.env` as shown above.
- Prefer calling the agent from your server (server-side proxy) to keep API keys secret — `server/app.js` already exposes `/api/agent/agentai` for this.
- If the agent can push triggers/webhooks to you, configure the agent to POST to `https://yourdomain.com/api/agent/webhook` and set `HEALING_AGENT_WEBHOOK_SECRET` on both sides. Verify the webhook token/signature before trusting the payload.

## Payment Records

All verified payments are logged to `assets/data/payments.json` with:
- Payment provider (Stripe or PayPal)
- Amount and currency
- Transaction ID
- Payer email
- Item description
- Timestamp of verification

## Deployment & Production Checklist

1. Move secrets into a secure environment store (hosted env vars, secrets manager), do not commit `.env` to git.
2. Use HTTPS and a real domain for webhook URLs in production.
3. Configure provider webhooks with the proper production URLs and secrets.
4. Test webhook verification in sandbox/staging before switching to live.
5. Monitor webhook traffic and set up alerts on failed verification attempts.

If you want, I can apply these exact instructions to your repository file now.
