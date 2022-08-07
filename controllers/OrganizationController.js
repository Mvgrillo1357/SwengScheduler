const express = require("express");
const router = express.Router();
const Organization = require("../models/Organization");

const { Controller} = require("./controller");

class OrganizationController extends Controller {
    async approve  (req, res) {
        try {
          const org = await Organization.findOne({ _id: req.params.id }).populate(
            "requestedBy"
          );
      
          org.approve(req.user);
          org.save();
          res.redirect("/dashboard");
        } catch (e) {
          req.flash('error', e);
          res.redirect("/dashboard");
        }
      }

      async deny (req, res) {
        const org = await Organization.findOne({ _id: req.params.id }).populate(
          "requestedBy"
        );
        org.deny(req.user);
        org.save();
        res.redirect("/dashboard");
      }

      async delete (req, res)  {
        const org = await Organization.deleteOne({ _id: req.params.id });
        req.flash("msg", "organization was deleted");
        res.redirect("/dashboard");
      }

}

module.exports = new OrganizationController(router);