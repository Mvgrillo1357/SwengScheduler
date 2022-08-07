const OrganizationController = require('../controllers/OrganizationController.js');

OrganizationController.get("/approve/:id", OrganizationController.approve );
OrganizationController.get("/deny/:id", OrganizationController.deny );
OrganizationController.get("/delete/:id", OrganizationController.delete );

module.exports  = OrganizationController.getRouter();
