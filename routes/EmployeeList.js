const EmployeeListController = require('../controllers/EmployeeListController');

EmployeeListController.get('/', EmployeeListController.index);
EmployeeListController.get('/create', EmployeeListController.createForm);
EmployeeListController.post('/create', EmployeeListController.createAction);

EmployeeListController.get('/:id', EmployeeListController.showAction);
EmployeeListController.get('/:id/resetLink', EmployeeListController.resetPassword)

EmployeeListController.post('/:id', EmployeeListController.updateAction);
EmployeeListController.post('/remove/:id', EmployeeListController.terminate)

EmployeeListController.post('/active/:id', EmployeeListController.activate)

module.exports  = EmployeeListController.getRouter();