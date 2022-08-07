const indexController = require('../controllers/indexController.js');

//login page
indexController.get('/',indexController.login)
//register page
indexController.get('/register', indexController.register )


module.exports  = indexController.getRouter();