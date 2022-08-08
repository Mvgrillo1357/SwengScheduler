const indexController = require('../controllers/indexController.js');

//login page
indexController.get('/',indexController.login)
indexController.get('/confirm-2fa',indexController.check2fa)
indexController.post('/confirm-2fa',indexController.check2faAction)
//register page
indexController.get('/register', indexController.register )
indexController.get('/resetPassword', indexController.resetPassword )
indexController.post('/resetPassword', indexController.resetPasswordAction )


module.exports  = indexController.getRouter();