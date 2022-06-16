

module.exports = (...roles) => (req, res, next) => {
    if (!req.user) {
      return res.redirect('/users/login')
    }
  
    const hasRole = roles.find(role => req.user.role === role)
    
    if (!hasRole) {
      res.status(401);
      return res.send("You do not have access to this resource");
    }
  
    return next()
}