const SuperUserController = require('../controllers/SuperUserController.js');

/**
 * Organization Request Route
 * 
 * Allows users to request an organization
 * 
 * Prompt the user for their information and the proposed organization's name
 * 
 * URL : /organization/create
 * 
 */

// create handle
SuperUserController.get('/create', SuperUserController.create);

// Save the SuperUser and Organization to the Database
SuperUserController.post('/create', SuperUserController.creatorHandle );


module.exports  = SuperUserController.getRouter();