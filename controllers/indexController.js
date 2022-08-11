const express = require('express');
const User = require('../models/user');
const router  = express.Router();
const ResetLink = require("../models/ResetLink");
const crypto = require('crypto');
const totp = require('notp').totp;
var GoogleAuthenticator = require('passport-2fa-totp').GoogeAuthenticator;

const { Controller} = require("./controller");

/**
 * Index Controller
 * 
 * Responsible for showing some general pages like welcome,login, register,
 * and reset password and 2fa
 */
class indexController extends Controller {
    /**
     * Show the welcome page
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async login (req,res){
        res.render('welcome');
    }

    /**
     * @Deprecated
     * Show the register page
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async register (req,res){
        res.render('register');
    }

    /**
     * Show the reset password form
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async resetPassword(req, res) {
        res.render('resetPassword');
    }
    
    /**
     * Show the confirm 2fa form
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async check2fa (req,res){
        res.render('confirm-2fa');
    }

    /**
     * Process the 2fa and check to make sure the user's code matches the generated locally
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     * @returns 
     */
    async check2faAction (req, res) {
        // Set the session to make it so that true or false the user doesn't need to be on the 2fa form
        req.session.passport.user.require2fa = false;
        // Get the code
        let code = req.body.code;

        // Get the secret from the session
        var secret = GoogleAuthenticator.decodeSecret(req.user.secret);
        
        // https://github.com/guyht/notp#hotpverifytoken-key-opt
        // Documentaiton on how to use totp to verify the code
        let isValid = totp.verify(code, secret, {
            window: 6,
            time: 30
        });

        // If isValid is Null the code is invalid and they should not be logged in
        if(isValid == null) {
            req.flash('warning', 'Incorrect 2fa code')
            return res.redirect('/users/logout');
        }
        // then set the session to allow them through
        // Check property to see if delta exists
        // WOrkaround for when delta is zero and it evalutes to false
        else if('delta' in isValid) {
            return res.redirect('/dashboard');            
        }
        // Double checking to make sure if it's there
        else if(isValid.delta == 0 || isValid.delta) {
            return res.redirect('/dashboard');            
        }
        
        req.flash('warning', 'Incorrect 2fa code')
        return res.redirect('/users/logout');
    }
    
    /**
     * resetPasswordAction
     * 
     * Sends the user a reset password link
     * 
     * @param {Request} req Express Request
     * @param {Response} res Express Response
     */
    async resetPasswordAction(req, res) {
        // Get the user that matches the login or email from the form
        let { login } = req.body;
        let user = await User.findOne({
            $or: [{login: login}, 
                   {personalEmail: login}]
        });

        // IF the user exists
        if(user) {
            // Set up the mailer and reset link and send it
            const Mailer = require('../config/mailer');
            const mail = new Mailer();
            let link = await ResetLink.create({
                belongsTo: user,
                hash: crypto.randomUUID(),
                expires: Date.now() + 24 * 60 * 60 * 1000,
            });
            await link.save();
    
    
            let resetUrl = `http://${req.hostname}:${req.socket.localPort}/users/reset/${link.hash}`;
            // Send it
            let mailer = new Mailer();
            mail.sendMail({
                to: user.personalEmail, 
                from: 'no-reply@swengScheduler.com',
                subject: 'password reset link', 
                msg: `
            Hello ${user.firstName},
            This is a message to let you know that you can reset your password at the following link:
    
            <a href="${resetUrl}">${resetUrl}</a>
    
            The link will only work for 24 hours from this email and can only be used once.
            
            Thank you.`
            });
            req.flash('success', 'An email has been sent to reset your password');
        }
        else {
            req.flash('warning', 'We did not find a login or email that matched what you put in');
        }
        res.redirect('/');
    }
}

module.exports = new indexController(router);
