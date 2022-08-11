const express = require('express');
const router  = express.Router();
const Organization = require('../models/Organization');
const GoogleAuthenticator = require('passport-2fa-totp').GoogeAuthenticator;
const User = require("../models/user");

const { Controller} = require("./controller");

/**
 * Dashboard Controller handles the routes that are related to the user's dashboard
 * 
 * SUch as the dashbord route and RFA
 */
class dashboardController extends Controller {

    /**
     * dashboard
     * 
     * This endpoint is responsible for rendering the dashboard for the current user
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async dashboard (req,res){
        // Get all the organizations -- this is really only important for the admin user
        const organizations = await Organization.find().populate('requestedBy');
        res.render('dashboard',{
            user: req.user,
            organizations
        });
    }

    /**
     * handle2fa 
     * 
     * Shows the 2fa page
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     * @returns Response render object
     */
    async handle2fa (req, res) {
        // Sets up the error flash
        const errors = req.flash('setup-2fa-error');
        // Use the user's login to register a new QR INFO object and set it in the session
        const qrInfo = GoogleAuthenticator.register(req.user.login);
        req.session.qr = qrInfo.secret;
        
        // Check if the current user has a secret
        var has2fa = false;
        if(req.user.secret!=null) {
            has2fa = true;
        }

        return res.render('setup-2fa', {
            has2fa: has2fa,
            errors: errors,
            qr: qrInfo.qr
        });
    }

    /**
     * registerHandle
     * 
     * Saves the 2FA if the user pressed the save button
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     * @returns 
     */
    async registerhandle (req, res) {
        // Make sure we have the qr code saved in the session if not show an error
        if (!req.session.qr) {
            req.flash('setup-2fa-error', 'The Account cannot be registered. Please try again.');
            return res.redirect('/setup-2fa');
        }
        
        // Find the user
        User.findOne({_id: req.user._id}).then(user=> {
            
            if (!user) {
                // User is not found. It might be removed directly from the database.
                return res.redirect('/');
            }
            
            // Set the user's secret to the qr and save
            user.secret = req.session.qr;
            user.save();
            res.redirect('/dashboard');     
        });
    }
}

module.exports = new dashboardController(router);
