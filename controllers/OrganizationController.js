const express = require("express");
const router = express.Router();
const Organization = require("../models/Organization");

const { Controller} = require("./controller");

/**
 * OrganizationController
 * 
 * Simply responsibel for approving, denying or deleting an organization
 */
class OrganizationController extends Controller {
    /**
     * Approve the organization
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async approve(req, res) {
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

      /**
       *  Denythe organization
       * 
       * @param {Request} req Express Request
       * @param {Response} res Express Response
       */
      async deny (req, res) {
        const org = await Organization.findOne({ _id: req.params.id }).populate(
          "requestedBy"
        );
        org.deny(req.user);
        org.save();
        res.redirect("/dashboard");
      }

      /**
       * Delete the organization 
       * 
       * @param {Request} req Express Request
       * @param {Response} res Express Response
       */
      async delete (req, res)  {
        const org = await Organization.deleteOne({ _id: req.params.id });
        req.flash("msg", "organization was deleted");
        res.redirect("/dashboard");
      }

}

module.exports = new OrganizationController(router);