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
        enum: ['in-progress', 'resolved'],
    },
    notes: [{
        comment: { type: String },
        writer: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
        },
    }],
});

const Case = mongoose.model('Case', CaseSchema);

module.exports = Case;