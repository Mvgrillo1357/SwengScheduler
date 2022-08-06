const express = require('express');
const router = express.Router();
const Case = require("../models/Case");

router.get('/', async (req,res) =>{
    // find all cases that belong to a User model
    let CasesList= await Case.find({belongsTo: req.user});
    res.render('CasesListRender', {CasesList});

});

router.get('/create', async (req,res) =>{
    // find all cases that belong to a User model
    res.render("NewCases");

});

router.post('/create', async (req,res) =>{
    let {description} = req.body;
    await Case.create({
        description,
        belongsTo : req.user,
        org : req.user.organization,
    })
    req.flash('success', `Your case, ${req.user.organization.status} has been opened. Please wait until it is resolved.`);
    // find all cases that belong to a User model
    res.redirect("/casesUser");

});

// router.get('/deny/:id', async (req,res) =>{
//     // const org = await Organization.findOne({_id: req.params.id});
//     org.status = "Denied";
//     org.save();
//     res.redirect('/dashboard');
// });
// router.get('/delete/:id', async (req,res) =>{
//     // const org = await Organization.deleteOne({_id: req.params.id});
//     req.flash('msg', 'organization was deleted');
//     res.redirect('/dashboard');
// });

module.exports  = router;