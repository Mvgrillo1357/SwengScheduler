const casesHRController = require('../controllers/casesHRController');

// /casesHR - Loading the list of cases for everyone in the organization
casesHRController.get('/', casesHRController.index);

// /casesHR/comment/:id - Returns the comments (and post form) for the case that matches the :id
casesHRController.get('/comments/:id', casesHRController.getCommentsListRender);

// /casesHR/comment/:id (POST) - Adds the new comment to the case that matches the :id
casesHRController.post('/comments/:_id', casesHRController.postCommentsListRender);

// /casesHR/status/:_id (POST) - Updates the status for the case that matches the :_id
casesHRController.post('/status/:_id', casesHRController.postCommentsUpdateStatus);

module.exports  = casesHRController.getRouter();