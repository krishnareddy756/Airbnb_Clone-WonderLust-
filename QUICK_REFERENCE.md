# 🎯 Quick Reference - All Issues & Fixes

## ❌ Problems You Encountered

### Problem 1: Wrong PayPal Redirect URL
**Error Message:** Error during redirect / Connection timeout
```
Cause: .env had APP_URL=http://localhost:3000
       but server runs on port 8002
Result: PayPal tries to redirect to wrong port
```
**✅ FIXED:** Changed `.env` to `APP_URL=http://localhost:8002`

---

### Problem 2: "Seller doesn't accept your currency"
**Error Message:** "We're sorry. This seller doesn't accept payments in your currency"
```
Cause: Logged in with BUSINESS test account instead of PERSONAL
       OR PayPal Business account didn't have USD enabled
```
**✅ SOLUTION:** Log in with PERSONAL buyer test account when making payment

---

### Problem 3: Wishlist Popup on Reserve Button
**Error Message:** "CastError: Cast to ObjectId failed for value 'null'"
```
Cause: Reserve button was calling addToWishlist() function
       which tried to use undefined listing ID
```
**✅ FIXED:** Removed reserve button from wishlist event listener in `script.js`

---

### Problem 4: "currentUser is not defined"
**Error Message:** "ReferenceError: currentUser is not defined"
```
Cause: Navbar tried to use currentUser variable
       but it wasn't defined when req.user was null
```
**✅ FIXED:** Changed app.js to set `res.locals.currentUser = req.user || null;`

---

## 📋 All Changes Made

| File | Change | Status |
|------|--------|--------|
| `.env` | APP_URL: 3000 → 8002 | ✅ Done |
| `app.js` | currentUser default to null | ✅ Done |
| `public/js/script.js` | Removed reserve from wishlist | ✅ Done |
| `models/listing.js` | Default price 1000 → 50 USD | ✅ Done |
| `views/listings/show.ejs` | ₹ → $ | ✅ Done |
| `views/listings/index.ejs` | ₹ → $ , Removed GST | ✅ Done |
| `views/listings/new.ejs` | ₹ → $ | ✅ Done |
| `views/listings/edit.ejs` | ₹ → $ | ✅ Done |
| `controllers/booking.js` | Removed convertToUSD() | ✅ Done |
| `public/js/script.js` | Removed INR conversion | ✅ Done |
| Database | Migrated all 12 listings INR→USD | ✅ Done |

---

## 🚀 How to Test Now

### **1. Start Server**
```bash
cd c:\Users\saikr\OneDrive\Desktop\Airbnb\Airbnb_Clone-WonderLust-
node app.js
```

### **2. Open Browser**
```
http://localhost:8002/listings
```

### **3. Test Flow**
```
Login → Click Listing → Select Dates → Click Reserve 
→ PayPal → Approve (with PERSONAL account) → Success Page
```

### **4. Verify Success**
- ✅ Price shows in USD on listing ($50.00, $87.72, etc.)
- ✅ Selecting dates updates price calculation
- ✅ Clicking Reserve goes to PayPal (not wishlist)
- ✅ PayPal shows USD amount (e.g., $263.16)
- ✅ After payment, success page shows USD
- ✅ No errors in browser console (F12)
- ✅ Booking saved in database with COMPLETED status

---

## ⚠️ Most Important Points

### **For PayPal Testing:**
1. **Use PERSONAL buyer test account** (not Business)
   - Business account = Seller
   - Personal account = Buyer (for testing)

2. **Check .env has correct port**
   - ✓ APP_URL=http://localhost:8002

3. **Server must be running on 8002**
   - ✓ `node app.js` starts on port 8002

4. **All prices in USD**
   - ✓ Database, frontend, PayPal - all USD

---

## 🎓 Understanding the System

### Frontend (What User Sees)
```javascript
// Booking form on listing page
1. Date inputs → Changes trigger price calculation
2. Price calc: nights × price per night = total
3. All in USD: $35.76 × 3 nights = $106.28
4. Click "Reserve" → Send to backend
```

### Backend (What Server Does)
```javascript
1. Receives booking request
2. Validates dates and listing
3. Checks for booking conflicts
4. Creates PayPal order
5. Saves pending booking to database
6. Returns PayPal approval URL
```

### PayPal (Payment Processing)
```javascript
1. Buyer logs in with their account
2. Reviews order details (items, amount)
3. Approves payment
4. PayPal charges buyer's account
5. Redirects back to your app
```

### Success (Confirmation)
```javascript
1. Backend receives PayPal confirmation
2. Captures the payment
3. Updates booking status to COMPLETED
4. Shows success page with all details
5. User can view confirmed booking
```

---

## 🔍 Debugging Tips

### **Check if Server is Running**
Open terminal and look for:
```
Server is running on port 8002
Database connected
```

### **Check Browser Console (F12)**
Look for JavaScript errors:
```
- Network errors → Check server is running
- "approvalUrl undefined" → PayPal order creation failed
- "Cannot read property '_id'" → Not logged in
- CORS errors → Backend communication issue
```

### **Check Server Terminal**
Watch for backend errors:
```
PayPal API Error: ...
Booking error: ...
MongoDB connection error: ...
```

### **Test PayPal Credentials**
Run test script:
```bash
node test-paypal.js
```
Should show:
```
✓ Database connected
✓ PayPal Order Created Successfully!
✓ Approval Link Found: https://sandbox.paypal.com/...
```

---

## 📊 Test Scenarios

### ✅ Success Scenario
```
1. Log in successfully
2. View listing with $87.72 price
3. Select: Dec 25 check-in, Dec 28 check-out, 2 guests
4. Price updates: $87.72 × 3 nights = $263.16
5. Click "Reserve" → Redirects to PayPal
6. PayPal shows: $263.16 USD from WonderLust
7. Log in with buyer account → Approve
8. Redirected to success page
9. Success page shows: $263.16 USD total
10. Browser console: No errors
11. Database: Booking with COMPLETED status
```

### ❌ Failure Scenario 1: Wrong PayPal Account
```
1. Click Reserve
2. Redirected to PayPal
3. Log in with BUSINESS account (merchant)
4. ERROR: "This seller doesn't accept USD"
FIX: Use PERSONAL buyer account
```

### ❌ Failure Scenario 2: Wrong Port in .env
```
1. App at localhost:8002
2. .env says APP_URL=localhost:3000
3. Click Reserve → PayPal redirect URL has port 3000
4. ERROR: Connection refused (3000 not running)
FIX: Update .env to port 8002
```

### ❌ Failure Scenario 3: Not Logged In
```
1. Visit http://localhost:8002/listings/123
2. Not logged in
3. No booking form shown
4. See: "Log in to make a reservation"
FIX: Click Login → Enter credentials
```

### ❌ Failure Scenario 4: Date Conflict
```
1. Listing already booked: Dec 24-26
2. User selects: Dec 25-28
3. ERROR: "These dates are not available"
FIX: Select different dates without overlaps
```

---

## 📞 Quick Support

| Issue | Cause | Fix |
|-------|-------|-----|
| Wrong port error | .env PORT mismatch | Update to 8002 |
| "Currency not accepted" | BUSINESS account used | Use PERSONAL account |
| Wishlist popup on reserve | Old code | ✓ Already fixed |
| currentUser undefined | No default value | ✓ Already fixed |
| Dates show unavailable | Booking conflict | Choose different dates |
| Not logged in | Session expired | Log in again |
| PayPal payment fails | Wrong currency enabled | Check PayPal settings |
| Database not updating | Booking not captured | Check PayPal success callback |

---

## ✨ Final Checklist Before Testing

- [ ] `.env` updated with `APP_URL=http://localhost:8002`
- [ ] `app.js` has `res.locals.currentUser = req.user || null`
- [ ] `script.js` removed reserve from wishlist listener
- [ ] All listing prices in USD (checked database)
- [ ] All views showing `$` instead of `₹`
- [ ] PayPal credentials in `.env` are valid
- [ ] Test accounts created in PayPal Sandbox
- [ ] Server can be started with `node app.js`
- [ ] Browser can access `http://localhost:8002`

---

**Everything is ready! Your PayPal integration is now complete and ready for testing.** 🎉

Start with: `node app.js` and test the booking flow!
