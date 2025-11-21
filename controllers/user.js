const User = require('../models/user');
const { signToken } = require('../utils/jwt');

module.exports.renderSignupForm= (req, res) => {
    // If Google provided profile data during OAuth signup, prefill the signup form
    const googleProfile = req.session && req.session.googleProfile ? req.session.googleProfile : null;
    // clear the session-stored profile after reading
    if (req.session && req.session.googleProfile) {
        delete req.session.googleProfile;
    }
    res.render('users/signup.ejs', { googleProfile });
};
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.signup = async (req, res) => {
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
                // clear any leftover google profile session data
                if (req.session && req.session.googleProfile) delete req.session.googleProfile;
                res.redirect('/listings'); // Redirect to listings or home page
            });
            
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};

module.exports.login =     async (req, res) => {
        req.flash('success', 'Logged in successfully');
        let redirectUrl = res.locals.redirectUrl || '/listings'; // Default to listings if no redirectUrl
        res.redirect(redirectUrl); // Or wherever you want
    };

// API login - returns JWT. Accepts JSON body: { username, password }
module.exports.apiLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
        // Use passport-local-mongoose's authenticate function
        const auth = User.authenticate();
        auth(username, password, (err, user, options) => {
            if (err || !user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // sign minimal payload
            const token = signToken({ user: { _id: user._id, username: user.username } });
            return res.json({ token });
        });
    } catch (e) {
        return res.status(500).json({ error: 'Server error' });
    }
};
module.exports.logout= (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out successfully');
        res.redirect('/listings'); // Redirect to listings or home page
    });
};

module.exports.renderWishlists = async (req, res) => {
    if (!req.user) {
        req.flash('error', 'Please login to view wishlists');
        return res.redirect('/login');
    }
    
    try {
        const user = await User.findById(req.user._id).populate('wishlists');
        console.log('Rendering wishlists page with', user.wishlists.length, 'items');
        res.render('users/wishlists.ejs', { wishlists: user.wishlists || [] });
    } catch (error) {
        console.error('Error loading wishlists:', error);
        req.flash('error', 'Error loading wishlists');
        res.redirect('/listings');
    }
};

module.exports.addToWishlist = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Please login first' });
    }
    
    try {
        const listingId = req.params.id;
        console.log('Adding to wishlist - User ID:', req.user._id, 'Listing ID:', listingId);
        
        const user = await User.findById(req.user._id);
        console.log('User before adding:', user);
        
        // Initialize wishlists array if it doesn't exist
        if (!user.wishlists) {
            user.wishlists = [];
        }
        
        if (!user.wishlists.includes(listingId)) {
            user.wishlists.push(listingId);
            await user.save();
            console.log('User after adding:', user);
            res.json({ success: true, message: 'Added to wishlist' });
        } else {
            res.json({ success: false, message: 'Already in wishlist' });
        }
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ success: false, message: 'Error adding to wishlist' });
    }
};

module.exports.removeFromWishlist = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Please login first' });
    }
    
    try {
        const listingId = req.params.id;
        const user = await User.findById(req.user._id);
        
        user.wishlists = user.wishlists.filter(id => !id.equals(listingId));
        await user.save();
        res.json({ success: true, message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing from wishlist' });
    }
};
