if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
console.log(process.env.SECRET);
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash =  require('connect-flash');
const listingRouter = require('./routes/listing');
const reviewRouter = require('./routes/review');
const userRouter= require('./routes/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');
const dbUrl=process.env.ATLASDB_URL;
main()
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tlsAllowInvalidCertificates: true
});

}

// App config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600, // time period in seconds
  crypto: {
    secret: process.env.SECRET ,
  },
  touchAfter:24 * 3600, // time period in seconds
}) ;

store.on('error', function(e) {
  console.log('Session store error', e);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET, // Use the secret from .env file
  resave: false, 
  saveUninitialized: true, 
  cookie: {
    httpOnly: true, 
    expires: Date.now() + 24 * 60 * 60 * 1000*7, // 1 day
    maxAge: 24 * 60 * 60 * 1000*7 // 1 day
  }
};

// app.get('/', (req, res) => {
//   res.send('HI I AM ROOT');
// });
// // Middleware for session and flash messages


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user; // Make currentUser available in all templates

  next();
});
// app.get('/demouser', async (req, res) => {
//   let fakeUser = new User({
//     email: 'abc@gmail.com',
//     username: 'demo'
//   });

//  let registereduser=await User.register(fakeUser, 'helloworld') ;
//   res.send(registereduser);
// });


// Use listing routes
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);
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
