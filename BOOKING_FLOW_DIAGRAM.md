# PayPal Booking Flow - Visual Guide

## 🔄 Complete Booking Process Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
└─────────────────────────────────────────────────────────────────┘

1. VIEW LISTING
   └─→ http://localhost:8002/listings/[ID]
       ├─→ Shows listing details
       ├─→ Shows price: $87.72 (USD)
       └─→ Shows booking form (if logged in)

2. SELECT BOOKING DETAILS
   ├─→ Pick Check-in Date: Dec 25, 2025
   ├─→ Pick Check-out Date: Dec 28, 2025
   ├─→ Select Guests: 2
   └─→ JavaScript calculates:
       ├─→ Nights = 3
       ├─→ Price = $87.72 × 3 = $263.16 (USD)
       └─→ Display: "$87.72 x 3 nights = $263.16"

3. CLICK "RESERVE" BUTTON
   └─→ JavaScript sends POST request to backend

┌─────────────────────────────────────────────────────────────────┐
│                    YOUR NODE.JS SERVER                           │
│                    (localhost:8002)                              │
└─────────────────────────────────────────────────────────────────┘

4. BACKEND PROCESSING (POST /bookings)
   ├─→ Receives booking data:
   │   ├─→ listingId: 686cedf0add9c3492c31b3b1
   │   ├─→ checkInDate: 2025-12-25
   │   ├─→ checkOutDate: 2025-12-28
   │   └─→ numberOfGuests: 2
   │
   ├─→ Validation:
   │   ├─→ ✓ All fields present?
   │   ├─→ ✓ Check-out > Check-in?
   │   └─→ ✓ Dates not already booked?
   │
   ├─→ Get Listing from Database:
   │   ├─→ Query: Listing.findById(listingId)
   │   └─→ Get: title, price ($35.76 USD), etc.
   │
   ├─→ CREATE PAYPAL ORDER
   │   ├─→ Call: client().execute(paypalRequest)
   │   ├─→ Send to PayPal:
   │   │   ├─→ Intent: CAPTURE
   │   │   ├─→ Currency: USD
   │   │   ├─→ Amount: $263.16
   │   │   ├─→ Item: "1 BHK with Sea View..."
   │   │   ├─→ Return URL: http://localhost:8002/bookings/success
   │   │   └─→ Cancel URL: http://localhost:8002/bookings/cancel
   │   │
   │   └─→ Receive from PayPal:
   │       ├─→ Order ID: EC-12345ABCDE...
   │       ├─→ Status: CREATED
   │       └─→ Approval Link: https://sandbox.paypal.com/checkoutnow?token=EC-...
   │
   ├─→ SAVE PENDING BOOKING TO DATABASE
   │   └─→ Create Booking document:
   │       ├─→ listing: 686cedf0add9c3492c31b3b1
   │       ├─→ user: 6948c43d4323eb5beedfa14d
   │       ├─→ checkInDate: 2025-12-25
   │       ├─→ checkOutDate: 2025-12-28
   │       ├─→ numberOfNights: 3
   │       ├─→ pricePerNight: 35.76 (USD)
   │       ├─→ totalPrice: 263.16 (USD)
   │       ├─→ paypalOrderId: EC-12345ABCDE...
   │       └─→ paymentStatus: PENDING
   │
   └─→ SEND RESPONSE TO BROWSER:
       {
         "approvalUrl": "https://sandbox.paypal.com/checkoutnow?token=EC-..."
       }

┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
└─────────────────────────────────────────────────────────────────┘

5. REDIRECT TO PAYPAL
   └─→ window.location.href = approvalUrl
       └─→ Browser goes to PayPal Sandbox...

┌─────────────────────────────────────────────────────────────────┐
│                      PAYPAL SANDBOX                              │
│                  (sandbox.paypal.com)                            │
└─────────────────────────────────────────────────────────────────┘

6. PAYPAL LOGIN PAGE
   ├─→ Shows: "Log in to your PayPal account"
   ├─→ User enters:
   │   ├─→ Email: buyer@paypal.com (PERSONAL buyer account)
   │   ├─→ Password: (buyer password)
   │   └─→ Click "Log in"
   │
   └─→ ⚠️  WRONG: Using Business account → Currency error!
       └─→ ✅ RIGHT: Using Personal buyer account

7. PAYPAL REVIEW & APPROVE
   ├─→ Shows payment summary:
   │   ├─→ Merchant: WonderLust
   │   ├─→ Item: "1 BHK with Sea View..."
   │   ├─→ Amount: $263.16 USD
   │   └─→ "Approve this purchase?" button
   │
   └─→ User clicks "Approve" or "Pay Now"

8. PAYPAL PROCESSES PAYMENT
   ├─→ Charges buyer: $263.16 USD
   ├─→ Transfers to seller (merchant account)
   └─→ Generates transaction ID: PAY-1234567890ABCD

┌─────────────────────────────────────────────────────────────────┐
│                    YOUR NODE.JS SERVER                           │
│                    (localhost:8002)                              │
└─────────────────────────────────────────────────────────────────┘

9. PAYPAL REDIRECTS BACK
   └─→ Redirects to: http://localhost:8002/bookings/success?token=EC-...
       ├─→ Server receives token (PayPal Order ID)
       │
       ├─→ CAPTURE PAYMENT
       │   ├─→ Call: client().execute(captureRequest)
       │   ├─→ Send Order ID to PayPal: EC-...
       │   └─→ PayPal confirms capture: SUCCESS
       │
       ├─→ UPDATE BOOKING IN DATABASE
       │   └─→ Find booking by paypalOrderId: EC-...
       │       └─→ Update:
       │           ├─→ paymentStatus: COMPLETED ✓
       │           ├─→ paypalTransactionId: PAY-...
       │           └─→ completedAt: 2025-12-23T10:30:00Z
       │
       └─→ RENDER SUCCESS PAGE
           └─→ Pass booking data to view: show.ejs

┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
└─────────────────────────────────────────────────────────────────┘

10. SUCCESS PAGE DISPLAYED
    ├─→ URL: http://localhost:8002/bookings/success
    │
    ├─→ Shows:
    │   ├─→ ✅ Booking Confirmed!
    │   ├─→ Property: "1 BHK with Sea View & Spacious Balcony"
    │   ├─→ Location: Goa, India
    │   ├─→ Check-in: Dec 25, 2025
    │   ├─→ Check-out: Dec 28, 2025
    │   ├─→ Guests: 2
    │   ├─→ Nights: 3
    │   ├─→ Price per night: $35.76 USD
    │   ├─→ Total: $263.16 USD
    │   └─→ Transaction ID: PAY-1234567890ABCD
    │
    └─→ User can see booking confirmed in USD ✓

┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                              │
└─────────────────────────────────────────────────────────────────┘

11. DATABASE PERSISTENCE
    └─→ Booking Collection now contains:
        {
          _id: 6948d95b080efb95eaf86233,
          listing: 686cedf0add9c3492c31b3b1,
          user: 6948c43d4323eb5beedfa14d,
          checkInDate: 2025-12-25T00:00:00.000Z,
          checkOutDate: 2025-12-28T00:00:00.000Z,
          numberOfGuests: 2,
          numberOfNights: 3,
          pricePerNight: 35.76,  ← USD
          totalPrice: 263.16,     ← USD
          paypalOrderId: "EC-12345ABCDE",
          paypalTransactionId: "PAY-1234567890ABCD",
          paymentStatus: "COMPLETED",
          createdAt: 2025-12-23T10:30:00.000Z
        }
```

---

## 🔴 Error Handling Flow

### Error 1: Currency Mismatch
```
User clicks Reserve
    ↓
Backend creates PayPal Order (USD currency)
    ↓
User redirected to PayPal
    ↓
❌ User logs in with BUSINESS test account
    ↓
PayPal Error: "This seller doesn't accept payments in your currency"
    ↓
Payment Failed
```

**Fix:** Log in with PERSONAL buyer account, not Business

---

### Error 2: Wrong Redirect URL
```
.env has: APP_URL=http://localhost:3000
    ↓
Backend creates PayPal order with return URL: localhost:3000/bookings/success
    ↓
User approves payment on PayPal
    ↓
❌ PayPal tries to redirect to localhost:3000 (WRONG PORT)
    ↓
Connection Refused (port 3000 not running)
```

**Fix:** Update .env to `APP_URL=http://localhost:8002` ✓

---

### Error 3: Date Conflict
```
User selects dates: Dec 25-28
    ↓
Backend checks for conflicts:
    Existing booking: Dec 24-26 (OVERLAPS!)
    ↓
❌ checkDateConflict returns true
    ↓
Response: "These dates are not available"
    ↓
Booking FAILED
```

**Fix:** User selects different dates (no overlaps)

---

### Error 4: Not Logged In
```
User visits /listings/123
    ↓
Not logged in
    ↓
Shows: "Log in to make a reservation"
    ↓
❌ No booking form shown
    ↓
No Reserve button visible
```

**Fix:** Click "Log in" → Enter credentials → Try again

---

## 💾 Database Queries

### Check if Booking Was Saved
```javascript
// In MongoDB Atlas Console:
db.bookings.findOne({
  paymentStatus: "COMPLETED"
})

// Should return:
{
  _id: ObjectId("..."),
  listing: ObjectId("686cedf0add9c3492c31b3b1"),
  user: ObjectId("6948c43d4323eb5beedfa14d"),
  checkInDate: ISODate("2025-12-25T00:00:00Z"),
  checkOutDate: ISODate("2025-12-28T00:00:00Z"),
  numberOfGuests: 2,
  numberOfNights: 3,
  pricePerNight: 35.76,
  totalPrice: 263.16,
  paypalOrderId: "EC-12345ABCDE",
  paypalTransactionId: "PAY-1234567890ABCD",
  paymentStatus: "COMPLETED",
  createdAt: ISODate("2025-12-23T10:30:00Z")
}
```

### Check Listing Prices (Should be USD)
```javascript
db.listings.find().limit(3)

// Should show:
[
  { title: "Casa Blanca", price: 87.72 },      // USD
  { title: "Maria villa", price: 49.51 },      // USD
  { title: "Sea View", price: 35.76 }          // USD
]
```

---

## ✅ Success Checklist

- [ ] Server running on port 8002
- [ ] App accessible at http://localhost:8002
- [ ] Logged in with test account
- [ ] Listing shows price in USD format
- [ ] Can select dates and see price calculate
- [ ] Reserve button enables after date selection
- [ ] Click Reserve → redirected to PayPal
- [ ] Logged in with PERSONAL buyer account (not Business)
- [ ] PayPal shows correct USD amount
- [ ] Clicked "Approve" on PayPal
- [ ] Redirected back to success page
- [ ] Success page shows booking in USD
- [ ] No errors in browser console (F12)
- [ ] MongoDB shows booking with COMPLETED status

---

## 📞 Quick Help

**Issue:** "This seller doesn't accept USD"
→ Use PERSONAL buyer test account at PayPal

**Issue:** "Cannot redirect to success page"
→ Check .env: `APP_URL=http://localhost:8002`

**Issue:** "Dates not available"
→ Select different dates with no conflicts

**Issue:** "Cannot make booking"
→ Make sure you're logged in first

**Issue:** "Reserve shows wishlist popup"
→ Bug fixed! Reserve button now separate from wishlist

---

**Ready to test?** Start your server and follow the flow above! 🚀
