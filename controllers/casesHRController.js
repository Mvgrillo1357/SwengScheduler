
const express = require('express');
const router = express.Router();
const Case = require("../models/Case");
const casesHR = require('../routes/casesHR');

const { Controller } = require('./controller');

/**
 * CaseHR controller
 * 
 * The controller that is responsibel for all HR actions regarding cases
 */
class casesHRController extends Controller {

    /**
     * index route
     * 
     * This route lists all the cases for the organization
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async index(req,res){
        // find all cases that belong to a User model
        let CasesList= await Case.find({org: req.user.organization}).populate('belongsTo');

        res.render('CasesListRender', {
            CasesList,
            route: 'casesHR'
        });
    }

    /**
     * getCommentsListRender
     * 
     * Show all the comments for the current case
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async getCommentsListRender(req,res) {
        // find all comments that belong to a Case model (Populate the writer to show that information)
        let CommentsList= await Case.findOne({_id: req.params.id}).populate('notes.writer');

        res.render('CommentsListRender', {
            CommentsList,
            route: 'casesHR'
        });
    }

    /**
     * postCommentsListRender
     * 
     * Add the new comment to the case
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async postCommentsListRender(req,res){
        // Get the comment's data from the body
        let {comment} = req.body;

        // Find the case
        let CommentsList= await Case.findOne({_id: req.params._id});
        
        // Add the new note to the Case with the current user who is writing and add the timestamp
        CommentsList.notes.push({
            comment,
            writer: req.user,
            timeStamp: Date.now(),
        })

        // Save the case
        await CommentsList.save();
        
        res.redirect(`/casesHR/comments/${CommentsList._id}`);
    };

    /**
     * postCommentsUpdateStatus
     * 
     * Update the case's status and adds a comment recording the status change
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async postCommentsUpdateStatus(req,res){
        // Get the status from the body
        let {status} = req.body;

        // FInd the case
        let CommentsList= await Case.findOne({_id: req.params._id});
        // Update the status
        CommentsList.status = status;

        // Push a comment with the status change and who did it
        CommentsList.notes.push({
            comment: `${req.user.name} updated status to ${status}`,
            writer: req.user,
            timeStamp: Date.now(),
        })

        // Save the Case
        await CommentsList.save();
        
        res.redirect(`/casesHR/comments/${CommentsList._id}`);
    };
}

module.exports = new casesHRController(router);
