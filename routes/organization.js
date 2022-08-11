const OrganizationController = require('../controllers/OrganizationController.js');

// /organization/approve/:id - Approves the organization
OrganizationController.get("/approve/:id", OrganizationController.approve );
// /organization/deny/:id - Denies the organization
OrganizationController.get("/deny/:id", OrganizationController.deny );
// /organization/delete/:id - Deletes the organization
OrganizationController.get("/delete/:id", OrganizationController.delete );

module.exports  = OrganizationController.getRouter();
