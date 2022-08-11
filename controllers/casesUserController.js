const express = require('express');
const router = express.Router();
const Case = require("../models/Case");
const { Controller } = require('./controller');

/**
 * caseUserController
 * 
 * The controller that handles just the user's cases
 * 
 */
class casesUserController extends Controller{

    /**
     * index
     * 
     * show all the user's cases
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Reponse
     */
    async index(req,res){
        // find all cases that belong to a User model
        let CasesList= await Case.find({belongsTo: req.user});

        res.render('CasesListRender', {
            CasesList,
            route: 'casesUser'
        });
    
    }

    /**
     * createRender
     * 
     * Show the form for a new case
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async createRender(req,res){
        // find all cases that belong to a User model
        res.render("NewCases", {
            route: 'casesUser'
        });
    }

    /**
     * createUserBody
     * 
     * Create's the new case for the user
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async createUserBody(req,res){
        // Get the description from the request
        let {description} = req.body;
        // Create the new case
        await Case.create({
            description,
            belongsTo : req.user,
            org : req.user.organization,
        })
        // Adds a flash message for the user
        req.flash('success', `Your case, ${description} has been opened. Please wait until it is resolved.`);

        res.redirect("/casesUser");    
    }

    /**
     * getComments
     * 
     * Show all the comments for the current case
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async getComments(req,res){
        // find all comments that belong to a Case model
        let CommentsList= await Case.findOne({_id: req.params.id}).populate('notes.writer');
        res.render('CommentsListRender', {
            CommentsList, 
            route: 'casesUser'
        });
    }

    /**
     * postComments
     * 
     * Adds a new comment to the case object
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async postComments(req,res){
        // Get the comment from the request
        let {comment} = req.body;
        
        // Find the case to update
        let CommentsList= await Case.findOne({_id: req.params._id});
        
        // Add the comment to the case
        CommentsList.notes.push({
            comment,
            writer: req.user,
            timeStamp: Date.now(),
        })
    
        // Save
        await CommentsList.save();
        
        res.redirect(`/casesUser/comments/${CommentsList._id}`);
    }

}

module.exports  = new casesUserController(router);