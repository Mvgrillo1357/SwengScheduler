const mongoose = require('mongoose');

const CaseSchema  = new mongoose.Schema({
    description: {
        type: String,
        required: [true, "A case needs a description"],
    },
    // Who requested it
    belongsTo: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, "A case must be opened by someone"],
    },
    status: {
        type: String,
        default: 'un-assigned',
        enum: ['in-progress', 'resolved', 'denied', 'un-assigned'],
    },
    notes: [{
        comment: { type: String },
        writer: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
        },
    }],
    org: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Organization',
        required: [true, "A case must belong to an Org"],
    },
});

const Case = mongoose.model('Case', CaseSchema);

module.exports = Case;