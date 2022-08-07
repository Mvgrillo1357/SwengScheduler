const express = require('express');
const router  = express.Router();
const Organization = require('../models/Organization');
const GoogleAuthenticator = require('passport-2fa-totp').GoogeAuthenticator;
var ObjectID = require('mongodb').ObjectId;
const User = require("../models/user");


const { Controller} = require("./controller");

class dashboardController extends Controller {

    async dashboard (req,res){
        const organizations = await Organization.find().populate('requestedBy');
        res.render('dashboard',{
            user: req.user,
            organizations
        });
    }

    async handle2fa (req, res, next) {
        const errors = req.flash('setup-2fa-error');
        const qrInfo = GoogleAuthenticator.register(req.user.login);
        var has2fa = false;
        req.session.qr = qrInfo.secret;
        if(req.user.secret!=null) {
            has2fa = true;
        }
        return res.render('setup-2fa', {
            has2fa: has2fa,
            errors: errors,
            qr: qrInfo.qr
        });
    }

    async registerhandle (req, res, next) {
        if (!req.session.qr) {
            req.flash('setup-2fa-error', 'The Account cannot be registered. Please try again.');
            return res.redirect('/setup-2fa');
        }
        
        User.findOne({_id: req.user._id}).then(user=> {
            
            if (!user) {
                // User is not found. It might be removed directly from the database.
                //req.dashboard();
                return res.redirect('/');
            }
            
            // user.updateOne(user, { $set: { secret: req.session.qr } }, function (err) {
            //     if (err) {
            //         req.flash('setup-2fa-error', err);
            //         return res.redirect('/setup-2fa');
            //     }
                
            //     res.redirect('/dashboard');
            // }); 
            user.secret = req.session.qr;
            user.save();
            res.redirect('/dashboard');     
        });
    }
}

module.exports = new dashboardController(router);
