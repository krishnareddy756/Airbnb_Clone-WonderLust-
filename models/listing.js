const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename: String,
  },
  price: {
    type: Number,
    default: 50, // Price in USD
  },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],

  owner:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  // category: {
  //   type: String,
  //   enum: ['apartment', 'house', 'cottage', 'villa', 'bungalow'],
  //   required: true,
  // },
});

// Middleware: Delete all reviews associated with a listing when it is deleted
listingSchema.post('findOneAndDelete', async function (listing) {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
