const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
  },
  numberOfNights: {
    type: Number,
    required: true,
    min: 1,
  },
  // Price in USD (to avoid INR/currency issues)
  pricePerNight: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  // PayPal transaction details
  paypalOrderId: {
    type: String,
    required: true,
    unique: true,
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'CANCELLED', 'FAILED'],
    default: 'PENDING',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
