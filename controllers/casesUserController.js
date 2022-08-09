const express = require('express');
const router = express.Router();
const Case = require("../models/Case");
const { Controller } = require('./controller');

class casesUserController extends Controller{

    async index(req,res){
        // find all cases that belong to a User model
        let CasesList= await Case.find({belongsTo: req.user});
        res.render('CasesListRender', {
            CasesList,
            route: 'casesUser'
        });
    
    }

    async createRender(req,res){
        // find all cases that belong to a User model
        res.render("NewCases", {route: 'casesUser'});
    
    }

    async createUserBody(req,res){
        let {description} = req.body;
        await Case.create({
            description,
            belongsTo : req.user,
            org : req.user.organization,
        })
        req.flash('success', `Your case, ${description} has been opened. Please wait until it is resolved.`);
        // find all cases that belong to a User model
        res.redirect("/casesUser");
    
    }

    async getComments(req,res){
        // find all comments that belong to a Case model
        let CommentsList= await Case.findOne({_id: req.params.id}).populate('notes.writer');
        res.render('CommentsListRender', {CommentsList, route: 'casesUser'});
    
    }

// notes: [{
//     comment: { type: String },
//     writer: {
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User',
//     },
//     timeStamp: {type: Date},
// }],

    async postComments(req,res){
    
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
    
    }

}

module.exports  = new casesUserController(router);