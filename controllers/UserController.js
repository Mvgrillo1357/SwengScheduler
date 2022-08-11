const express = require('express');
const router = express.Router();
const passport = require('passport');
const ResetLink = require('../models/ResetLink');
const User = require('../models/user');

const { Controller } = require("./controller");

/**
 * UserController
 * 
 * The user controller is responsible for logging the user in and showing the reset form
 * and sending the reset link and handling logout
 */
class UserController extends Controller {
    /**
     * login
     * 
     * Show the login page
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async login(req,res) {
        res.render('login');
    }

    /**
     * loginProcess
     * 
     * use passportJS to authenticate the user
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async loginProcess(req,res) {
        passport.authenticate('local', {
            successRedirect : '/dashboard',
            failureRedirect: '/users/login',
            failureFlash : true
        })(req,res);
    }

    /**
     * passwordResetForm
     * 
     * Show the form to reset a password
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     * @returns Response View
     */
    async passwordResetForm(req,res) {
        // If the user is logged in they don't need to be on this page
        if(req.user) {
            return res.redirect('/dashboard');
        }
        // Get the resetlink that matches the hash in the db to the hash in the request
        let reset = await ResetLink.findOne({hash: req.params.hash});
        //set up the errors
        let error;
        // If the reset link exists
        if(reset) {
            // Check to see if its expired
            if(reset.expired < Date.now()) {
                error = "Link has expired";
            }
            // Check to see if it's been used
            if(reset.isUsed) {
                error = "Link has already been used";
            }
        } else {
            error = "Reset link does not exist";
        }
        
        res.render('resetLink', {
            error,
        });
    }

    /**
     * Update the user's password
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     * @returns 
     */
    async processPasswordReset(req,res) {
        // If the user is logged in they don't need to see this page
        if(req.user) {
            return res.redirect('/dashboard');
        }
        // Get the reset link
        let reset = await ResetLink.findOne({hash: req.params.hash});
        // Set up the error
        let error;
        // If the link exists
        if(reset) {
            // Check to see if its expired
            if(reset.expired < Date.now()) {
                error = "Link has expired";
            }
            // Check to see if it's been used
            if(reset.isUsed) {
                error = "Link has already been used";
            }

        } else {
            error = "Reset link does not exist";
        }
    
        // If there's no error we can reset the password safely
        if(!error) {
            // Get the user who matches the reset link
            let user = await User.findOne({_id: reset.belongsTo});
            // Get the passsword and confirmation from the body
            let {password, passwordConfirmation} = req.body;
            // If they don't match we got an error
            if(password != passwordConfirmation) { error = "passwords do not match"; }
            // Otherwise set the password and save the user
            else {
                await user.setPassword(password);
                await user.save();
            }
        
            // Mark the reset link as used and save it
            reset.isUsed = true;
            await reset.save();

            return res.redirect('/users/login');
        }
    
        // Show the resetlink if there was an erro
        res.render('resetLink', {
            error,
        });
    }

    /**
     * logout
     * 
     * Logs the user out
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async logout(req,res) {
        // Use passport saved in the request to log the user out
        req.logout(() => {
            req.flash('success', 'Now logged out');
            res.redirect('/users/login'); 
        });
    }

}

module.exports = new UserController(router);