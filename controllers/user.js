const User = require('../models/user');

module.exports.renderSignupForm= (req, res) => {
    res.render('users/signup.ejs');
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
module.exports.logout= (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out successfully');
        res.redirect('/listings'); // Redirect to listings or home page
    });
};
