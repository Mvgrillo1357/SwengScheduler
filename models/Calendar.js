const mongoose = require('mongoose');

const CalendarSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "The Calendar's Name"],
    },
    // Who requested it
    belongsTo: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        // required: true,
    },
    startDate :{
        type : Date,
        default : Date.now
    },

    startTime :{
        type : String,
        default : "00:00",
    },

    endDate :{
        type : Date,
        default : Date.now + 100,
    },

    endTime :{
        type : String,
        default : "00:00",
    },
});

const Calendar = mongoose.model('Calendar', CalendarSchema);

module.exports = Calendar;