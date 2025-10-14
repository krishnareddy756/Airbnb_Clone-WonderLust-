const { model } = require('mongoose');
const Listing = require('../models/listing');
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
/**
 * GET /listings
 * Supports optional query params for searching and pagination:
 *  - location: text search against `location` and `title` (case-insensitive)
 *  - minPrice: minimum price (number)
 *  - maxPrice: maximum price (number)
 *  - page: pagination page (1-based)
 * Example: /listings?location=goa&minPrice=500&maxPrice=2000&page=2
 */
module.exports.index = async (req, res) => {
  const { location, minPrice, maxPrice } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = 12; // listings per page

  // Build query object
  const query = {};

  if (location && location.trim() !== '') {
    const safe = location.trim();
    // Case-insensitive partial match on location or title
    query.$or = [
      { location: { $regex: safe, $options: 'i' } },
      { title: { $regex: safe, $options: 'i' } }
    ];
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice && !isNaN(minPrice)) query.price.$gte = Number(minPrice);
    if (maxPrice && !isNaN(maxPrice)) query.price.$lte = Number(maxPrice);
    // If price object is empty, remove it
    if (Object.keys(query.price).length === 0) delete query.price;
  }

  // Count matching documents for pagination
  const total = await Listing.countDocuments(query);
  const allListings = await Listing.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  res.render('listings/index', {
    allListings,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalResults: total,
    query: { location, minPrice, maxPrice }
  });
};
module.exports.renderNewForm = (req, res) => {
  res.render('listings/new');
};
module.exports.showListing = async (req, res) => {
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
};
module.exports.createListing = async (req, res) => {
  let response=await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })  .send()



  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // Set the owner to the current user
  newListing.image = { url, filename }; // Set the image field with the uploaded file details
  newListing.geometry = response.body.features[0].geometry; // Set the geometry field with the geocoding response
  let savedListing=await newListing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect('/listings');
};
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing not found');
    res.redirect('/listings');
  }
  let originalImageUrl=listing.image.url
  originalImageUrl=originalImageUrl.replace('/upload','/upload/h_300,w_300,c_fill');
  res.render('listings/edit', { listing ,originalImageUrl});
};
module.exports.updateListing =async (req, res) => {
  let { id } = req.params;
  let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file!=='undefined') {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash('success', 'Listing updated Successfully!');
  console.log('Listing updated');
  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted Successfully!');
  console.log('Listing deleted');
  res.redirect('/listings');
};

