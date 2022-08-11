const { Controller } = require("./controller");
const express = require("express");
const router = express.Router();

/**
 * Admin Controller
 * 
 * Simple controllers that renders just the admin page
 */
class Admin extends Controller {
  /**
   * Render the Admin page
   */
  async index(req, res) {
    res.render("Admin");
  }
}

module.exports = new Admin(router);
