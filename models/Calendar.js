const mongoose = require('mongoose');

/**
 * Calendar Schema -- This schema holds the information for the events
 */
const CalendarSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "The Calendar's Name"],
    },
    belongsTo: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    start_date :{
        type : Date,
        default : Date.now
    },
    end_date :{
        type : Date,
        default : Date.now + 100,
    }
});

const Calendar = mongoose.model('Calendar', CalendarSchema);

module.exports = Calendar;