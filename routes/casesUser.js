const casesUserController = require('../controllers/casesUserController');

casesUserController.get('/', casesUserController.index);

casesUserController.get('/create', casesUserController.createRender);

casesUserController.post('/create', casesUserController.createUserBody);

casesUserController.get('/comments/:id', casesUserController.getComments);

casesUserController.post('/comments/:_id', casesUserController.postComments);


module.exports  = casesUserController.getRouter();