const express = require('express');
const router = express.Router();
const SuperUser = require("../models/SuperUser");
const Organization = require("../models/Organization");
const passport = require('passport');

const { Controller} = require("./controller");

class SuperUserController extends Controller {
    async create (req,res) {
        res.render('SuperUser')
    }

    async creatorHandle (req,res)  {
        // Convience function render errors 
        function renderError(error) {
            res.render('SuperUser', {
                firstName, 
                lastName, 
                login,
                personalEmail,
                proposedCompany,
                messages: [{text: error, type: "error"}],
            });
        }
    
        const { firstName, lastName, login, personalEmail, password, passwordConfirmation, proposedCompany } = req.body;
        
        if(password == '' || password != passwordConfirmation) { 
            renderError("Passwords do not match or are empty");
            return;
        }
    
        let exists = await Promise.all( [ SuperUser.exists({login}), SuperUser.exists({personalEmail}) ]);
    
        if(exists.some(item => !!item)) {
            renderError("Email or login already exists");
            return;
        }
    
        // Create the Super User, validate and throw an error if we have one
        const newSuperUser = new SuperUser({
            firstName, 
            lastName, 
            login,
            personalEmail,
        });
    
        await newSuperUser.setPassword(password);
        let err = newSuperUser.validateSync();
        if(err) { renderError(JSON.stringify(err)); }
        
        
        exists = await Organization.exists({name: proposedCompany});
        if(exists) {
            renderError("Company name is in use");
            return;
        }
    
        // Create an organization and set the user, throw an error if we have one.
        const newOrganization = new Organization({
            name: proposedCompany,
            requestedBy: newSuperUser._id,
        });
    
    
        err = newOrganization.validateSync();
        if(err) { renderError(JSON.stringify(err)); }
    
        newSuperUser.organization = newOrganization._id;
        // ALL GOOD -- SAVE THEM
        await newSuperUser.save();
        await newOrganization.save();
    
        req.flash('success_msg', "Your organization has been requested. You will see an email when it has been approved or denied");
        res.redirect('/users/login');
    }

}

module.exports = new SuperUserController(router);