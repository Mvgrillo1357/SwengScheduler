const express = require('express');
const router = express.Router();
const Calendar = require("../models/Calendar");

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

router.get('/', async (req,res) =>{
    return res.render('calendar');
})
router.get('/data', async (req, res) =>{
    return res.json([
        { id:1, start_date: "2022-04-15 09:00", end_date: "2022-04-15 12:00", text:"English lesson" },
        { id:2, start_date: "2022-04-16 10:00", end_date: "2022-04-16 16:00", text:"Math exam" },
        { id:3, start_date: "2022-04-16 10:00", end_date: "2022-04-21 16:00", text:"Science lesson" },
        { id:4, start_date: "2022-04-17 16:00", end_date: "2022-04-17 17:00", text:"English lesson" },
        { id:5, start_date: "2022-04-18 09:00", end_date: "2022-04-18 17:00", text:"Usual event" }
    ]);
})
module.exports  = router;