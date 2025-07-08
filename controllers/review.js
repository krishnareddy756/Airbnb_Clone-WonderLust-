const { model } = require('mongoose');
const Listing = require('../models/listing');
const Review = require('../models/review');
module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id; // Associate review with the logged-in user
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash('success', 'Successfully added a new review!');
  res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted the review!');
  res.redirect(`/listings/${id}`);
};

