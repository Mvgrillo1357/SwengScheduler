
// const express = require('express');
// const router = express.Router();
// const Manager = require("../models/Manager"); // assigning the exact DB
// const bcrypt = require('bcrypt');
// const passport = require('passport');
// //login handle
// // router.get('/login',(req,res)=>{
// //     res.render('login');
// // })
// router.get('/create',(req,res)=>{
//     res.render('Manager')
//     })
// //Register handle
// router.post('/login',(req,res,next)=>{
// passport.authenticate('local',{
//     successRedirect : '/dashboard',
//     failureRedirect: '/users/login', // need to be changed to the HR dashboard
//     failureFlash : true
// })(req,res,next)
// })
//   //register post handle
//   router.post('/create',(req,res)=>{
//     const { firstName, lastName, login, dateOfHire, permissionLevel, numberOfReports, personalEmail, } = req.body;
//     let errors = [];

//     console.log(' First Name: ' + firstName + ' Last Name :' + lastName + + ' login :' + login  + ' Date Of Hire :' + dateOfHire  + ' Permission Level :' + permissionLevel  + ' Number Of Reports :' + numberOfReports  + ' Personal Email :' + personalEmail);
//     if(!firstName || !lastName || !login || !dateOfHire || !permissionLevel || !numberOfReports || !personalEmail) {
//         errors.push({msg : "Please fill in all fields"})
//     }


//     if(errors.length > 0 ) {
//     res.render('Manager', {
//         errors : errors,
//         firstName : firstName, 
//         lastName : lastName, 
//         login : login,
//         dateOfHire: dateOfHire, 
//         permissionLevel : permissionLevel, 
//         numberOfReports : numberOfReports,
//         personalEmail: personalEmail,
//         })
//      } else {
//         //validation passed
//        Manager.findOne({$or : [ {personalEmail : personalEmail} ,{ login : login}]}).exec((err,manager)=>{ // how to do or?
//         console.log(manager);   
//         if(manager) {
//             if( manager.personalEmail == personalEmail){
//                 errors.push({msg: 'email already registered'});
//             }
//             if( manager.login == login) {
//                 errors.push({msg: 'login already used'});
//             }
//             res.render('Manager',{errors, firstName, lastName, login, dateOfHire, permissionLevel, numberOfReports, personalEmail })  
//            } 
//            else {
//             const newManager = new Manager({
//                 firstName : firstName, 
//                 lastName : lastName, 
//                 login : login,
//                 dateOfHire: dateOfHire, 
//                 permissionLevel : permissionLevel, 
//                 numberOfReports : numberOfReports,
//                 personalEmail: personalEmail
//             });
    
//             //hash password
//             bcrypt.genSalt(10,(err,salt)=> 
//             bcrypt.hash("FirstP@ssw0rd",salt,  //newUser.password
//                 (err,hash)=> {
//                     if(err) throw err;
//                         //save pass to hash
//                         newManager.password = hash;
//                     //save user
//                     newManager.save()  // sending the data to mangooDb
//                     .then((value)=>{
//                         console.log(value)
//                         req.flash('success_msg', login + ' has been created');
//                         res.redirect('/users/login');      // need to be changed to the HR dashboard
//                     })
//                     .catch(value=> console.log(value));
                      
//                 }));
//              }
//        })
//     }
//     })
// //logout
// router.get('/logout',(req,res)=>{
// req.logout();
// req.flash('success_msg','Now logged out');
// res.redirect('/users/login'); 
// })
// module.exports  = router;