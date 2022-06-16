const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require('../config/auth') 
const Organization = require('../models/Organization');
//login page
router.get('/', (req,res)=>{
    res.render('welcome');
})
//register page
router.get('/register', (req,res)=>{
    res.render('register');
})
router.get('/dashboard',ensureAuthenticated, async (req,res)=>{
    const organizations = await Organization.find().populate('requestedBy');
    res.render('dashboard',{
        user: req.user,
        organizations
    });
})
module.exports = router; 