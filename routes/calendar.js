const CalenderController = require('../controllers/CalenderController');


CalenderController.get("/manage", CalenderController.manageCalendar);

CalenderController.get("/manage/api", CalenderController.getManageAPI);

CalenderController.post("/manage/api", CalenderController.postManageAPI);

CalenderController.get("/data", CalenderController.data);

module.exports  = CalenderController.getRouter();