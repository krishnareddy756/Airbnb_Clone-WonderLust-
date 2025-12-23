const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware');
const bookingController = require('../controllers/booking');

// Create booking and initiate PayPal payment
router.post(
  '/',
  isLoggedIn,
  bookingController.createBooking
);

// Handle successful payment
router.get(
  '/success',
  wrapAsync(bookingController.successBooking)
);

// Handle cancelled payment
router.get(
  '/cancel',
  wrapAsync(bookingController.cancelBooking)
);

// Get user's bookings
router.get(
  '/my-bookings',
  isLoggedIn,
  bookingController.getUserBookings
);

module.exports = router;
