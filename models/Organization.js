const mongoose = require("mongoose");

/**
 * Organization database schema
 */
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

/**
 * Approve the organization
 * 
 * @param {User} user The user who is approving
 */
OrganizationSchema.methods.approve = function (user) {
  // mark it approved and who approved it
  this.status = "Approved";
  this.approvedBy = user._id;
  // Send a notification to the requestor letting them know their organization was approved.
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

/**
 * Deny the organization
 * 
 * @param {User} user Who is denying
 */
OrganizationSchema.methods.deny = function (user) {
  // Mark it denied
  this.status = "Denied";
  // Send a notfication letting the user know it was denied
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
