const express = require("express");
const passport = require("passport");
const Admin = require("../controllers/AdminController");

//login handle
Admin.get("/", Admin.index);

module.exports = Admin.getRouter();
