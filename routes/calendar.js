const CalenderController = require('../controllers/CalenderController');


CalenderController.get("/manage", CalenderController.manageCalendar);

CalenderController.get("/manage/api", CalenderController.getManageAPI);

CalenderController.post("/manage/api", CalenderController.postManageAPI);

module.exports  = CalenderController.getRouter();