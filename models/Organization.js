const mongoose = require('mongoose');

const OrganizationSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Must Enter an organization's name"],
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Denied'],
        default: 'Pending',
    },
    // Who requested it
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    },
    // Who approved it
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
    },
});

OrganizationSchema.methods.approve = function(user) {
    this.status = 'Approve';
    this.approvedBy = user._id;
    // @TODO Send a notification to the requestor letting them know their organization was approved.
};

OrganizationSchema.methods.deny = function(user) {
    this.status = "Denied";
}

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;