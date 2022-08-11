const indexController = require('../controllers/indexController.js');

// / - Show the welcome route
indexController.get('/',indexController.login)
// /confirm-2fa - Show the page to confirm 2fa
indexController.get('/confirm-2fa',indexController.check2fa)
// /confirm-2fa (POST) - Check the code the user entered
indexController.post('/confirm-2fa',indexController.check2faAction)

// /register - page to register a new user
indexController.get('/register', indexController.register )
// /resetPassword - show the request reset password form
indexController.get('/resetPassword', indexController.resetPassword )
// /resetPassword (POST) - Check if the user exists and sends the reset password email
indexController.post('/resetPassword', indexController.resetPasswordAction )

module.exports  = indexController.getRouter();