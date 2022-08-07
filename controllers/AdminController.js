const { Controller } = require("./controller");
const express = require("express");
const router = express.Router();

class Admin extends Controller {
  async index(req, res) {
    res.render("Admin");
  }
}

module.exports = new Admin(router);
