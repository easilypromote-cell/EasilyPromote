const Paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

async function initializeTransaction({ email, amount, reference, metadata, callback_url }) {
  const result = await Paystack.transaction.initialize({
    email,
    amount: Math.round(amount * 100),
    reference,
    metadata: metadata || {},
    callback_url: callback_url || process.env.PAYSTACK_CALLBACK_URL,
  });
  return result.data;
}

async function verifyTransaction(reference) {
  const result = await Paystack.transaction.verify(reference);
  return result.data;
}

async function createRecipient({ name, type, account_number, bank_code }) {
  const result = await Paystack.transfer.create_recipient({
    name,
    type: type || "nuban",
    account_number,
    bank_code,
  });
  return result.data;
}

async function initiateTransfer({ source, amount, recipient, reference, reason }) {
  const result = await Paystack.transfer.initiate({
    source: source || "balance",
    amount: Math.round(amount * 100),
    recipient,
    reference,
    reason: reason || "Creator payout",
  });
  return result.data;
}

function verifyWebhookSignature(payload, signature) {
  const crypto = require("crypto");
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(payload))
    .digest("hex");
  return hash === signature;
}

module.exports = {
  initializeTransaction,
  verifyTransaction,
  createRecipient,
  initiateTransfer,
  verifyWebhookSignature,
};
