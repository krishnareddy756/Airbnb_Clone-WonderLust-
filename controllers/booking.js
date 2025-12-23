const Booking = require('../models/booking');
const Listing = require('../models/listing');
const { client, orders } = require('../paypalConfig');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');

// Helper: Check if dates conflict with existing bookings
const checkDateConflict = async (listingId, checkIn, checkOut) => {
  const conflictingBooking = await Booking.findOne({
    listing: listingId,
    paymentStatus: 'COMPLETED',
    $or: [
      {
        // New booking starts before existing ends
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn },
      },
    ],
  });

  return !!conflictingBooking;
};

// Create booking and initiate PayPal payment
module.exports.createBooking = async (req, res, next) => {
  try {
    const { listingId, checkInDate, checkOutDate, numberOfGuests } = req.body;

    // Validation
    if (!listingId || !checkInDate || !checkOutDate || !numberOfGuests) {
      return res.status(400).json({ message: 'Missing required booking fields' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate dates
    if (checkOut <= checkIn) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Get listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check for date conflicts
    const hasConflict = await checkDateConflict(listingId, checkIn, checkOut);
    if (hasConflict) {
      return res.status(400).json({ message: 'These dates are not available. Please choose different dates.' });
    }

    // Calculate price (price is already in USD)
    const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const pricePerNightUSD = listing.price; // Already in USD
    const totalPriceUSD = Math.round(pricePerNightUSD * numberOfNights * 100) / 100;

    // Create PayPal order
    let paypalRequest = new orders.OrdersCreateRequest();
    paypalRequest.prefer('return=representation');
    paypalRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: totalPriceUSD.toString(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: totalPriceUSD.toString(),
              },
            },
          },
          items: [
            {
              name: listing.title,
              description: `${numberOfNights} night(s) - ${listing.location}, ${listing.country}`,
              quantity: '1',
              unit_amount: {
                currency_code: 'USD',
                value: totalPriceUSD.toString(),
              },
            },
          ],
        },
      ],
      application_context: {
        brand_name: 'WonderLust',
        locale: 'en-US',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.APP_URL || 'http://localhost:3000'}/bookings/success`,
        cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/bookings/cancel`,
      },
    });

    // Execute PayPal request
    let order;
    try {
      order = await client().execute(paypalRequest);
    } catch (err) {
      console.error('PayPal API Error:', err);
      return res.status(500).json({ message: `PayPal error: ${err.message}` });
    }

    // Save pending booking with PayPal order ID
    const booking = new Booking({
      listing: listingId,
      user: req.user._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      numberOfNights,
      pricePerNight: pricePerNightUSD,
      totalPrice: totalPriceUSD,
      paypalOrderId: order.result.id,
      paymentStatus: 'PENDING',
    });

    await booking.save();

    // Return PayPal approval link
    const approvalLink = order.result.links.find((link) => link.rel === 'approve');
    if (!approvalLink) {
      return res.status(500).json({ message: 'Failed to get PayPal approval link' });
    }

    return res.json({ approvalUrl: approvalLink.href });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ message: error.message || 'Booking failed' });
  }
};

// Handle successful payment
module.exports.successBooking = async (req, res, next) => {
  try {
    const { token } = req.query; // PayPal order ID

    if (!token) {
      req.flash('error', 'Payment token not found');
      return res.redirect('/listings');
    }

    // Find pending booking by PayPal order ID
    const booking = await Booking.findOne({
      paypalOrderId: token,
      paymentStatus: 'PENDING',
    }).populate('listing user');

    if (!booking) {
      req.flash('error', 'Booking not found');
      return res.redirect('/listings');
    }

    // Capture the order
    let captureRequest = new orders.OrdersCaptureRequest(token);
    captureRequest.requestBody({});

    const captureResponse = await client().execute(captureRequest);

    if (
      captureResponse.result.status === 'COMPLETED' ||
      captureResponse.result.status === 'APPROVED'
    ) {
      // Update booking status
      booking.paymentStatus = 'COMPLETED';
      booking.updatedAt = new Date();
      await booking.save();

      req.flash('success', 'Booking confirmed! Payment successful.');
      return res.render('bookings/success', { booking });
    } else {
      booking.paymentStatus = 'FAILED';
      await booking.save();
      req.flash('error', 'Payment was not completed');
      return res.redirect('/listings');
    }
  } catch (err) {
    console.error('PayPal Capture Error:', err);
    const token = req.query.token;
    if (token) {
      const booking = await Booking.findOne({ paypalOrderId: token });
      if (booking) {
        booking.paymentStatus = 'FAILED';
        await booking.save();
      }
    }
    req.flash('error', `Payment failed: ${err.message}`);
    return res.redirect('/listings');
  }
};

// Handle cancelled payment
module.exports.cancelBooking = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (token) {
      const booking = await Booking.findOne({
        paypalOrderId: token,
        paymentStatus: 'PENDING',
      });

      if (booking) {
        booking.paymentStatus = 'CANCELLED';
        await booking.save();
      }
    }

    req.flash('error', 'Payment was cancelled. Please try again.');
    return res.render('bookings/cancel');
  } catch (err) {
    console.error('Cancel Booking Error:', err);
    req.flash('error', 'An error occurred');
    return res.redirect('/listings');
  }
};

// Get user's bookings
module.exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
      paymentStatus: 'COMPLETED',
    })
      .populate('listing')
      .sort({ createdAt: -1 });

    return res.render('users/bookings', { bookings });
  } catch (err) {
    console.error('Get Bookings Error:', err);
    req.flash('error', 'Error loading bookings');
    return res.redirect('/listings');
  }
};
