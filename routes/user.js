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

// Wishlist routes
router.get('/wishlists', isLoggedIn, wrapAsync(userController.renderWishlists));
router.post('/wishlists/:id', wrapAsync(userController.addToWishlist));
router.delete('/wishlists/:id', wrapAsync(userController.removeFromWishlist));

module.exports = router;