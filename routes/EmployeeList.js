const EmployeeListController = require('../controllers/EmployeeListController');

// /EmployeeList - Lists all the employees in the current user's organization
EmployeeListController.get('/', EmployeeListController.index);

// /EmployeeList/create - Show the create form for a new employee
EmployeeListController.get('/create', EmployeeListController.createForm);
// /EmployeeList/create (POST) - Saves the new user to the database
EmployeeListController.post('/create', EmployeeListController.createAction);

// /EmployeeList/:id - Show the user that matches the :id
EmployeeListController.get('/:id', EmployeeListController.show);
// /EmployeeList/:id/resetLink - Sends the employee a reset link that matches the :id
EmployeeListController.get('/:id/resetLink', EmployeeListController.resetPassword)

// /EmployeeList/:id (POST) - Updates the employee's information
EmployeeListController.post('/:id', EmployeeListController.updateAction);
// /EmployeeList/remove/:id (POST) - Mark the employee as terminated
EmployeeListController.post('/remove/:id', EmployeeListController.terminate)
// /EmployeeList/active/:id (POST) - Mark the employee as active
EmployeeListController.post('/active/:id', EmployeeListController.activate)

module.exports  = EmployeeListController.getRouter();