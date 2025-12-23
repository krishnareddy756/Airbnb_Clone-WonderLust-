# PayPal Sandbox Integration - Step-by-Step Testing Guide

## 📋 Issues Fixed
1. ✅ **APP_URL mismatch** - Updated from `localhost:3000` to `localhost:8002`
2. ✅ **Wishlist popup on Reserve** - Removed wishlist event listener from reserve button
3. ✅ **Currency issues** - All prices standardized to USD throughout the app

---

## 🚀 Complete Testing Process

### **Step 1: Start the Server**
```bash
cd c:\Users\saikr\OneDrive\Desktop\Airbnb\Airbnb_Clone-WonderLust-
node app.js
```

**Expected Output:**
```
Server is running on port 8002
Database connected
```

---

### **Step 2: Open Your Application**
```
http://localhost:8002/listings
```

You should see:
- List of all listings with USD prices (e.g., `$50.00`, `$87.72`)
- Each listing shows the price clearly

---

### **Step 3: Log In (If Not Already)**
- Click "Log in" in the top-right navbar
- Use your test account credentials:
  - Email: `wander@gmail.com` (or your created account)
  - Password: (your password)

**After login:**
- You should see your profile name in navbar
- "Log in" link should change to your username with a menu

---

### **Step 4: Click on Any Listing**
Example: Click on `Casa Blanca - Private Villa` or any listing

**You should see:**
- Large property image
- Full description
- Price per night: `$87.72` (or respective USD price)
- **Booking card** on the right with:
  - Check-in date picker
  - Check-out date picker
  - Number of guests dropdown (1-5+)
  - **Reserve** button (should be disabled initially)

---

### **Step 5: Select Booking Details**
1. **Click Check-in Date** input field
   - Select a date (today or future)
   
2. **Click Check-out Date** input field
   - Select a date (must be AFTER check-in date)
   
3. **Select Number of Guests**
   - Choose 1, 2, 3, 4, or 5+ guests

**Expected Behavior:**
- Price display updates in real-time below the form
- Shows: `$XX.XX x N nights = $TOTAL`
- **Reserve button becomes ENABLED** (no longer grayed out)

**Example:**
```
$87.72 x 3 nights
$263.16
```

---

### **Step 6: Click the RESERVE Button**

**What Should Happen:**
1. Button text changes to "Processing..."
2. Button becomes disabled
3. **You get redirected to PayPal Sandbox**

**If this doesn't happen, check the browser console:**
- Press `F12` → Console tab
- Look for error messages
- Common errors:
  - "Booking failed" - Check if dates have conflicts
  - "Error: Cannot read property '_id'" - Check if you're logged in
  - CORS errors - Ensure server is running

---

### **Step 7: PayPal Sandbox Payment**

#### **On PayPal Sandbox Login Page:**

You should see:
- PayPal Sandbox login form
- Message about WonderLust merchant

**Log in with YOUR PERSONAL BUYER TEST ACCOUNT:**

⚠️ **IMPORTANT:** Use your **PERSONAL** test account, NOT the business account!

If you don't have a personal test account:
1. Go to: https://developer.sandbox.paypal.com/
2. Click "Accounts"
3. Click "Create Account"
4. Select "Personal"
5. Create and save the email/password

**Your test accounts should be:**
- **Business:** (Your merchant account - not used for testing payments)
- **Personal:** (Created specifically for testing buyer payments)

---

#### **After PayPal Login:**

You should see:
- Order summary from WonderLust
- Property name
- Number of nights
- Total amount in **USD** (e.g., $263.16)

**Click "Pay Now" or "Approve" button**

---

### **Step 8: Booking Confirmation**

**After payment approval, you should be redirected to:**
```
http://localhost:8002/bookings/success
```

**On Success Page, you should see:**
- ✅ Booking confirmed message
- Property name
- Check-in and check-out dates
- Number of guests
- Number of nights
- **Price per night: $87.72 USD** (in USD format)
- **Total: $263.16 USD** (in USD format)
- PayPal Transaction ID

---

## 🔧 Troubleshooting

### **Issue 1: "This seller doesn't accept payments in your currency"**

**Solutions:**
1. Make sure you logged in with **PERSONAL** test account (buyer), not Business
2. In PayPal Sandbox, ensure Business account has USD currency enabled:
   - Go to Developer Dashboard → Accounts
   - Click Business account
   - Check Settings → Payment Preferences
   - Ensure USD is enabled
3. Clear browser cookies and try again

### **Issue 2: "Cannot redirect to PayPal / No approval link"**

**Check:**
1. Is `.env` updated with `APP_URL=http://localhost:8002`? ✓
2. Is server running on port 8002? (`node app.js`)
3. Check browser console for error messages
4. Check terminal where server is running for error logs

### **Issue 3: Booking button doesn't work / Page shows error**

**Check:**
1. **Are you logged in?** - You must be logged in to make a booking
2. **Are dates selected?** - Must pick check-in AND check-out dates
3. **Is check-out AFTER check-in?** - Check-out must be after check-in
4. **Are these dates available?** - Some dates might be booked already
5. **Open browser Console (F12)** - Look for JavaScript errors

### **Issue 4: "currentUser is not defined" error on page load**

**Fixed by updating app.js:**
- Change: `res.locals.currentUser = req.user;`
- To: `res.locals.currentUser = req.user || null;`
- ✓ Already done in this session

### **Issue 5: Reserve button shows "Added to Wishlist" popup**

**Fixed by:**
- Removing the reserve button from wishlist event listeners
- ✓ Already done in this session

---

## 📝 Expected Test Outcomes

### **Successful Test:**
- ✅ Log in successfully
- ✅ View listing with USD price
- ✅ Select dates and see price calculate correctly
- ✅ Reserve button enables after selecting dates
- ✅ Click Reserve → redirects to PayPal
- ✅ PayPal shows correct USD amount
- ✅ Complete payment in PayPal
- ✅ Redirected to success page
- ✅ Success page shows all booking details in USD
- ✅ Check browser console → no errors

### **Database Verification:**
```bash
# To check if booking was saved:
# In MongoDB Atlas → Collections → bookings
# You should see a new booking with:
# - paymentStatus: "COMPLETED"
# - totalPrice: number (in USD)
# - pricePerNight: number (in USD)
```

---

## 🎯 Quick Reference

| Item | Value |
|------|-------|
| App URL | http://localhost:8002 |
| Server Port | 8002 |
| Currency | USD |
| PayPal Mode | Sandbox |
| Test Account Type | Personal (Buyer) |
| Minimum Amount | $0.01 USD |

---

## 📚 PayPal Sandbox Resources

- **PayPal Developer Dashboard:** https://developer.sandbox.paypal.com/
- **Test Accounts:** Dashboard → Accounts
- **API Signature:** Your app uses REST API v2
- **Orders API:** Creating and capturing orders

---

## 🎓 What Each Component Does

**Frontend (Browser):**
- User selects dates → JavaScript calculates USD price
- Sends booking request to `/bookings` API endpoint
- Receives PayPal approval URL
- Redirects user to PayPal

**Backend (Node.js):**
- Receives booking data
- Validates dates (no conflicts, check-out > check-in)
- Queries database for listing details
- Creates PayPal order with USD amount
- Saves pending booking to database
- Returns approval URL

**PayPal:**
- Displays payment to buyer
- Authenticates user
- Captures payment
- Redirects to your success URL

**Success Endpoint:**
- Receives token from PayPal
- Captures the order
- Marks booking as COMPLETED
- Updates database
- Renders success page with booking details

---

**Status:** ✅ All fixes applied. Ready to test!
