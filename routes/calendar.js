const express = require('express');
const router = express.Router();
const Calendar = require("../models/Calendar");
const User = require("../models/user");

// router.get('/approve/:id', async (req,res) =>{
//     try {
//     const org = await Organization.findOne({_id: req.params.id});
//     org.status = "Approved";
//     org.save();
//     res.redirect('/dashboard');
//     }catch (e) {
//         res.redirect('/dashboard');
//     }
// });
// router.get('/deny/:id', async (req,res) =>{
//     const org = await Organization.findOne({_id: req.params.id});
//     org.status = "Denied";
//     org.save();
//     res.redirect('/dashboard');
// });
// router.get('/delete/:id', async (req,res) =>{
//     const org = await Organization.deleteOne({_id: req.params.id});
//     req.flash('msg', 'organization was deleted');
//     res.redirect('/dashboard');
// });


/**
 * Calendar Event Route
 * 
 * Allows users to create a calendar event
 * 
 * Prompt the user for the a Calendar event and create it
 * 
 * URL : /Calendar/create
 * 
 */
router.get('/create', async (req,res) =>{
    let users = await User.find();
    
    res.render('modify-calendar', {users})

});

// Create Events in the Calendar
router.post('/CreateEvent', async (req,res) => {
    const {name, belongsTo, startDate, startTime, endDate, endTime} = req.body;
    const newCalendar = new Calendar({
        name, 
        belongsTo, 
        startDate,
        startTime,
        endDate,
        endTime,
    });

   
    await newCalendar.save();

    res.redirect('/Calendar');
})



router.get('/', async (req,res) =>{
    return res.render('calendar');
})
router.get('/data', async (req, res) =>{
    let calendars = await Calendar.find()
    calendars = calendars.map((item) => {
        // we need year, month and day from out startDate/ endDate date items
        stringYear= item.startDate.getFullYear();
        stringMonth= item.startDate.getMonth()+1;
        stringDay= item.startDate.getDate();
        return {
           text: item.name,
           start_date:`${stringYear}-${stringMonth}-${stringDay} ${item.startTime}`,
           end_date:`${stringYear}-${stringMonth}-${stringDay} ${item.endTime}`,
        }
      })
    return res.json(calendars
        // { id:1, start_date: "2022-04-15 09:00", end_date: "2022-04-15 12:00", text:"English lesson" },
        // { id:2, start_date: "2022-04-16 10:00", end_date: "2022-04-16 16:00", text:"Math exam" },
        // { id:3, start_date: "2022-04-16 10:00", end_date: "2022-04-21 16:00", text:"Science lesson" },
        // { id:4, start_date: "2022-04-17 16:00", end_date: "2022-04-17 17:00", text:"English lesson" },
        // { id:5, start_date: "2022-04-18 09:00", end_date: "2022-04-18 17:00", text:"Usual event" }
    );
})

module.exports  = router;