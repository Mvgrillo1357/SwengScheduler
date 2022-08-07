const dashboardController = require('../controllers/dashboardController.js');

dashboardController.get('/dashboard', dashboardController.dashboard )
dashboardController.get('/setup-2fa',  dashboardController.handle2fa );
dashboardController.post('/setup-2fa',  dashboardController. registerhandle );

module.exports  = dashboardController.getRouter();