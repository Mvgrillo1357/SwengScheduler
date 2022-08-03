const express = require('express');
const router = express.Router();
const Users = require("../models/user");
const Employee = require("../models/user");
const ResetLink = require("../models/ResetLink");
const crypto = require('crypto');
const mailer = require('../config/mailer');
const Mailer = require('../config/mailer');
const { hostname } = require('os');

router.get('/', async (req,res) =>{
    const users = await Users.find({organization: req.user.organization._id});
    res.render('EmployeeList',{
        user: req.user,
        users
    });
});
router.get('/create', async (req,res) =>{
    res.render('createEmployee', {
        roles: req.user.getRoles(),
        e: null,
    });
});

router.post('/create', async (req,res) =>{
    // Check to see if user exists
    let {firstName, lastName, login, personalEmail, role} = req.body;
    // If the user doesn't exist then create them
    let newUser = new Users({
        firstName,
        lastName,
        login,
        personalEmail,
        organization: req.user.organization,
    });

    await newUser.setPassword(crypto.randomUUID());
    try{
        await newUser.save();
    }
    catch(e) {
        console.log(e);
        let msg = "An unknown database error occured";
        if(e.toString().includes("duplicate key")) {
            msg = "Duplicate value. Please choose a different email";
        }
        return res.render('createEmployee', {
            roles: req.user.getRoles(),
            e: msg,
        });
    }
    

    await newUser.setRole(role);

    // Send the user an email to reset their password

        // Validate the changes and if there is anything invalid, render the create form with the values

    // After the user is created, email them a link to login with

    // Finally redirect back to the employee list page
    res.redirect('/EmployeeList');
});

router.get('/:id', async (req,res) =>{
    // Validate User permission and check the user exists

    // Query for the user
    let user = await Users.findOne({_id: req.params.id});
    // Render the update form
    res.render('editEmployee', {
        updateUser: user,
    });
});

router.get('/:id/resetLink', async (req,res) =>{
    // Validate User permission and check the user exists

    // Query for the user
    let user = await Users.findOne({_id: req.params.id});

    // Create the reset link
    let link = await ResetLink.create({
        belongsTo: user,
        hash: crypto.randomUUID(),
        expires: Date.now() + 24 * 60 * 60 * 1000,
    });
    await link.save();


    let resetUrl = `http://${req.hostname}:${req.socket.localPort}/users/reset/${link.hash}`;
    // Send it
    let mailer = new Mailer();
    mailer.sendMail({
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

    // Render the update form
    res.render('editEmployee', {
        updateUser: user,
    });
});

router.post('/:id', async (req,res) =>{
    // Validate User Permission and check the user exists

    // Update the values for the user
    let {firstName, lastName, personalEmail, role} = req.body;
    // If the user doesn't exist then create them
    await Users.updateOne({
        _id: req.params.id,
    },{
        firstName,
        lastName,
        personalEmail,
    });

    let updateUser = await Users.findOne({_id: req.params.id});
    await updateUser.setRole(role);
    // Validate the changes

    res.redirect('/EmployeeList');
    // res.render('editEmployee', {
    //     updateUser,
    // });
});





module.exports  = router;