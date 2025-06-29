const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { listingSchema, reviewSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const { isLoggedIn } = require('../middleware.js');

// Middleware to validate listing
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index Route
router.get('/', wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index', { allListings });
}));

// New Route
router.get('/new', isLoggedIn, (req, res) => {
  res.render('listings/new');
});


// Create Route
router.post('/', isLoggedIn,validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect('/listings');
}));

// Show Route
router.get('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate('reviews');
  if (!listing) {
    req.flash('error', 'Listing not found');
    res.redirect('/listings');
  }
  res.render('listings/show', { listing });
}));

// Edit Route
router.get('/:id/edit',isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing not found');
    res.redirect('/listings');
  }
  res.render('listings/edit', { listing });
}));

// Update Route
router.put('/:id',isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash('success', 'Listing updated Successfully!');
  console.log('Listing updated');
  res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete('/:id', isLoggedIn,wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted Successfully!');
  console.log('Listing deleted');
  res.redirect('/listings');
}));

module.exports = router;
