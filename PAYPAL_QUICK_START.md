# 🔑 PayPal Integration Quick Start

## Your Implementation Includes:

✅ **Booking Model** - Stores all reservation details  
✅ **Date Conflict Detection** - Prevents double-booking  
✅ **Dynamic Price Calculation** - Real-time breakdown with 14% service fee  
✅ **PayPal Checkout** - Immediate redirect to PayPal Sandbox  
✅ **Success/Cancel Pages** - Professional confirmation screens  
✅ **Transaction Tracking** - Stores PayPal order & payment IDs  

---

## ⚡ Quick Setup (2 minutes)

### 1️⃣ Get Your PayPal Credentials
- Visit: https://developer.paypal.com
- Sign in → Apps & Credentials → Sandbox tab
- Copy your **Client ID** and **Secret**

### 2️⃣ Update .env File
```env
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_secret_here
PAYPAL_RETURN_URL=http://localhost:3000/bookings/success
PAYPAL_CANCEL_URL=http://localhost:3000/bookings/cancel
```

### 3️⃣ Start Server
```bash
npm install  # (if needed)
node app.js
```

### 4️⃣ Test Payment
1. Open any listing
2. Select check-in/checkout dates
3. Click Reserve
4. Pay with sandbox account on PayPal
5. See confirmation page ✨

---

## 📂 New/Modified Files

### Created Files:
- `models/booking.js` - Booking model
- `controllers/booking.js` - Payment logic
- `routes/booking.js` - Booking endpoints
- `paypalConfig.js` - PayPal config
- `views/bookings/success.ejs` - Success page
- `views/bookings/cancel.ejs` - Cancel page
- `PAYPAL_SETUP_GUIDE.md` - Full documentation

### Modified Files:
- `app.js` - Added booking router & JSON middleware
- `package.json` - Added paypal-rest-sdk
- `views/listings/show.ejs` - Updated booking form
- `public/js/script.js` - Added booking logic

---

## 🧪 Test Payment Flow

```
User selects dates → 
Click Reserve → 
Validate dates (no conflicts) →
Calculate price →
Send to PayPal →
User approves on PayPal →
Redirect to success page →
Save booking to database
```

---

## 🔗 Key Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/bookings` | Create booking, initiate PayPal payment |
| GET | `/bookings/success` | PayPal returns here after payment |
| GET | `/bookings/cancel` | PayPal returns here if user cancels |
| GET | `/bookings/my-bookings` | Get user's booking history (API) |

---

## 💾 Booking Data Stored

```javascript
{
  listing: "listing_id",
  user: "user_id",
  checkInDate: "2025-12-25",
  checkOutDate: "2025-12-27",
  numberOfGuests: 2,
  numberOfNights: 2,
  pricePerNight: 5000,
  subtotal: 10000,
  serviceFee: 1400,
  totalAmount: 11400,
  paypalOrderId: "PAYID-...",
  paypalPaymentId: "...",
  transactionId: "...",
  paymentStatus: "completed"
}
```

---

## ✨ Features Implemented

### ✅ Client Side
- Date picker with validation
- Dynamic price breakdown (real-time calculation)
- Guest counter
- Form validation
- Loading states
- Error handling

### ✅ Server Side
- Date conflict checking
- Price calculation with service fee
- PayPal API integration
- Booking persistence
- Transaction tracking
- Payment status management

### ✅ Database
- Booking schema with all required fields
- References to Listing & User
- Payment tracking fields
- Date storage for availability checking

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Missing PayPal credentials" | Add `PAYPAL_CLIENT_ID` & `PAYPAL_CLIENT_SECRET` to .env |
| "Dates already booked" | Choose different dates (system prevents double-booking) |
| "Cannot POST /bookings" | Ensure booking router is added to app.js |
| "Template not found" | Create `views/bookings/` directory with success.ejs & cancel.ejs |
| "Payment failed at PayPal" | Use valid sandbox test account from PayPal dashboard |

---

## 🚀 Production Checklist

When ready to go live:

- [ ] Change `PAYPAL_MODE` to `production`
- [ ] Use production PayPal credentials
- [ ] Update callback URLs to your live domain
- [ ] Enable HTTPS
- [ ] Test complete payment flow
- [ ] Set up email notifications
- [ ] Monitor transactions
- [ ] Create user booking history page
- [ ] Document refund policy
- [ ] Set up payment webhooks

---

## 📞 Support Resources

- **PayPal Docs:** https://developer.paypal.com/docs/
- **Sandbox Guide:** https://developer.paypal.com/docs/classic/lifecycle/sb_about/
- **Test Accounts:** https://developer.paypal.com/dashboard/ (Apps & Credentials → Accounts)

---

**Need Help?** Check `PAYPAL_SETUP_GUIDE.md` for detailed instructions!
