# PayPal Integration - Testing & Debugging Guide

## Prerequisites Checklist

Before testing, make sure:

- [ ] You have a PayPal Developer account
- [ ] You have Sandbox Client ID & Secret
- [ ] Both values are added to `.env` file
- [ ] `npm install` has been run (to install PayPal SDK)
- [ ] No syntax errors in the code (`npm test` or check console)
- [ ] MongoDB is connected (you see "Database connected" message)
- [ ] Server starts without errors

---

## Step-by-Step Testing

### 1. Start Your Server

```bash
node app.js
```

You should see:
```
Server is running on port 8002
Database connected
```

### 2. Create a Test Listing

1. Go to http://localhost:3000
2. Log in to your account
3. Create a new listing with:
   - Title: "Test Property"
   - Price: ₹5000 (or any amount)
   - Location: Any city
   - Upload an image
4. Save the listing

### 3. Open the Listing Details Page

1. Click on your newly created listing
2. Scroll down to the booking form
3. You should see:
   - Check-in date input
   - Check-out date input
   - Guests dropdown
   - Price display in USD

### 4. Test Price Calculation

1. **Select Check-in Date**: Click input and choose tomorrow's date
2. **Select Check-out Date**: Click input and choose 3 days from now
3. **Select Guests**: Choose "2 guests"
4. **Observe Price**:
   - Should show: "₹5000 × 2 nights" (or your listing price)
   - Total USD should display
   - "Reserve" button should become enabled

**Example:**
```
Price per night: $60.00 USD
Number of nights: 2
Total: $120.00 USD
```

### 5. Click Reserve (First Time - Will Show Error)

If this is your **first time** and PayPal credentials are missing/invalid:

**Expected Error:**
```
Error: PayPal credentials not found in .env file
```

**Solution:**
- Add the credentials to `.env` and restart the server

### 6. Successful PayPal Redirect

Once credentials are correct, clicking "Reserve":

1. Page will show: "Processing..."
2. You'll be redirected to PayPal Sandbox
3. You'll see login page for sandbox.paypal.com

### 7. PayPal Sandbox Payment

1. **Login**: Use the test buyer account (pre-filled, usually)
2. **Review Order**: You should see:
   - Property name
   - USD amount
   - Number of nights
3. **Approve Payment**: Click "Pay Now" or "Approve"
4. **Redirect**: You'll be taken back to your site

### 8. Success Page

You should see a confirmation page with:

```
✓ Booking Confirmed!
Property: Test Property
Location: [City, Country]
Check-in: [Date]
Check-out: [Date]
Number of Guests: 2
Number of Nights: 2
Price per Night: $60.00 USD
Total Amount Paid: $120.00 USD
Transaction ID: [PayPal Order ID]
```

### 9. Verify Database Entry

1. Open MongoDB Compass or your MongoDB client
2. Go to database: `your_database_name`
3. Go to collection: `bookings`
4. You should see a new document with:
   ```json
   {
     "listing": ObjectId("..."),
     "user": ObjectId("..."),
     "checkInDate": "2025-12-26T00:00:00.000Z",
     "checkOutDate": "2025-12-28T00:00:00.000Z",
     "numberOfGuests": 2,
     "numberOfNights": 2,
     "pricePerNight": 60,
     "totalPrice": 120,
     "paypalOrderId": "...",
     "paymentStatus": "COMPLETED"
   }
   ```

### 10. Test Date Blocking

1. Go back to the same listing
2. Try to book the **same dates** again
3. You should get error:
```
❌ These dates are not available. Please choose different dates.
```

---

## Common Testing Issues & Solutions

### Issue 1: "Processing..." hangs, nothing happens

**Symptoms**: Button shows "Processing..." but no PayPal redirect

**Solutions**:
1. Check browser console (F12 → Console tab)
2. Look for error messages
3. Check server console for errors
4. Verify PayPal credentials in `.env` are correct
5. Restart server if you just added `.env` values

### Issue 2: PayPal shows "Client ID is invalid"

**Symptoms**: Error on PayPal sandbox page

**Solutions**:
1. Copy Client ID from PayPal Dashboard again
2. Make sure there are no extra spaces
3. Verify you're copying from **Sandbox**, not Live
4. Clear browser cache and try again
5. Restart your server

### Issue 3: Payment processes but no success page

**Symptoms**: Approved payment but stuck or error appears

**Solutions**:
1. Check server console for errors
2. Verify MongoDB is connected
3. Check that booking model is correct
4. Ensure `/bookings/success` route exists
5. Check browser network tab for failed requests

### Issue 4: Date validation fails

**Symptoms**: "Check-out date must be after check-in date"

**Solutions**:
1. Make sure you're selecting a later date for checkout
2. Use separate clicks for each date
3. Check browser console for date format issues

### Issue 5: Amount shows as $0.00

**Symptoms**: Price calculation not working

**Solutions**:
1. Verify listing price exists
2. Check that conversion rate is correct (0.012)
3. Verify JavaScript is running (check console)
4. Try refreshing the page

---

## Browser Console Debugging

Open Developer Tools (F12) and check:

### Console Tab
Look for errors like:
```
Error: Cannot read property '_id' of undefined
Error: Failed to fetch /bookings
Uncaught SyntaxError: ...
```

### Network Tab
1. Click "Reserve"
2. Watch for POST request to `/bookings`
3. Should return `{"approvalUrl": "https://sandbox.paypal.com..."}`
4. Check response - if error, it will show error message

### Application Tab
Check:
1. Local Storage - should see your session
2. Cookies - should see session cookie

---

## Server Console Debugging

When testing, watch the server console for:

### Successful Booking Creation
```
PayPal Order Created: 4X***ABC
Booking saved with status: PENDING
```

### Payment Capture Success
```
Payment captured successfully
Booking updated: COMPLETED
```

### Errors to Look For
```
Error: PayPal credentials not found
Error: Date conflict detected
Error: Invalid order ID
```

---

## Test Scenarios

### Scenario 1: Happy Path (Everything Works)
✅ Create listing
✅ Select dates
✅ Click Reserve
✅ Approve payment
✅ See confirmation
✅ Booking in database

### Scenario 2: Date Conflict
✅ First booking succeeds
✅ Try booking same dates
✅ See error message
❌ Booking not created

### Scenario 3: Payment Cancelled
✅ Click Reserve
✅ At PayPal, click "Cancel"
✅ Redirected to cancel page
❌ Booking saved as CANCELLED (not COMPLETED)

### Scenario 4: Invalid Dates
✅ Select checkout date = checkin date
✅ Reserve button disabled (or error shown)
❌ PayPal never opened

---

## Advanced Debugging

### 1. Enable Logging

Add this to top of `controllers/booking.js`:

```javascript
const DEBUG = true;

if (DEBUG) console.log('Creating booking...', { listingId, checkInDate, checkOutDate });
```

### 2. Check PayPal SDK Version

In your terminal:
```bash
npm list @paypal/checkout-server-sdk
```

Should show: `@paypal/checkout-server-sdk@1.0.1` or later

### 3. Verify Environment Variables

Create a test file `test-env.js`:

```javascript
require('dotenv').config();

console.log('PAYPAL_CLIENT_ID:', process.env.PAYPAL_CLIENT_ID);
console.log('PAYPAL_CLIENT_SECRET:', process.env.PAYPAL_CLIENT_SECRET ? '✓ Found' : '✗ Missing');
console.log('APP_URL:', process.env.APP_URL);
```

Run: `node test-env.js`

Should output:
```
PAYPAL_CLIENT_ID: AW...
PAYPAL_CLIENT_SECRET: ✓ Found
APP_URL: http://localhost:3000
```

---

## Sandbox Test Accounts

PayPal provides test accounts in your dashboard:

**Buyer Account** (for testing payments):
- Usually format: `sb-xxxxx@personal.example.com`
- Password: Pre-generated, check dashboard
- Use this to approve payments

**Seller Account** (to receive payments):
- Usually format: `sb-xxxxx@business.example.com`
- This is YOUR app's account

---

## Reset Booking for Re-testing

To test the same dates again, delete the booking:

```bash
# In MongoDB Compass:
# Go to Collections > bookings
# Find the booking document
# Right-click > Delete Document
```

Or via terminal:
```bash
db.bookings.deleteOne({ paypalOrderId: "XXXXX" })
```

---

## Success Indicators

✅ All working if you see:
1. USD prices displayed (not INR)
2. "Reserve" button becomes enabled after date selection
3. PayPal Sandbox opens on click
4. Booking appears in database after payment
5. Date blocking prevents double-booking
6. Success page shows confirmation

---

## Need More Help?

Check these files for details:
- `PAYPAL_INTEGRATION_FINAL.md` - Setup guide
- `IMPLEMENTATION_CHECKLIST.md` - What was built
- `controllers/booking.js` - Business logic
- `paypalConfig.js` - PayPal setup
- Browser console (F12) - JavaScript errors
- Server console - Backend errors
