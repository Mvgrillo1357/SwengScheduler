const express = require('express');
const router = express.Router();
const SuperUser = require("../models/SuperUser"); // assigning the exact DB
const bcrypt = require('bcrypt');
const passport = require('passport');
//login handle
// router.get('/login',(req,res)=>{
//     res.render('login');
// })
router.get('/create',(req,res)=>{
    res.render('SuperUser')
    })
//Register handle
router.post('/login',(req,res,next)=>{
passport.authenticate('local',{
    successRedirect : '/dashboard',
    failureRedirect: '/users/login', // need to be changed to the HR dashboard
    failureFlash : true
})(req,res,next)
})
  //register post handle
  router.post('/create',(req,res)=>{
    const { firstName, lastName, login, personalEmail, proposedCompany, } = req.body;
    let errors = [];

    console.log(' First Name: ' + firstName + ' Last Name :' + lastName + ' login :' + login  + ' Personal Email :' + personalEmail + 'Proposed Company :' + proposedCompany);
    if(!firstName || !lastName || !login ||  !personalEmail || !proposedCompany) {
        errors.push({msg : "Please fill in all fields"})
    }


    if(errors.length > 0 ) {
    res.render('SuperUser', {
        errors : errors,
        firstName : firstName, 
        lastName : lastName, 
        login : login,
        personalEmail: personalEmail,
        proposedCompany: proposedCompany,
        })
     } else {
        //validation passed
       SuperUser.findOne({$or : [ {personalEmail : personalEmail} ,{ login : login}]}).exec((err,superuser)=>{ // how to do or?
        console.log(superuser);   
        if(superuser) {
            if( superuser.personalEmail == personalEmail){
                errors.push({msg: 'email already registered'});
            }
            if( superuser.login == login) {
                errors.push({msg: 'login already used'});
            }
            res.render('SuperUser',{errors, firstName, lastName, login, dateOfHire, permissionLevel, numberOfReports, personalEmail })  
           } 
           else {
            const newSuperUser = new SuperUser({
                firstName : firstName, 
                lastName : lastName, 
                login : login,
                personalEmail: personalEmail,
                proposedCompany: proposedCompany,
            });
    
            //hash password
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash("FirstP@ssw0rd",salt,  //newUser.password
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newSuperUser.password = hash;
                    //save Super User
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