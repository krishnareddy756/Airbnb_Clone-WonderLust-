const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { listingSchema, reviewSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const { isLoggedIn,isOwner,validateListing } = require('../middleware.js');

// Middleware to validate listing


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
  newListing.owner = req.user._id; // Set the owner to the current user
  await newListing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect('/listings');
}));

// Show Route
router.get('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path:'reviews',
    populate: {
      path: 'author',
    },
  }).populate('owner');
  if (!listing) {
    req.flash('error', 'Listing not found');
    res.redirect('/listings');
  }
  console.log(listing);
  res.render('listings/show', { listing });
}));

// Edit Route
router.get('/:id/edit',isLoggedIn,
  isOwner,
   wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing not found');
    res.redirect('/listings');
  }
  res.render('listings/edit', { listing });
}));

// Update Route
router.put('/:id',isLoggedIn
  ,isOwner,
  validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash('success', 'Listing updated Successfully!');
  console.log('Listing updated');
  res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete('/:id', isLoggedIn,
  isOwner,wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted Successfully!');
  console.log('Listing deleted');
  res.redirect('/listings');
}));

module.exports = router;
