# PayPal Sandbox Integration Setup Guide

## 🎯 Overview
Your WonderLust Airbnb clone now has PayPal sandbox integration for processing bookings. This guide will help you set up and test the payment flow.

---

## 📋 What Was Implemented

### 1. **Database Models**
- ✅ `models/booking.js` - Tracks all booking information
  - Listing reference
  - User reference
  - Check-in/Check-out dates
  - Number of guests
  - Price breakdown (subtotal, service fee, total)
  - PayPal transaction details
  - Payment status tracking

### 2. **Backend Routes & Controllers**
- ✅ `routes/booking.js` - Booking endpoints
  - `POST /bookings` - Create booking and initiate PayPal payment
  - `GET /bookings/success` - Handle successful payment callback
  - `GET /bookings/cancel` - Handle cancelled payment
  - `GET /bookings/my-bookings` - Get user's booking history

- ✅ `controllers/booking.js` - Business logic
  - Date conflict detection (prevents double-booking)
  - Price calculation (14% service fee)
  - PayPal payment creation & execution
  - Booking validation

### 3. **Frontend**
- ✅ Updated `views/listings/show.ejs`
  - Dynamic booking form with date pickers
  - Real-time price breakdown calculation
  - Guest selection

- ✅ `views/bookings/success.ejs` - Success page after payment
- ✅ `views/bookings/cancel.ejs` - Cancellation page

- ✅ Enhanced `public/js/script.js`
  - Date picker functionality
  - Live price calculation
  - Form validation
  - PayPal API calls

### 4. **Configuration**
- ✅ `paypalConfig.js` - PayPal settings
- ✅ Updated `package.json` - Added `paypal-rest-sdk`
- ✅ Updated `app.js` - Added JSON middleware & booking routes

---

## 🔐 PayPal Sandbox Setup

### Step 1: Get PayPal Sandbox Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com)
2. Log in or create an account
3. Navigate to **Apps & Credentials**
4. Make sure you're in **Sandbox** mode (not Live)
5. Under **Default Application**, you'll find:
   - **Client ID**
   - **Secret**

### Step 2: Update Your .env File

Add these lines to your `.env` file:

```env
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret_here
PAYPAL_RETURN_URL=http://localhost:3000/bookings/success
PAYPAL_CANCEL_URL=http://localhost:3000/bookings/cancel
```

### Step 3: (Optional) Update Callback URLs

If deploying to production, update:
```env
PAYPAL_RETURN_URL=https://yourdomain.com/bookings/success
PAYPAL_CANCEL_URL=https://yourdomain.com/bookings/cancel
```

---

## 🧪 Testing the Payment Flow

### Step 1: Start Your Server
```bash
npm install  # First time only
node app.js
```

### Step 2: Create a Test Listing (if needed)
1. Register/login to your app
2. Create a new listing with a price
3. Open the listing page

### Step 3: Test Booking Flow
1. On the listing page, select:
   - Check-in date
   - Check-out date
   - Number of guests
2. Watch the price breakdown update dynamically
3. Click "Reserve" button
4. You'll be redirected to PayPal

### Step 4: Complete Sandbox Payment
1. Log in with PayPal sandbox account:
   - Email: `sb-xxxxx@personal.example.com`
   - Password: Any string (for sandbox, it doesn't matter)
   - (Find test accounts in PayPal Developer Dashboard)

2. Review payment details
3. Click "Pay Now" (or similar button)
4. You should be redirected to success page with booking confirmation

### Step 5: Verify Booking in Database
```javascript
// In your MongoDB
db.bookings.find({ user: "your_user_id" })
```

---

## 🗓️ Key Features

### ✅ Date Conflict Prevention
- System checks if selected dates are already booked
- Prevents double-booking of properties
- Only checks completed bookings

### ✅ Price Calculation
- Per-night pricing from listing
- 14% service fee (configurable)
- Real-time price updates on frontend

### ✅ Booking Information Stored
```javascript
{
  listing: ObjectId,
  user: ObjectId,
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: Number,
  numberOfNights: Number,
  pricePerNight: Number,
  subtotal: Number,
  serviceFee: Number,
  totalAmount: Number,
  paypalOrderId: String,
  paypalPaymentId: String,
  transactionId: String,
  paymentStatus: ['pending', 'completed', 'failed']
}
```

---

## 📝 Usage Examples

### For Users
1. Browse listings → Click on a listing
2. Select dates & guests
3. See price breakdown update automatically
4. Click "Reserve" → Pay via PayPal
5. Get confirmation with transaction details

### For Developers (API)
```javascript
// Create a booking
POST /bookings
{
  "listingId": "listing_id",
  "checkInDate": "2025-12-25",
  "checkOutDate": "2025-12-27",
  "numberOfGuests": 2
}

// Response: { approvalUrl: "https://www.sandbox.paypal.com/..." }

// Get user's bookings
GET /bookings/my-bookings
Authorization: Bearer user_auth_token
```

---

## 🐛 Troubleshooting

### Issue: "Invalid payment parameters"
- **Cause**: Missing PayPal credentials in `.env`
- **Fix**: Ensure `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are set

### Issue: "These dates are already booked"
- **Cause**: Date conflict with existing booking
- **Fix**: Choose different dates

### Issue: "Payment failed"
- **Cause**: Invalid test account or PayPal API error
- **Fix**: 
  1. Check PayPal sandbox credentials
  2. Try a different test account
  3. Check console for detailed error

### Issue: Redirect loop on success page
- **Cause**: View engine not properly configured
- **Fix**: Ensure `views/bookings/` directory exists

---

## 🚀 Next Steps (Optional Enhancements)

### 1. **Email Notifications**
```javascript
// Send confirmation email after successful payment
// Implement using nodemailer
```

### 2. **Refund System**
```javascript
// Allow users to cancel bookings within X days
// Automatically refund via PayPal
```

### 3. **Admin Dashboard**
```javascript
// Track all payments
// View booking analytics
// Manage refunds
```

### 4. **Multi-Currency Support**
```javascript
// Allow users to pay in different currencies
// Update paypalConfig.js with multi-currency support
```

### 5. **Payment Status Webhooks**
```javascript
// Handle asynchronous payment updates from PayPal
// Update booking status automatically
```

### 6. **Upgrade to Modern PayPal SDK**
```bash
npm install @paypal/paypal-server-sdk --save
# Then update controllers/booking.js to use new SDK
```

---

## 📚 Useful Resources

- [PayPal Developer Dashboard](https://developer.paypal.com)
- [PayPal REST API Docs](https://developer.paypal.com/docs/api/overview/)
- [PayPal SDK on npm](https://www.npmjs.com/package/paypal-rest-sdk)
- [PayPal Sandbox Testing Guide](https://developer.paypal.com/docs/classic/lifecycle/sb_about/)

---

## ✅ Checklist Before Going Live

- [ ] Update `.env` with production PayPal credentials
- [ ] Change `PAYPAL_MODE` from `sandbox` to `production`
- [ ] Update callback URLs to production domain
- [ ] Test entire booking flow in production
- [ ] Set up email notifications for bookings
- [ ] Implement refund system
- [ ] Add booking history page for users
- [ ] Set up payment monitoring/alerts
- [ ] Document refund policy for users
- [ ] Configure SSL/HTTPS for PayPal integration

---

## 🆘 Need Help?

1. Check the error message in the browser console
2. Review server logs: `node app.js`
3. Verify `.env` file has all required PayPal variables
4. Check MongoDB connection is working
5. Ensure all files exist: `models/`, `routes/`, `controllers/`, `views/bookings/`

---

**Integration completed on:** December 22, 2025

**Payment Gateway:** PayPal Sandbox REST API v1.x  
**Database:** MongoDB + Mongoose  
**Framework:** Express.js + EJS
