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