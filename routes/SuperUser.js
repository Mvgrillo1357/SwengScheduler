const express = require('express');
const router = express.Router();
const SuperUser = require("../models/SuperUser");
const bcrypt = require('bcrypt');
const passport = require('passport');
//login handle
router.get('/login',(req,res)=>{
    res.render('login');
})
router.get('/register',(req,res)=>{
    res.render('register')
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
  router.post('/register',(req,res)=>{
    const { firstName, lastName, login, personalEmail, permissionLevel, proposedCompany} = req.body;
    let errors = [];
    console.log(' First Name: ' + firstName + ' Last Name :' + lastName + ' login :' + login  + 
    ' Personal Email :' + personalEmail + ' Permission Level :' + permissionLevel + 'Proposed Company :' + proposedCompany);
    if(!firstName || !lastName || !login || !personalEmail || !permissionLevel || !proposedCompany) {
        errors.push({msg : "Please fill in all fields"})
    }
    
    //check if password is more than 6 characters
    if(password.length < 6 ) {
        errors.push({msg : 'password atleast 6 characters'})
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
            res.render('register',{errors,firstName,lastName,personalEmail,permissionLevel,proposedCompany, password})  
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
            bcrypt.hash(newSuperUser.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newUser.password = hash;
                    //save user
                    newSuperUser.save()
                    .then((value)=>{
                        console.log(value)
                        req.flash('success_msg','You have now registered!');
                        res.redirect('/users/login');
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