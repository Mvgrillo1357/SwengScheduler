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
        // we need year, month and day from out startDate/ endDate date items
        return {
           text: item.name,
           start_date: item.start_date,
           end_date: item.end_date,
        }
      })
    return res.json(calendars);
})

module.exports  = router;