/**
 * Auth Middelware
 * 
 * This module is responsible for marking sure that that the request 
 * has an authenticated user in it.
 * 
 * If the user is not logged in, it returns a redirect response instead of proceeding
 * to the next middleware.
 * 
 */

module.exports = {
    ensureAuthenticated : function(req,res,next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error' , 'please login to view this resource');
        res.redirect('/users/login');
    }
}