const { Controller } = require("./controller");
const express = require("express");
const router = express.Router();
const Calendar = require("../models/Calendar");
const User = require("../models/user");
const mailer = require("../config/mailer");
const mail = new mailer();

// COLORS - CONST variable. This variables holds the different colors when setting up the user's calendar
var COLORS = [
  "blue",
  "green",
  "red",
  "gold",
  "orange",
  "purple",
  "mediumorchid",
];

/**
 * CalendarController
 *
 * The Calender controller is responsible for handling all things related to the calendar.
 * 
 * This includes:
 *  - Sending the data for a single user's calendar
 *  - Sending the data for the employees that are under a manager
 *  - Creating Events
 *  - Updating Events
 *  - Deleting events
 *  - Showing the Manage calendar page
 *
 */
class CalenderController extends Controller {

  /**
   * data 
   * 
   * This endpoint returns a json list of events for the currently logged in user
   * 
   * 
   * @param {Request} req Express Request
   * @param {Response} res Express Response
   * @returns (JSON) List of events for the current user
   */
  async data (req, res) {
    // Get the user's events
    let calendars = await Calendar.find({belongsTo: req.user._id});
    // Map them into the format that DHX Scheduler will accept
    calendars = calendars.map((item) => {
        return {
           text: item.name,
           start_date: item.start_date,
           end_date: item.end_date,
        }
      })
      // Return the JSON result
    return res.json(calendars);
  }

  /**
   * Manage Calendar endpoint
   * 
   * Sets up the Manage calendar page
   * 
   * @param {Request} req Express Request
   * @param {Response} res Express Response
   */
  async manageCalendar(req, res) {
    // Get the user's for the current manager who are active
    let users = await User.find({
      organization: req.user.organization,
      manager: req.user,
      status: "active",
    });
  
    // Format them in a way that the DHX Scheduler lightbox can use
    users = users.map((user) => {
      return {
        key: user._id,
        label: user.name,
      };
    });
  
    // Render the page and pass in the users and the colors
    res.render("manage-calendar", { 
      users, 
      COLORS 
    });
  }

  /**
   * getManageAPI
   * 
   * This is the endpoint that returns the events for the users that the manager currently manages
   * 
   * @param {Request} req Express Request 
   * @param {Response} res Express Response
   */
  async getManageAPI(req, res){
    // Returns just the users who are active for the current manager
    let users = await User.find({
      organization: req.user.organization,
      manager: req.user,
      status: "active",
    });
  
    // Find all the events for the manager's users
    let events = await Calendar.find({
      belongsTo: users,
      // DHX Scheduler does monthly view so it only requests a single month at at time
      // So we only need to return the month's events from the query
      start_date: { $gte: req.query.from, $lte: req.query.to },
      end_date: { $gte: req.query.from, $lte: req.query.to },
    }).populate("belongsTo");
  
    // Format the Events in a foramt that DHX Scheduler can use
    events = events.map((item) => {
      return {
        id: item._id,
        employee: item.belongsTo._id,
        text: item.name,
        start_date: item.start_date,
        end_date: item.end_date,
      };
    });
    // JSON format for events
    res.json(events);
  }

  /**
   * postManageAPI
   * 
   * This endpoint has a lot fo responsiblies 
   * 
   * It handles
   * - Inserting new events
   * - Updating old events
   * - Deleting events
   * 
   * It is also responsible for making sure that the
   * new or updated events don't overlap with any other events for that user
   * 
   * @TODO - This should be split into 3 sub-methods in the future.
   * 
   * @param {Request} req Express Request
   * @param {Response} res Express Response
   * @returns JSON Response (Success or error and informational data)
   */
  async postManageAPI(req, res){
    // Get the data from the request's body data attribute
    let { start_date, end_date, text, employee } = req.body.data;
    // Set up the response
    let response;
    // Get the ID (not in the data attribute)
    let id = req.body.id;
    // Set up the result
    let result;

    // Checking for an overlapping schedule
    // This stack overflow explains why the query works
    // https://stackoverflow.com/questions/26876803/mongodb-find-date-range-if-overlap-with-other-dates
    
    // If we're inserting, we won't have an ID to check against so only look for other events
    if (req.body.action == "inserted") {
      result = await Calendar.findOne({
        belongsTo: employee,
        start_date: { $lte: end_date },
        end_date: { $gte: start_date },
      });
      // If we are updating we'll have an ID to check against
    } else {
      result = await Calendar.findOne({
        belongsTo: employee,
        // look for events that don't match this ID (this prevents an error 
        //where you can't move an event by like 5 minutes and it would overlap with itself)
        _id: { $ne: id }, 
        start_date: { $lte: end_date },
        end_date: { $gte: start_date },
      });
    }
  
    // Check the result from the previous inserting
    // If we have an error then we return an error response
    if (result) {
      // Set up the repsonse
      let response = {
        action: "error",
        prevAction: req.body.action, // Return the previous data
        msg: "User is already scheduled to work at that time",
      };
      // Send the response
      return res.json(response);
    }

    // Look up the user that matches the ID passed in
    let user = await User.findOne({ _id: employee });
  
    // If action is inserted, we are creating a new event
    if (req.body.action == "inserted") {
      response = await Calendar.create({
        start_date,
        end_date,
        name: text,
        belongsTo: employee,
      });
      // Send the mail to the user that a new event was created for them
      mail.sendMail({
        to: user.personalEmail,
        from: "no-reply@swengScheduler.com",
        subject: "New schedule was added",
        msg: `
           Hello ${user.firstName},
           Please check you SwengScheduler app to see the new shift.
           New shift was added for you starting from ${start_date} to ${end_date}.`,
      });
      // Send the repsonse -- include the ID so DHX Scheduler can update it on the frontend
      return res.json({
        action: "inserted",
        tid: response._id,
      });
    }

    // If the action is udpate, we are updating an old event
    if (req.body.action == "updated") {
      // Get the id from the body
      let id = req.body.id;
      // Update one event that matches this one
      response = await Calendar.updateOne(
        { _id: id },
        {
          start_date,
          end_date,
          name: text,
          belongsTo: employee,
        }
      );
      // Send a message to alert the user that their event has been updated
      mail.sendMail({
        to: user.personalEmail,
        from: "no-reply@swengScheduler.com",
        subject: "Schedule update",
        msg: `
           Hello ${user.firstName},
           Please check you SwengScheduler app to see the updates that was applied to your schedule.
           ${text} shift was Updated to ${start_date} -  ${end_date}.`,
      });
    }
  
    // If the action is delete, we need to remove the event
    if (req.body.action == "deleted") {
      let id = req.body.id;
      // Look up the user -- if it's a deleted event we won't have any data
      // Find the event and then populate the user who it belongs to
      let user = (await Calendar.findOne({ _id: id }).populate("belongsTo"))
        .belongsTo;
        // Delete the event
      response = await Calendar.deleteOne({ _id: id });
      // Send the message to the user letting them know their schedule was deleted
      mail.sendMail({
        to: user.personalEmail,
        from: "no-reply@swengScheduler.com",
        subject: "Schedule deleted",
        msg: `
           Hello ${user.firstName},
           Please check you SwengScheduler app to stay up to date.
           You have a shift that was removed.`,
      });
    }
  
    // Return the response
    res.json(response);
  } 
}

module.exports  = new CalenderController(router);
