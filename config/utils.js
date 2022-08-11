
/**
 * Role checking middleware
 * 
 * This middelware is responsible for taking a list of roles
 * and seeing if the user's role is in that list.
 * 
 * If the user is not in that role list, it sends an error about lacking access.
 * 
 * @param  {...any} roles spread operator to take in many roles in an array
 * @returns TRUE if the user has access
 *  - Otherwise it returns a response object with invalid access
 */

module.exports = (...roles) => (req, res, next) => {
    // If the user is not logged in, send them to the login page.
    if (!req.user) {
      return res.redirect('/users/login')
    }
  
    // Check if the user's role is in the array
    const hasRole = roles.find(role => req.user.role === role)
    
    // If they don't have access
    if (!hasRole) {
      // Set 401 status
      res.status(401);
      // Send the message
      return res.send("You do not have access to this resource");
    }
    // Go onto the next middleware
    return next()
}