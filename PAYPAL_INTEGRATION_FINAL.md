# PayPal Integration Setup Guide

## Step 1: Get Your PayPal Sandbox Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com)
2. Sign in with your PayPal account (create one if you don't have it)
3. Click on **Apps & Credentials** (in the left menu)
4. Make sure you're in the **Sandbox** tab (not Live)
5. Under **REST API apps**, find **Default Application**
6. You'll see:
   - **Client ID** (copy this)
   - **Secret** (click "Show" to reveal it and copy)

## Step 2: Update Your .env File

Add these variables to your `.env` file:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=your_sandbox_secret_here
PAYPAL_MODE=sandbox

# Application URL (for PayPal return URLs)
APP_URL=http://localhost:3000
```

### Example:
```env
PAYPAL_CLIENT_ID=AWgVe_8-zQ7Kx9y2l5m8n3p0q1r2s3t4u5v6w7x8y9z0a1b2c3d4e5f6g7h8i9j
PAYPAL_CLIENT_SECRET=EKxQ7R9s2t3u4v5w6x7y8z9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t
PAYPAL_MODE=sandbox
APP_URL=http://localhost:3000
```

## Step 3: Install Dependencies

```bash
npm install
```

This will install the PayPal SDK that was added to `package.json`.

## Step 4: Restart Your Server

```bash
node app.js
```

## Step 5: Create a Test Listing

1. Log in to your app
2. Create a listing with a price (e.g., 5000 INR)
3. Open the listing page

## Step 6: Test the Booking Flow

1. **Select Dates**: Pick check-in and check-out dates (at least 1 night)
2. **Select Guests**: Choose number of guests
3. **Watch Price Update**: The price in USD should update automatically
4. **Click Reserve**: Button should redirect you to PayPal Sandbox

## Step 7: PayPal Sandbox Payment

1. You'll see PayPal Sandbox login
2. Use test account credentials (provided by PayPal, usually pre-filled)
3. Click "Pay Now"
4. You should be redirected back to your app's success page

## Step 8: Verify Booking

Check your MongoDB database:
- A new `Booking` document should be created
- Status should be `COMPLETED`
- Dates should be blocked from other bookings

## Troubleshooting

### Issue: "PayPal credentials not found"
**Solution**: Make sure you've added `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` to `.env`

### Issue: "Currency code not supported"
**Solution**: This is fixed! We're using USD now, not INR

### Issue: "Invalid order amount"
**Solution**: Check that the converted amount is valid USD (e.g., $5.00, not $0.05)

### Issue: "Approval link not found"
**Solution**: Check PayPal credentials in `.env` - they might be incorrect

### Issue: Booking not being created
**Solution**: Check MongoDB connection and make sure booking dates don't conflict

## What's Happening Behind the Scenes

1. **User selects dates** → Frontend calculates INR to USD (0.012 conversion rate)
2. **User clicks Reserve** → POST request to `/bookings` with booking data
3. **Backend validates**:
   - Dates are valid
   - No conflicts with existing bookings
   - All required fields present
4. **PayPal order created** in Sandbox with USD amount
5. **User redirected** to PayPal for payment approval
6. **User approves** payment on PayPal
7. **PayPal redirects** back to `/bookings/success?token=ORDER_ID`
8. **Backend captures** payment and creates booking
9. **User sees confirmation** page with booking details

## Currency Conversion

The app converts INR (listing price) to USD for PayPal:

```
USD Price = INR Price × 0.012
```

Example:
- ₹5,000 × 0.012 = $60.00 USD

**Note**: Adjust the conversion rate in `controllers/booking.js` (line 11) if needed:
```javascript
const conversionRate = 0.012; // Change this value
```

## Testing Sandbox Credentials

If you need test buyer/seller accounts:
1. Go to PayPal Developer Dashboard
2. Click **Accounts** (in left menu)
3. You should see pre-created test accounts
4. Use the **buyer account** to test payments
5. Use the **seller account** to receive payments

## Next Steps

- ✅ Booking model created
- ✅ PayPal integration complete
- ✅ Date conflict prevention
- ✅ Price calculation (INR to USD)
- ✅ Real-time price updates
- ✅ Success/Cancel pages

Optional features you can add:
- [ ] Booking cancellation
- [ ] Email confirmations
- [ ] Host notifications
- [ ] Booking history page
- [ ] Reviews after booking
- [ ] Refund handling
