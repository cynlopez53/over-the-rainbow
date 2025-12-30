const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from root directory
app.use(express.static(path.join(__dirname, "..")));

// Path to payments log
const paymentsLog = path.join(__dirname, "../assets/data/payments.json");

// Path to healing conversations log
const conversationsLog = path.join(__dirname, "../assets/data/healing_conversations.json");

// Ensure conversations log exists
function initConversationsLog() {
  if (!fs.existsSync(conversationsLog)) {
    fs.writeFileSync(conversationsLog, JSON.stringify([], null, 2));
  }
}

// Read conversations
function readConversations() {
  try {
    return JSON.parse(fs.readFileSync(conversationsLog, "utf-8")) || [];
  } catch {
    return [];
  }
}

// Append a message to a session
function writeConversation(sessionId, role, text) {
  const conversations = readConversations();
  let session = conversations.find((s) => s.sessionId === sessionId);
  if (!session) {
    session = { sessionId, messages: [] };
    conversations.push(session);
  }
  session.messages.push({ role, text, timestamp: new Date().toISOString() });
  fs.writeFileSync(conversationsLog, JSON.stringify(conversations, null, 2));
}

// Get a session by id
function getConversation(sessionId) {
  const conversations = readConversations();
  return conversations.find((s) => s.sessionId === sessionId) || null;
}

// Delete a session by id
function deleteConversation(sessionId) {
  const conversations = readConversations();
  const filtered = conversations.filter((s) => s.sessionId !== sessionId);
  fs.writeFileSync(conversationsLog, JSON.stringify(filtered, null, 2));
}

// Admin endpoint to view all conversations (password protected)
app.get('/api/admin/conversations', (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const provided = req.query.password || req.headers['x-admin-password'] || '';
  
  if (provided !== adminPassword) {
    return res.status(403).json({ error: 'unauthorized' });
  }

  const conversations = readConversations();
  res.json({ total: conversations.length, conversations });
});

// Ensure payments log exists
function initPaymentsLog() {
  if (!fs.existsSync(paymentsLog)) {
    fs.writeFileSync(paymentsLog, JSON.stringify([], null, 2));
  }
}

// Read payments log
function readPayments() {
  try {
    return JSON.parse(fs.readFileSync(paymentsLog, "utf-8")) || [];
  } catch {
    return [];
  }
}

// Write payment record
function writePayment(paymentData) {
  const payments = readPayments();
  payments.push({
    ...paymentData,
    timestamp: new Date().toISOString(),
    verified: true,
  });
  fs.writeFileSync(paymentsLog, JSON.stringify(payments, null, 2));
}

// STRIPE WEBHOOK - Verify signature and handle payment completion
app.post("/webhook/stripe", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.warn("Missing signature or webhook secret");
    return res.status(400).send("Missing webhook configuration");
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );

    if (event.type === "charge.succeeded") {
      const charge = event.data.object;
      writePayment({
        provider: "stripe",
        amount: charge.amount / 100, // Convert cents to dollars
        currency: charge.currency.toUpperCase(),
        chargeId: charge.id,
        email: charge.billing_details?.email || charge.receipt_email,
        description: charge.description,
        status: "completed",
      });
      console.log("✓ Stripe payment verified:", charge.id);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// HEALING AGENT PROXY - secure server-side proxy to external healing-agent API
// Expects: { message: string, sessionId?: string }
app.post("/api/agent/message", express.json(), async (req, res) => {
  const { message, sessionId = `sess_${Date.now()}` } = req.body || {};
  const AGENT_API_KEY = process.env.HEALING_AGENT_API_KEY;
  const AGENT_URL = process.env.HEALING_AGENT_URL || "https://api.healing-agent.example/v1/respond";

  if (!AGENT_API_KEY) {
    return res.status(500).json({ error: "Healing agent not configured on server" });
  }

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid message" });
  }

  try {
    // store user message
    writeConversation(sessionId, "user", message);

    // call external agent securely from server
    const AGENT_ID = process.env.HEALING_AGENT_ID;
    const payload = { message, sessionId };
    if (AGENT_ID) payload.agentId = AGENT_ID;

    const agentResp = await fetch(AGENT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AGENT_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const agentData = await agentResp.json();
    const reply = agentData.reply || agentData.output || "";

    // store agent reply
    writeConversation(sessionId, "agent", reply);

    res.json({ sessionId, reply, raw: agentData });
  } catch (err) {
    console.error("Healing agent error:", err?.message || err);
    res.status(500).json({ error: "agent_error" });
  }
});

// AGENT.AI-specific proxy: forward user_input to agent.ai agent
// POST /api/agent/agentai { user_input: string, sessionId?: string }
app.post('/api/agent/agentai', express.json(), async (req, res) => {
  const { user_input, sessionId = `sess_${Date.now()}` } = req.body || {};
  const AGENT_API_KEY = process.env.HEALING_AGENT_API_KEY;
  const AGENT_URL = process.env.HEALING_AGENT_URL || 'https://agent.ai/agent/modularhealingagent';
  const AGENT_ID = process.env.HEALING_AGENT_ID;

  if (!AGENT_API_KEY) return res.status(500).json({ error: 'agent_not_configured' });
  if (!user_input || typeof user_input !== 'string') return res.status(400).json({ error: 'invalid_input' });

  try {
    writeConversation(sessionId, 'user', user_input);

    const payload = { user_input, sessionId };
    if (AGENT_ID) payload.agentId = AGENT_ID;

    const r = await fetch(AGENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${AGENT_API_KEY}` },
      body: JSON.stringify(payload),
    });

    const data = await r.json();

    // If agent.ai returns comfort_message or similar, store and forward it
    const comfort = data.comfort_message || data.reply || data.output || '';
    if (comfort) writeConversation(sessionId, 'agent', comfort);

    res.json({ sessionId, comfort, raw: data });
  } catch (err) {
    console.error('agent.ai proxy error:', err?.message || err);
    res.status(502).json({ error: 'agent_proxy_error' });
  }
});

// Retrieve conversation messages for a session
app.get('/api/agent/conversations/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ error: 'missing_sessionId' });
  const session = getConversation(sessionId);
  if (!session) return res.status(404).json({ error: 'not_found' });
  res.json(session);
});

// Delete conversation for a session (privacy control)
app.delete('/api/agent/conversations/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ error: 'missing_sessionId' });
  deleteConversation(sessionId);
  res.json({ deleted: true });
});

// Webhook receiver for agent triggers (if agent.ai supports outgoing triggers)
// Secured by HEALING_AGENT_WEBHOOK_SECRET header check
app.post('/api/agent/webhook', express.json(), (req, res) => {
  const secret = process.env.HEALING_AGENT_WEBHOOK_SECRET;
  const token = req.headers['x-agent-token'] || req.headers['x-webhook-token'];

  if (secret && token !== secret) {
    console.warn('Rejected agent webhook with invalid token');
    return res.status(403).json({ error: 'invalid_token' });
  }

  // Expected payload may vary; support common fields
  const body = req.body || {};
  const sessionId = body.sessionId || body.session_id || `sess_${Date.now()}`;
  const user_input = body.user_input || body.input || null;
  const comfort = body.comfort_message || body.comfort || body.reply || null;

  if (user_input) writeConversation(sessionId, 'user', user_input);
  if (comfort) writeConversation(sessionId, 'agent', comfort);

  // Respond quickly
  res.json({ received: true });
});

// PAYPAL IPN WEBHOOK - Verify and handle payment completion
app.post("/webhook/paypal", (req, res) => {
  // Verify with PayPal (basic IPN verification)
  const verifyUrl = process.env.PAYPAL_MODE === "live"
    ? "https://www.paypal.com/cgi-bin/webscr"
    : "https://www.sandbox.paypal.com/cgi-bin/webscr";

  const verifyData = new URLSearchParams({
    cmd: "_notify-validate",
    ...req.body,
  });

  fetch(verifyUrl, {
    method: "POST",
    body: verifyData,
  })
    .then((res) => res.text())
    .then((body) => {
      if (body === "VERIFIED") {
        const { txn_id, mc_gross, mc_currency, payer_email, item_name, payment_status } = req.body;

        if (payment_status === "Completed") {
          writePayment({
            provider: "paypal",
            amount: parseFloat(mc_gross),
            currency: mc_currency,
            txnId: txn_id,
            email: payer_email,
            description: item_name,
            status: "completed",
          });
          console.log("✓ PayPal payment verified:", txn_id);
        }
      } else {
        console.warn("PayPal IPN verification failed");
      }
      res.status(200).send("OK");
    })
    .catch((error) => {
      console.error("PayPal IPN error:", error.message);
      res.status(200).send("OK"); // Always return 200 to PayPal
    });
});

// GET /payments - Read recorded payments (admin/debug endpoint - restrict in production)
app.get("/api/payments", (req, res) => {
  const payments = readPayments();
  res.json(payments);
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
initPaymentsLog();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Stripe webhook: POST /webhook/stripe`);
  console.log(`PayPal webhook: POST /webhook/paypal`);
});
