const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const ExpressError = require('./utils/ExpressError');

const listings = require('./routes/listing');
const reviews = require('./routes/review');

const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

main()
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// App config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  res.send('HI I AM ROOT');
});

// Use listing routes
app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);
// --- Review Routes directly in app.js --- //

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


// Error handling
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render('error', { message });
});

// Start server
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
