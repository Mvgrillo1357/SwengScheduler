const Admin = require("../controllers/AdminController");

// /admin - Route for the Admin page for SuperUsers, HR, and Managers
Admin.get("/", Admin.index);

module.exports = Admin.getRouter();
