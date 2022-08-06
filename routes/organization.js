const express = require("express");
const router = express.Router();
const Organization = require("../models/Organization");

router.get("/approve/:id", async (req, res) => {
  try {
    const org = await Organization.findOne({ _id: req.params.id }).populate(
      "requestedBy"
    );

    org.approve(req.user);
    org.save();
    res.redirect("/dashboard");
  } catch (e) {
    console.log(e);
    res.redirect("/dashboard");
  }
});
router.get("/deny/:id", async (req, res) => {
  const org = await Organization.findOne({ _id: req.params.id }).populate(
    "requestedBy"
  );
  org.deny(req.user);
  org.save();
  res.redirect("/dashboard");
});
router.get("/delete/:id", async (req, res) => {
  const org = await Organization.deleteOne({ _id: req.params.id });
  req.flash("msg", "organization was deleted");
  res.redirect("/dashboard");
});

module.exports = router;
