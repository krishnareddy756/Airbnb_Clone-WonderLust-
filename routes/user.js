const express = require('express');
const router = express.Router(); 
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl, isLoggedIn } = require('../middleware');
const userController = require('../controllers/user');
router.route('/signup')
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));
   
router.route('/login')
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true,
        }),
        userController.login
    );


router.get('/logout',userController.logout);

// Google OAuth routes
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }),
        (req, res) => {
            // If a new user was created during Google OAuth, redirect to signup page to collect extra info
            if (req.session && req.session.wasNewGoogleUser) {
                req.flash('success', 'Account created via Google. Please complete your profile.');
                // clear the flag and redirect to signup/edit profile page
                delete req.session.wasNewGoogleUser;
                return res.redirect('/signup');
            }
            // otherwise proceed with normal post-login flow
            return userController.login(req, res);
        }
    );
} else {
    // Google OAuth not configured; do not register routes to avoid runtime errors
}

// Wishlist routes
router.get('/wishlists', isLoggedIn, wrapAsync(userController.renderWishlists));
router.post('/wishlists/:id', wrapAsync(userController.addToWishlist));
router.delete('/wishlists/:id', wrapAsync(userController.removeFromWishlist));

// JSON API route for JWT login
router.post('/api/login', async (req, res) => {
    // delegate to controller
    return userController.apiLogin(req, res);
});

module.exports = router;