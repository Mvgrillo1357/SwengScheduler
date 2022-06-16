const express = require('express');
const router = express.Router();
const SuperUser = require("../models/SuperUser");
const Organization = require("../models/Organization");
const passport = require('passport');

/** 
 * 
 * Login Route // Should be moved to a central spot for just users
 * 
 * */

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect: '/users/login',
        failureFlash : true
    })(req,res,next)
});

/**
 * Organization Request Route
 * 
 * Allows users to request an organization
 * 
 * Prompt the user for their information and the proposed organization's name
 * 
 * URL : /organization/create
 * 
 */
router.get('/create', (req,res) =>{
    res.render('SuperUser')
});

// Save the SuperUser and Organization to the Database
router.post('/create', async (req,res) => {
    // Convience function render errors 
    function renderError(error) {
        res.render('SuperUser', {
            firstName, 
            lastName, 
            login,
            personalEmail,
            proposedCompany,
            errors: [{msg: error}],
        });
    }

    const { firstName, lastName, login, personalEmail, password, passwordConfirmation, proposedCompany } = req.body;
    console.log(password, passwordConfirmation);
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
});
//logout
router.get('/logout',(req,res)=>{
req.logout();
req.flash('success_msg','Now logged out');
res.redirect('/users/login'); 
})
module.exports  = router;