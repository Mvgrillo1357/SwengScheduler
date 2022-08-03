const mongoose = require('mongoose');

const ResetLinkSchema  = new mongoose.Schema({
    belongsTo :{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    },
    hash :{
        type  : String,
        required : true,
    },
    expires: {
        type: Date,
        required: true,
    },
    isUsed: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const ResetLink = mongoose.model('ResetLink', ResetLinkSchema);

module.exports = ResetLink;