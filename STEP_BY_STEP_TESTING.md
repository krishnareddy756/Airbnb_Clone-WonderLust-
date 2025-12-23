# 🧪 STEP-BY-STEP TESTING PROCESS

## Test 1: Verify All Fixes Applied

### Step 1.1: Check .env File
```bash
# Open file: c:\Users\saikr\OneDrive\Desktop\Airbnb\Airbnb_Clone-WonderLust-\.env

# Verify this line exists:
APP_URL=http://localhost:8002
# NOT: http://localhost:3000

# Also verify PayPal credentials:
PAYPAL_CLIENT_ID=AS2lVd6_fu-_T9wAZjOmmawGyl8vA9EPZfYPeNBF6h18TQnYBpMNjxKHShGFTeKYHICWzBKmwsUxENFD
PAYPAL_CLIENT_SECRET=ENGDNgmF37ds5zMZhl12OZ82TfBIwD4iJpg4oNzXqWJQsTi2qN4LCk-kxf7Fii3KEKBXZn-31302msKN
```

**Expected:** ✅ Shows localhost:8002

---

### Step 1.2: Check app.js Middleware
```bash
# Open file: c:\Users\saikr\OneDrive\Desktop\Airbnb\Airbnb_Clone-WonderLust-\app.js

# Find this code (around line 128):
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user || null;  // ← Should have: || null
  next();
});
```

**Expected:** ✅ Has `req.user || null`

---

### Step 1.3: Check script.js (Wishlist Fix)
```bash
# Open file: c:\Users\saikr\OneDrive\Desktop\Airbnb\Airbnb_Clone-WonderLust-\public\js\script.js

# Search for: "Handle Reserve button clicks"
# This section should NOT exist:
// Handle Reserve button clicks
const reserveButtons = document.querySelectorAll('.reserve-btn');
reserveButtons.forEach(btn => {
    btn.addEventListener('click', ...);
});
```

**Expected:** ✅ This section is REMOVED

---

## Test 2: Start Server

### Step 2.1: Open Terminal
```powershell
# Press Windows + R, type: powershell
# Or open PowerShell/Command Prompt
```

### Step 2.2: Navigate to Project
```bash
cd "c:\Users\saikr\OneDrive\Desktop\Airbnb\Airbnb_Clone-WonderLust-"
```

### Step 2.3: Start Server
```bash
node app.js
```

**Expected Output:**
```
[dotenv@17.0.1] injecting env (10) from .env
JHGFDSSJERHNBVD
(node:...) Warning: Accessing non-existent property 'create'...
(node:...) [MONGODB DRIVER] Warning: useNewUrlParser...
Server is running on port 8002
Database connected
```

**What This Means:**
- ✅ Server started successfully
- ✅ Listening on port 8002
- ✅ Connected to MongoDB
- ✅ Ready for testing

**If You Get Error:**
- "Cannot find module 'dotenv'" → Run `npm install`
- "Port 8002 already in use" → Run different port: `PORT=8003 node app.js`
- "Database connection failed" → Check internet connection

---

## Test 3: Access Application

### Step 3.1: Open Browser
```
Chrome, Firefox, or Edge
Type: http://localhost:8002/listings
```

**Expected:** 
```
✅ Airbnb clone homepage loads
✅ List of properties displays
✅ Each shows: Name, Image, Location, Price ($XX.XX in USD)
✅ Navbar shows "Log in" link
✅ No errors in page
```

---

## Test 4: Log In

### Step 4.1: Click "Log in" Button
```
In top-right corner of navbar
```

### Step 4.2: Enter Credentials
```
Email: wander@gmail.com
Password: (your password)
Click "Log in"
```

**Expected:**
```
✅ Logged in successfully
✅ Navbar now shows: Your username (dropdown)
✅ "Log in" link changed to your profile
✅ See: "Become a Host" link
```

**If Authentication Fails:**
- Check internet connection (MongoDB Atlas)
- Verify credentials are correct
- Try another test account

---

## Test 5: View Listing Details

### Step 5.1: Click on Any Listing
```
Example: "Casa Blanca - Private Villa"
```

**Expected Page Elements:**
```
✅ Large listing image
✅ Title: "Casa Blanca - Private Villa"
✅ Price: $87.72 (or another USD amount - NOT ₹)
✅ Location: Goa, India
✅ Description
✅ Booking form on right side with:
   - Check-in Date input (empty)
   - Check-out Date input (empty)
   - Guests dropdown (empty)
   - "Reserve" button (DISABLED/grayed out)
✅ Price breakdown section (showing $0.00)
```

---

## Test 6: Select Booking Details

### Step 6.1: Click "Check-in Date"
```
A date picker will open
Select any date (today or in future)
Example: December 25, 2025
```

### Step 6.2: Click "Check-out Date"
```
Select a date AFTER the check-in date
Example: December 28, 2025
```

### Step 6.3: Select "Number of Guests"
```
Dropdown with options: 1, 2, 3, 4, 5+
Select: 2
```

**Expected REAL-TIME Updates:**
```
✅ Price display updates immediately:
   Shows: "$87.72 x 3 nights = $261.16"
   
✅ Subtotal updates:
   Shows: "$261.16"
   
✅ Total updates:
   Shows: "$261.16"
   
✅ Reserve button becomes ENABLED (blue/red, clickable)
```

**If Button Doesn't Enable:**
- Make sure check-out date is AFTER check-in
- Make sure guests are selected
- Check browser console (F12 → Console) for errors

---

## Test 7: Click Reserve Button

### Step 7.1: Click "Reserve" Button
```
Blue/red button at bottom of booking form
```

**Expected Sequence:**
```
1. Button text changes: "Processing..."
2. Button becomes disabled
3. Loading spinner might appear
4. Within 2-3 seconds: REDIRECTED TO PAYPAL
```

**Expected URL Change:**
```
FROM: http://localhost:8002/listings/[id]
TO: https://sandbox.paypal.com/checkoutnow?token=EC-...
```

**If This Doesn't Happen:**
```
Possibilities:
1. Check browser console (F12 → Console)
2. Check server terminal for errors
3. Check "Network" tab (F12 → Network)
   - POST /bookings should return 200 OK with approvalUrl
4. If POST fails with 500, backend error
5. If POST fails with 400, validation error
```

---

## Test 8: PayPal Sandbox Payment

### Step 8.1: PayPal Login Page
```
You should see:
✅ PayPal Sandbox login form
✅ Message about "WonderLust" merchant
```

### Step 8.2: Log In with PERSONAL Buyer Account
```
⚠️ IMPORTANT: Use PERSONAL test account (NOT Business!)

Email: (your personal test account email)
Password: (your password)
Click: "Log in" or "Continue"
```

**⚠️ WRONG:**
```
Log in with Business account → Error: "Seller doesn't accept USD"
```

**✅ RIGHT:**
```
Log in with Personal buyer account → Continues to review
```

### Step 8.3: Review Order
```
PayPal shows:
✅ Merchant: WonderLust
✅ Item: "1 BHK with Sea View..."
✅ Amount: $261.16 USD  (← MUST be in USD!)
✅ Message: "Please review and confirm your purchase"
```

### Step 8.4: Approve Payment
```
Click: "Approve" or "Pay Now" or "Agree and Continue"
```

**Expected:**
```
PayPal processes payment...
(You might see "Processing..." message)
After 1-2 seconds: Redirected back to your app
```

---

## Test 9: Success Page

### Step 9.1: View Success Page
```
URL: http://localhost:8002/bookings/success?token=EC-...

Expected to see:
✅ Page Title: "Booking Confirmed!" or similar
✅ Property Name: "1 BHK with Sea View & Spacious Balcony"
✅ Check-in: Dec 25, 2025
✅ Check-out: Dec 28, 2025
✅ Guests: 2
✅ Nights: 3
✅ Price per Night: $35.76 USD  (← USD format!)
✅ Total: $263.16 USD  (← USD format!)
✅ Transaction ID: PAY-1234567890ABC (from PayPal)
✅ Booking Status: COMPLETED
```

**If Page Shows Error:**
```
- Check browser console (F12)
- Check server terminal for error logs
- PayPal might not have captured correctly
```

---

## Test 10: Verify in Database

### Step 10.1: Open MongoDB Atlas
```
Go to: https://cloud.mongodb.com/
Log in with your account
Select your cluster: Cluster0
Click "Browse Collections"
```

### Step 10.2: Find Booking
```
Database: test (or your database name)
Collection: bookings
```

**Look for Most Recent Booking:**
```
Should see document with:
{
  _id: ObjectId("..."),
  listing: ObjectId("686cedf0add9c3492c31b3b1"),  ← Matches listing ID
  user: ObjectId("..."),
  checkInDate: ISODate("2025-12-25T00:00:00Z"),
  checkOutDate: ISODate("2025-12-28T00:00:00Z"),
  numberOfGuests: 2,
  numberOfNights: 3,
  pricePerNight: 35.76,  ← Should be number in USD
  totalPrice: 263.16,    ← Should be number in USD
  paypalOrderId: "EC-...",
  paypalTransactionId: "PAY-...",
  paymentStatus: "COMPLETED",  ← ✅ COMPLETED (not PENDING)
  createdAt: ISODate("2025-12-23T...")
}
```

**Verification Points:**
```
✅ paymentStatus is "COMPLETED" (not PENDING)
✅ pricePerNight is 35.76 (number, not string)
✅ totalPrice is 263.16 (number, not string)
✅ Both prices are in USD (small numbers like 35.76, not 3576)
✅ paypalTransactionId is NOT null
```

---

## Test 11: Verify in Browser Console

### Step 11.1: Open Developer Tools
```
Press: F12 in browser
Or: Right-click → Inspect → Console tab
```

### Step 11.2: Check for Errors
```
Expected:
✅ No red error messages
✅ No "Uncaught" errors
✅ No "Cannot read property" errors

Should be clean!
```

---

## Final Verification Checklist

```
Test Passed?

[ ] .env has APP_URL=http://localhost:8002
[ ] .env has valid PayPal credentials
[ ] app.js has currentUser || null middleware
[ ] script.js removed reserve from wishlist
[ ] Server starts on port 8002
[ ] App accessible at localhost:8002
[ ] Can log in successfully
[ ] Listings show USD prices ($87.72)
[ ] Can select booking dates
[ ] Price calculates correctly
[ ] Reserve button enables after date selection
[ ] Click Reserve redirects to PayPal
[ ] PayPal shows order in USD
[ ] Can log in with PERSONAL buyer account
[ ] Can approve payment on PayPal
[ ] Redirected to success page
[ ] Success page shows USD amounts
[ ] No JavaScript errors (F12 console)
[ ] Booking saved in database
[ ] Booking has COMPLETED status
[ ] Database shows USD prices (35.76, not 3576)
```

---

## 📞 Troubleshooting by Symptoms

### **Symptom: "Seller doesn't accept your currency"**
```
Diagnosis: Logged in with Business account
Fix: Log out of PayPal, use PERSONAL buyer account
```

### **Symptom: "Cannot redirect to success page" / Connection error**
```
Diagnosis: APP_URL in .env is wrong
Fix: Change .env to APP_URL=http://localhost:8002
      Restart server
```

### **Symptom: Reserve button doesn't do anything**
```
Diagnosis: Not logged in OR JavaScript error
Fix: 1. Make sure you're logged in
     2. Open F12 → Console → look for errors
     3. Check server terminal for backend errors
```

### **Symptom: "These dates are not available"**
```
Diagnosis: Date conflict with existing booking
Fix: Select different dates without overlaps
```

### **Symptom: "currentUser is not defined" error**
```
Diagnosis: Old code in app.js
Fix: ✓ Already fixed! (app.js middleware updated)
```

### **Symptom: Wishlist popup appears when clicking Reserve**
```
Diagnosis: Old code in script.js
Fix: ✓ Already fixed! (reserve listener removed from script.js)
```

### **Symptom: Price shows ₹ instead of $**
```
Diagnosis: Old views or database still in INR
Fix: ✓ Already fixed! (all converted to USD)
```

---

## 🎯 Success Indicators

**You'll know everything works when:**

1. ✅ You can complete a booking from start to finish
2. ✅ Price calculations are correct (multiplicatio of days × price)
3. ✅ PayPal shows the correct USD amount
4. ✅ Payment processes successfully
5. ✅ Success page displays all booking details in USD
6. ✅ No errors in browser console
7. ✅ Booking appears in MongoDB with COMPLETED status
8. ✅ Database shows USD prices (small numbers like 35.76)

---

## ⏱️ Estimated Time

- Server startup: 5 seconds
- Navigation to listing: 2 seconds
- Log in: 10 seconds
- Select dates: 10 seconds
- PayPal redirect: 2 seconds
- PayPal payment: 30 seconds (including login at PayPal)
- Success page: Instant
- **Total: ~2 minutes for complete test**

---

## 🎉 Success!

If all the above tests pass, your PayPal integration is **complete and working**! 

You can now:
- Accept real bookings
- Process real PayPal payments
- Track bookings in database
- Test with different dates/prices
- Ready to go live (after connecting to Live PayPal account)

**Congratulations! 🎊**
