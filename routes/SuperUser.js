const SuperUserController = require('../controllers/SuperUserController.js');

// /organization/create - Request form for a new organization
SuperUserController.get('/create', SuperUserController.create);

// /organization/create (POST) - Creates the organization and the new superUser
SuperUserController.post('/create', SuperUserController.creatorHandle );

module.exports  = SuperUserController.getRouter();