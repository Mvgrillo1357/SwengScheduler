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

router.get('/comments/:id', async (req,res) =>{
    // find all comments that belong to a Case model
    let CommentsList= await Case.findOne({_id: req.params.id}).populate('notes.writer');
    res.render('CommentsListRender', {CommentsList});

});

// notes: [{
//     comment: { type: String },
//     writer: {
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User',
//     },
//     timeStamp: {type: Date},
// }],

router.post('/comments/:_id', async (req,res) =>{
    
    let {comment} = req.body;

    let CommentsList= await Case.findOne({_id: req.params._id});
    
    CommentsList.notes.push({
        comment,
        writer: req.user,
        timeStamp: Date.now(),
    })

    await CommentsList.save();
    
    // req.flash('success', `Your case, ${req.user.organization.status} has been opened. Please wait until it is resolved.`);
    // find all cases that belong to a User model
    res.redirect(`/casesUser/comments/${CommentsList._id}`);

});


module.exports  = router;