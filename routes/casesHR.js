const express = require('express');
const router = express.Router();
const Case = require("../models/Case");

router.get('/', async (req,res) =>{
    // find all cases that belong to a User model
    let CasesList= await Case.find({org: req.user.organization});
    res.render('CasesListRender', {CasesList});

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