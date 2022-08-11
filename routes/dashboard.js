const dashboardController = require('../controllers/dashboardController.js');

// /dashboard - Loads the dashboard for the current user
dashboardController.get('/dashboard', dashboardController.dashboard )

// /setup-2fa - Loads the page to set up 2FA for the current user
dashboardController.get('/setup-2fa',  dashboardController.handle2fa );

// /setup-2fa (POST) - Saves the secret to the db for the current user
dashboardController.post('/setup-2fa',  dashboardController. registerhandle );

module.exports  = dashboardController.getRouter();