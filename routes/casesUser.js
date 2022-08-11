const casesUserController = require('../controllers/casesUserController');

// /casesUser - Returns a list of just the user's cases
casesUserController.get('/', casesUserController.index);

// /casesUser/create - Gets the form to create a new case
casesUserController.get('/create', casesUserController.createRender);

// /casesUser/create (POST) - Creates and saves to the DB the new case
casesUserController.post('/create', casesUserController.createUserBody);

// /casesUser/comments/:id - List the comments for the case that matches the :id
casesUserController.get('/comments/:id', casesUserController.getComments);

// /casesUser/comments/:id (POST) - Creates a new comment that matches the :id
casesUserController.post('/comments/:_id', casesUserController.postComments);

module.exports  = casesUserController.getRouter();