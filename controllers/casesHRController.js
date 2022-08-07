
const express = require('express');
const router = express.Router();
const Case = require("../models/Case");
const casesHR = require('../routes/casesHR');

const { Controller } = require('./controller');

class casesHRController extends Controller {

    async index(req,res){
        // find all cases that belong to a User model
        let CasesList= await Case.find({org: req.user.organization}).populate('belongsTo');
        res.render('CasesListRender', {
            CasesList,
            route: 'casesHR'
        });
    }
    async getCommentsListRender(req,res) {
        // find all comments that belong to a Case model
        let CommentsList= await Case.findOne({_id: req.params.id}).populate('notes.writer');
        res.render('CommentsListRender', {
            CommentsList,
            route: 'casesHR'
        });
    }

// notes: [{
//     comment: { type: String },
//     writer: {
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User',
//     },
//     timeStamp: {type: Date},
// }],
    async postCommentsListRender(req,res){
        
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
        res.redirect(`/casesHR/comments/${CommentsList._id}`);

    };
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

// need to resolve cases
// status: {
//     type: String,
//     default: 'un-assigned',
//     enum: ['in-progress', 'resolved', 'denied', 'un-assigned'],
// },
async postCommentsUpdateStatus(req,res){
    let {status} = req.body;

    let CommentsList= await Case.findOne({_id: req.params._id});
    CommentsList.status= status;

    CommentsList.notes.push({
        comment: `${req.user.name} updated status to ${status}`,
        writer: req.user,
        timeStamp: Date.now(),
    })

    await CommentsList.save();
    
    // req.flash('success', `Your case, ${req.user.organization.status} has been opened. Please wait until it is resolved.`);
    // find all cases that belong to a User model
    res.redirect(`/casesHR/comments/${CommentsList._id}`);
    };
}

module.exports = new casesHRController(router);
