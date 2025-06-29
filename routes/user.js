const express = require('express');
const router = express.Router(); 
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});
router.post('/signup', wrapAsync(async (req, res) => {
    try{
            let { username, email, password } = req.body;
            const newUser = new User({ username, email });
            const registeredUser = await User.register(newUser, password);
            req.login(registeredUser, (err) => {
                if (err) {
                    req.flash('error', 'Login failed after registration');
                    return res.redirect('/signup');
                }
                req.flash('success', 'Registered and logged in successfully');
                res.redirect('/listings'); // Redirect to listings or home page
            });
            
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post('/login',
    saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    async (req, res) => {
        req.flash('success', 'Logged in successfully');
        let redirectUrl = res.locals.redirectUrl || '/listings'; // Default to listings if no redirectUrl
        res.redirect(redirectUrl); // Or wherever you want
    }
);
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out successfully');
        res.redirect('/listings'); // Redirect to listings or home page
    });
});

module.exports = router;