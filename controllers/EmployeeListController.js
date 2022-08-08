const express = require('express');
const router = express.Router();

const Users = require("../models/user");
const ResetLink = require("../models/ResetLink");
const crypto = require('crypto');
const Mailer = require('../config/mailer');

const { Controller } = require('./controller');

class EmployeeList extends Controller {

    async index (req, res) {
        const users = await Users.find({
            organization: req.user.organization._id
        }).populate('manager');
        res.render('EmployeeList',{
            user: req.user,
            users
        });
    }

    async index(req, res) {
        const users = await Users.find({
            organization: req.user.organization._id
        }).populate('manager');
        res.render('EmployeeList',{
            user: req.user,
            users
        });
    }

    async createForm(req, res) {
        const managers = await Users.find({
            role: ['Manager', 'HR', 'SuperUser'], 
            organization: req.user.organization
        });
    
        res.render('createEmployee', {
            roles: req.user.getRoles(),
            managers
        });
    }

    async createAction(req, res) {
            let {firstName, lastName, login, personalEmail, role, manager} = req.body;
            // Check to see if user exists
            
            if(manager == '') manager = null;
            // If the user doesn't exist then create them
            let newUser = new Users({
                firstName,
                lastName,
                login,
                personalEmail,
                organization: req.user.organization,
                manager
            });
        
            await newUser.setPassword(crypto.randomUUID());
            // Validate the changes and if there is anything invalid, render the create form with the values
            try{
                await newUser.validate();
                await newUser.save();
            }
            catch(e) {
                newUser.role = req.body.role;
                return res.render('createEmployee', {
                    messages: [{type: 'error', text:e}],
                    data: newUser,
                    roles: req.user.getRoles(),
                    managers: await Users.find({
                        role: ['Manager', 'HR', 'SuperUser'], 
                        organization: req.user.organization
                    })
                });
            }

            await newUser.setRole(role);
        
            // After the user is created, email them a link to login with
            let link = await ResetLink.create({
                belongsTo: newUser,
                hash: crypto.randomUUID(),
                expires: Date.now() + 24 * 60 * 60 * 1000,
            });
        
            await link.save();
        
            let resetUrl = `http://${req.hostname}:${req.socket.localPort}/users/reset/${link.hash}`;
            let mailer = new Mailer();
            // Send the user an email to reset their password
            mailer.sendMail({
                to: newUser.personalEmail, 
                from: 'no-reply@swengScheduler.com',
                subject: 'New Account', 
                msg: `
            Hello ${newUser.firstName},
            This is a message to let you know that you have been added to the ${req.user.organization.name} in SwengScheduler.
            
            You can reset your password at the following link:
        
            <a href="${resetUrl}">${resetUrl}</a>
        
            The link will only work for 24 hours from this email and can only be used once.
            
            If the link has expired, please request a new link from ${req.user.personalEmail}.
        
            Thank you.`
            });
        

            // Finally redirect back to the employee list page
            res.redirect('/EmployeeList');
    }

    async show(req, res) {
        const managers = await Users.find({role: ['Manager', 'HR', 'SuperUser'], organization: req.user.organization});
        // Validate User permission and check the user exists

        // Query for the user
        let user = await Users.findOne({_id: req.params.id}).populate('manager');

        // Render the update form
        res.render('editEmployee', {
            updateUser: user,
            managers,
        });
    }

    async resetPassword(req, res) {
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


        req.flash('success', `Reset link has been emailed to ${user.personalEmail}`);
        // redirect
        res.redirect(`/EmployeeList/${user._id}`);
    }

    async updateAction(req, res) {
        // Validate User Permission and check the user exists
        
        // Update the values for the user
        let {firstName, lastName, personalEmail, role, manager} = req.body;
        // This is for MongoDB, you can't pass a blank string in for manager, you need to pass in null
        // if you want a blank manager otherwise it throws an error about CastType
        if(manager == '') { 
            manager = null; 
        }
        
        let updateUser = await Users.findOne({_id: req.params.id});

        // If the user cannot change role, give an error message and return
        let [canChange, msg] = await updateUser.canChangeRole(role, req.user);

        if(!canChange) {
            req.flash('error', msg);
            return res.redirect(`/EmployeeList/${updateUser._id}`);
        }

        
        // Update the user
        await Users.updateOne({
            _id: req.params.id,
        },{
            firstName,
            lastName,
            personalEmail,
            manager
        });

        
        
        await updateUser.setRole(role);
        // Validate the changes

        res.redirect('/EmployeeList');
        // res.render('editEmployee', {
        //     updateUser,
        // });
    }

    async terminate(req, res) {
        // this is to terminate an employee
        // find the user
        let user = await Users.findOne({_id: req.params.id});
        // Check to see if the user is managing any people
        let managedEmployees = await Users.find({manager: user});
        if(managedEmployees.length > 0) {
            let names = managedEmployees.map((item) => item.name).join('\n\t');
            req.flash('error', `${user.name} cannot be terminated until they no longer manager any employees. \nThey currently manage the following employees: \n\t${names}`);
            return res.redirect('/EmployeeList');
        }

        //set the status to terminated
        user.status= "terminated"
        await user.save();
        req.flash('success', "Employee has been marked terminated");
        // reurn to employee list
        res.redirect('/EmployeeList');

    }

    async activate(req, res) {
        // this is to terminate an employee
        // find the user
        let user = await Users.findOne({_id: req.params.id});
        //set the status to terminated
        user.status= "active"
        await user.save();
        req.flash('success', "Employee has been marked active");
        // reurn to employee list
        res.redirect('/EmployeeList');
    }


}

module.exports = new EmployeeList(router);
