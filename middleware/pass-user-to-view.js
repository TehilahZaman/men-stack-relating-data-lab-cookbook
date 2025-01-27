function passUserToView(req, res, next) {
    res.locals.user = req.session.user ? req.session.user : null;
    // we've made a global locals object 
    // - the user within the cookie is accessable to all views docs and we can check if the user is signed in
    //req.session.user is what we use for controller files 
  next();
}

module.exports = passUserToView;
