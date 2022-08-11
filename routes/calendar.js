const CalenderController = require('../controllers/CalenderController');

// /calendar/manage - The manage endpoint that will load the calendar for settings schedules
CalenderController.get("/manage", CalenderController.manageCalendar);

/**
 * /calendar/manage/api - The JSON API that handles returning the schedules for a manager's employees
 */
CalenderController.get("/manage/api", CalenderController.getManageAPI);

/**
 * /calendar/manage/api (POST) - JSON API
 * * It handles 
 * - inserted (for event creation)
 * - updated (for event updation)
 * - deleted (for event deletion)
 */
CalenderController.post("/manage/api", CalenderController.postManageAPI);

// /calendar/data - the endpoint for only returning a user's schedule
CalenderController.get("/data", CalenderController.data);

module.exports  = CalenderController.getRouter();