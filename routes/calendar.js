const express = require('express');
const router = express.Router();
const Calendar = require("../models/Calendar");
const User = require("../models/user");

var COLORS = [
    'blue',
    'green',
    'red',
    'gold',
    'orange',
    'purple',
    'mediumorchid'
];
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
router.get('/manage', async (req,res) =>{
    let users = await User.find({organization: req.user.organization, manager: req.user});
    
    users = users.map((user) => {return {
        key: user._id,
        label: user.name,
    }});

    res.render('manage-calendar', {users, COLORS})

});

router.get('/manage/api', async (req,res) =>{
    let users = await User.find({organization: req.user.organization, manager: req.user});
    let events = await Calendar.find(
        {
            belongsTo: users,
            start_date: {$gte: req.query.from, $lte: req.query.to },
            end_date: {$gte: req.query.from, $lte: req.query.to },
        }
    ).populate('belongsTo');
    
    events = events.map((item) => {
        // we need year, month and day from out startDate/ endDate date items
        return {
           id: item._id,
           employee: item.belongsTo._id,
           text: item.name,
           start_date: item.start_date,
           end_date: item.end_date,
        }
    });
    res.json(events);

});

router.post('/manage/api', async (req,res) =>{
    let { start_date, end_date, text, employee } = req.body.data;
    let response;
    let id = req.body.id;
    // CHecking for an overlapping schedule
    // https://stackoverflow.com/questions/26876803/mongodb-find-date-range-if-overlap-with-other-dates
    let result = await Calendar.findOne({
            belongsTo: employee,
            _id: {$ne: id},
            start_date: {$lte: end_date}, 
            end_date: {$gte: start_date},
    });
    if(result)
    {
        if(req.body.action == 'inserted') {
            return res.json({
                action: 'error',
                prevAction: req.body.action,
                msg: 'User is already scheduled to work at that time'
            });
        }
        if(req.body.action == 'updated') {
            let result = await Calendar.findOne({_id: req.body.id});
            return res.json({
                action: 'error',
                prevAction: req.body.action,
                start_date: result.start_date,
                end_date: result.end_date,
                msg: 'User is already scheduled to work at that time'
            })
        }
    }
        
    if( req.body.action == 'inserted') {
        
        response = await Calendar.create({
            start_date,
            end_date,
            name: text,
            belongsTo: employee,
        });
        return res.json({
            action: 'inserted',
            tid: response._id,
        })
    }
    if( req.body.action == 'updated' ) {
        let id = req.body.id;
        response = await Calendar.updateOne(
            {_id: id},
            {
                start_date,
                end_date,
                name: text,
                belongsTo: employee,
            }
        );
    }

    if( req.body.action == 'deleted' ) {
        let id = req.body.id;
        response = await Calendar.deleteOne(
            {_id: id}
        );
    }
    
    res.json(response);
});

router.get('/', async (req,res) =>{
    return res.render('calendar');
})
router.get('/data', async (req, res) =>{
    let calendars = await Calendar.find({belongsTo: req.user._id});
    calendars = calendars.map((item) => {
        return {
           text: item.name,
           start_date: item.start_date,
           end_date: item.end_date,
        }
      })
    return res.json(calendars);
})

module.exports  = router;