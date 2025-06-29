module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Store the original URL
    req.flash('error', 'You must be logged in to do that');
    return res.redirect('/login');
  }
  next();
}
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // Make redirectUrl available in templates
  }
  next();
}