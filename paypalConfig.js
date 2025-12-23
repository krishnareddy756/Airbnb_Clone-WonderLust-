const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

// Set up the PayPal SDK environment
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not found in .env file');
  }

  // Use Sandbox environment for testing
  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

// Create PayPal client
function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

module.exports = {
  client,
  orders: checkoutNodeJssdk.orders,
};
