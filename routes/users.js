
const UserController = require('../controllers/UserController');

// Login Route
UserController.get('/login', UserController.login);

// Post Login Route
UserController.post('/login', UserController.loginProcess);

// Display Password Reset Form
UserController.get('/reset/:hash', UserController.passwordResetForm );

// Process Password Reset Form
UserController.post('/reset/:hash', UserController.processPasswordReset);

// Process Logout 
UserController.get('/logout', UserController.logout)

module.exports  = UserController.getRouter();