const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { listingSchema, reviewSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const { isLoggedIn,isOwner,validateListing } = require('../middleware.js');
const listingCounteroller= require('../controllers/listings.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });


router.route('/')
.get( wrapAsync(listingCounteroller.index))
.post(
   isLoggedIn,
   
   upload.single('listing[image]'), 
   validateListing, 
     wrapAsync(listingCounteroller.createListing));


//new route
router.get('/new', isLoggedIn,listingCounteroller.renderNewForm);

router.route('/:id')
.get(wrapAsync(listingCounteroller.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingCounteroller.updateListing))
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingCounteroller.destroyListing));







// Edit Route
router.get('/:id/edit',isLoggedIn,
  isOwner,
   wrapAsync(listingCounteroller.renderEditForm));


module.exports = router;
