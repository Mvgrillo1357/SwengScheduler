const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must Enter an organization's name"],
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Denied"],
    default: "Pending",
  },
  // Who requested it
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Who approved it
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

OrganizationSchema.methods.approve = function (user) {
  this.status = "Approved";
  this.approvedBy = user._id;
  // @TODO Send a notification to the requestor letting them know their organization was approved.

  const mailer = require("../config/mailer");
  const mail = new mailer();
  mail.sendMail({
    to: this.requestedBy.personalEmail,
    from: "no-reply@swengScheduler.com",
    subject: "New Organization has been approved",
    msg: `
Hello ${this.requestedBy.firstName},
a new organization has been approve with name: ${this.name} in SwengScheduler.`,
  });
};

OrganizationSchema.methods.deny = function (user) {
  this.status = "Denied";
  const mailer = require("../config/mailer");
  const mail = new mailer();
  mail.sendMail({
    to: this.requestedBy.personalEmail,
    from: "no-reply@swengScheduler.com",
    subject: "New Organization has been denied",
    msg: `
Hello ${this.requestedBy.firstName},
a new organization has been denied with name: ${this.name} in SwengScheduler.`,
  });
};

const Organization = mongoose.model("Organization", OrganizationSchema);

module.exports = Organization;
