const express = require('express');
const router = express.Router();
const SuperUser = require("../models/SuperUser");
const bcrypt = require('bcrypt');
const passport = require('passport');
router.get('/create',(req,res)=>{
    res.render('SuperUser')
    })
//Register handle
router.post('/login',(req,res,next)=>{
passport.authenticate('local',{
    successRedirect : '/dashboard',
    failureRedirect: '/users/login',
    failureFlash : true
})(req,res,next)
})
  //register post handle
  router.post('/create',(req,res)=>{
    const { firstName, lastName, login, personalEmail, permissionLevel, proposedCompany} = req.body;
    let errors = [];
    console.log(' First Name: ' + firstName + ' Last Name :' + lastName + ' login :' + login  + 
    ' Personal Email :' + personalEmail + ' Permission Level :' + permissionLevel + 'Proposed Company :' + proposedCompany);
    if(!firstName || !lastName || !login || !personalEmail || !permissionLevel || !proposedCompany) {
        errors.push({msg : "Please fill in all fields"})
    }

    if(errors.length > 0 ) {
    res.render('register', {
        firstName : firstName, 
        lastName : lastName, 
        login : login,
        personalEmail: personalEmail,
        permissionLevel: permissionLevel,
        proposedCompany: proposedCompany})
     } else {
        //validation passed
       User.findOne({email : email}).exec((err,user)=>{
        console.log(user);   
        if(user) {
            errors.push({msg: 'email already registered'});
            res.render('register',{errors,firstName,lastName,personalEmail,permissionLevel,proposedCompany})  
           } else {
            const newSuperUser = new SuperUser({
                firstName : firstName, 
                lastName : lastName, 
                login : login,
                personalEmail: personalEmail,
                permissionLevel: permissionLevel,
                proposedCompany: proposedCompany
            });
    
            //hash password
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash("FirstP@ssw0rd",salt,  //newUser.password
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newSuperUser.password = hash;
                    //save user
                    newSuperUser.save()  // sending the data to mangooDb
                    .then((value)=>{
                        console.log(value)
                        req.flash('success_msg', login + ' has been created');
                        res.redirect('/users/login');      // need to be changed to the HR dashboard
                    })
                    .catch(value=> console.log(value));
                      
                }));
             }
       })
    }
    })
//logout
router.get('/logout',(req,res)=>{
req.logout();
req.flash('success_msg','Now logged out');
res.redirect('/users/login'); 
})
module.exports  = router;