
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Users = require('../models/user');
const ResetLink = require('../models/ResetLink');
const User = require('../models/user');
//login handle
router.get('/login',(req,res)=>{
    res.render('login');
})

//Register handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect: '/users/login',
        failureFlash : true
    })(req,res,next)
});


router.get('/reset/:hash', async (req,res) => {
    let reset = await ResetLink.findOne({hash: req.params.hash});
    let error;
    if(reset) {
        // Check to see if it's been used
        if(reset.expired < Date.now()) {
            error = "Link has expired";
        }
        if(reset.isUsed) {
            error = "Link has already been used";
        }
        // If both of those are not true, then we can use it
    } else {
        error = "Reset link does not exist";
    }

    res.render('resetLink', {
        error,
    });
});

router.post('/reset/:hash', async (req,res) => {
    let reset = await ResetLink.findOne({hash: req.params.hash});
    let error;
    if(reset) {
        // Check to see if it's been used
        if(reset.expired < Date.now()) {
            error = "Link has expired";
        }
        if(reset.isUsed) {
            error = "Link has already been used";
        }
        // If both of those are not true, then we can use it
    } else {
        error = "Reset link does not exist";
    }

    if(!error) {
        let user = await User.findOne({_id: reset.belongsTo});
        let {password, passwordConfirmation} = req.body;
        if(password != passwordConfirmation) { error = "passwords do not match"; }
        else {
            await user.setPassword(password);
            await user.save();
        }
    
        reset.isUsed = true;
        await reset.save();
        return res.redirect('/users/login');
    }

    res.render('resetLink', {
        error,
    });
});

//logout
router.get('/logout',(req,res)=>{
    req.logout(() => {
        req.flash('success_msg','Now logged out');
        res.redirect('/users/login'); 
    });
})
module.exports  = router;