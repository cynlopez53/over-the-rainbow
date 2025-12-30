# Over the Rainbow - Getting Started

## What's Here

- **Web Pages**: HTML files for index, donations, shop, tributes, etc.
- **Frontend Logic**: JavaScript in `assets/js/` handles modals, shop, tributes
- **Secure Backend**: Node.js + Express server with webhook verification for Stripe/PayPal
- **Data**: JSON files store memorials, tributes, and payment records

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Payment Methods
Create a `.env` file in the root directory with your Stripe and PayPal API keys:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=...
PORT=3000
```

See [server/WEBHOOK_SETUP.md](server/WEBHOOK_SETUP.md) for detailed instructions.

### 3. Start the Server
```bash
npm start
```

The site will be available at `http://localhost:3000`

## How Payment Works

1. **User clicks "Donate" or "Buy"** → Opens payment modal
2. **Selects Stripe or PayPal** → Redirected to payment provider
3. **Completes payment** → Provider sends webhook to backend
4. **Backend verifies** the transaction using cryptographic signatures
5. **Payment logged** securely in `assets/data/payments.json`
6. **Tribute created** (optional: enhance this in future)

## Security

✅ Payments verified by Stripe/PayPal signatures (not forged)  
✅ No credit card data stored on your server  
✅ All transactions logged with timestamp  
✅ Webhook events are immutable once recorded  

## Directory Structure

```
OvertheRainbow/
├── index.html                    # Home page
├── donate.html                   # Donation page
├── shop.html                     # Shop/memorials
├── tribute-wall.html             # View tributes
├── customize-headstone.html      # Design headstone
├── signup.html                   # User signup
├── support.html                  # Support page
├── package.json                  # Node dependencies
├── assets/
│   ├── css/styles.css            # All styles
│   ├── data/
│   │   ├── memories.json         # User memories
│   │   ├── tributes.json         # Tributes
│   │   └── payments.json         # Payment records (auto-created)
│   ├── images/                   # Images
│   └── js/
│       ├── main.js               # Main site logic
│       ├── shop.js               # Shop/checkout
│       ├── tribute.js            # Tribute wall
│       ├── customize-headstone.js
│       └── builder.js            # Headstone builder
└── server/
    ├── app.js                    # Express backend
    ├── WEBHOOK_SETUP.md          # Webhook configuration guide
    └── README.md                 # Backend docs
```

## Next Steps

1. Get API keys from Stripe and PayPal
2. Configure webhooks in their dashboards
3. Test locally with `npm start`
4. Deploy to production (Heroku, AWS, etc.)

---

For payment configuration help, see [server/WEBHOOK_SETUP.md](server/WEBHOOK_SETUP.md).
