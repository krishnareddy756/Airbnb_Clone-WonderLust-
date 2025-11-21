if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const apiRouter = require('./routes/api');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require("./models/user");
const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tlsAllowInvalidCertificates: true,
  });
}

// App config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600, // time period in seconds
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // time period in seconds
});

store.on("error", function (e) {
  console.log("Session store error", e);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET, // Use the secret from .env file
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 24 * 60 * 60 * 1000 * 7, // 1 day
    maxAge: 24 * 60 * 60 * 1000 * 7, // 1 day
  },
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

// Configure Google OAuth strategy if credentials provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
    passReqToCallback: true
  }, async function(accessToken, refreshToken, profile, cb) {
    // Find or create user based on profile emails
    try {
      // first argument will be req because passReqToCallback is true
      const req = arguments[0];
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      if (!email) return cb(null, false, { message: 'No email found in Google profile' });
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({ username: profile.displayName || email, email });
        await user.save();
        // mark in session that a new user was created via Google and store profile for prefilling
        if (req && req.session) {
          req.session.wasNewGoogleUser = true;
          req.session.googleProfile = { email, displayName: profile.displayName };
        }
      }
      return cb(null, user);
    } catch (e) {
      return cb(e);
    }
  }));
}

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
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
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use('/api', apiRouter);
// --- Review Routes directly in app.js --- //

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Error handling
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

// Start server
const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
