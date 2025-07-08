const express = require('express');
const router = express.Router({ mergeParams: true }); // ✅ mergeParams to access :id
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const Review = require('../models/review');
const { reviewSchema } = require('../schema');
const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware');
const reviewController = require('../controllers/review');
// ✅ Validation middlewarec

// ✅ POST /listings/:id/reviews
router.post('/',isLoggedIn,
   validateReview, wrapAsync(reviewController.createReview));

// ✅ DELETE /listings/:id/reviews/:reviewId
router.delete('/:reviewId', 
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview));

module.exports = router;
