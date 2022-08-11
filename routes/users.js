
const UserController = require('../controllers/UserController');

// /users/login - Login Route
UserController.get('/login', UserController.login);

// /users/login (POST) - Confirms the login
UserController.post('/login', UserController.loginProcess);

// /users/reset/:hash - Displays the form to reset the password
UserController.get('/reset/:hash', UserController.passwordResetForm );

// /users/reset/:hash (POST) - resets the user's password
UserController.post('/reset/:hash', UserController.processPasswordReset);

// /users/logout (GET) - Logs the user out
UserController.get('/logout', UserController.logout)

module.exports  = UserController.getRouter();