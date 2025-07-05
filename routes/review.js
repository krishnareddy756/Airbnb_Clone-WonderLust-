const express = require('express');
const router = express.Router({ mergeParams: true }); // ✅ mergeParams to access :id
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const Review = require('../models/review');
const { reviewSchema } = require('../schema');
const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware');
// ✅ Validation middlewarec

// ✅ POST /listings/:id/reviews
router.post('/',isLoggedIn,
   validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id; // Associate review with the logged-in user
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash('success', 'Successfully added a new review!');
  res.redirect(`/listings/${listing._id}`);
}));

// ✅ DELETE /listings/:id/reviews/:reviewId
router.delete('/:reviewId', 
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted the review!');
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
