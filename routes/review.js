const express = require('express');
const router = express.Router({ mergeParams: true }); // ✅ mergeParams to access :id
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const Review = require('../models/review');
const { reviewSchema } = require('../schema');

// ✅ Validation middleware
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// ✅ POST /listings/:id/reviews
router.post('/', validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash('success', 'Successfully added a new review!');
  res.redirect(`/listings/${listing._id}`);
}));

// ✅ DELETE /listings/:id/reviews/:reviewId
router.delete('/:reviewId', wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted the review!');
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
