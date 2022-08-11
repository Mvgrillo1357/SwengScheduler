const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
    

/**
 * Passport export
 * 
 * This class is responsible for validating the user, setting the user in the request object
 * and it also seralizesa and deserializes the user
 * 
 * 
 * @param {passport} passport The passport middleware
 */
module.exports = function(passport){
    // Set up the LocalStrategy to use a local database
    passport.use(
        new LocalStrategy({usernameField: 'login'},(login,password,done)=>{
            // Look up the user based on the login
            User.findOne({login})
            .then((user)=>{
                // If the user is not found then there is no login that matches
                if(!user){
                    return done(null,false,{message:'Login not registered.'});
                }
                
                //Match the password
                // Use bcrypt to encrypt the password and compare it
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        // If it's a match update the logged in status
                        user.lastLoggedIn = Date.now();
                        user.save();
                        // Return the user
                        return done(null,user);
                    } else{
                        // Otherwise return the password is icorrect
                        return done(null,false,{message: 'Password is incorrect.'});
                    }
                })
            })
            // Catch any errors and log them to the console.
            .catch((err)=>{console.log(err)})
        })
    ),

    // Set up the Serialize suer function
    passport.serializeUser(function(user,done) {
        // If the user has a secret set a variable
        let require2fa = false;
        if(user.secret) {
            require2fa = true;
        }
        // Pass back the user id's and if they have a secret
        done(null,{id: user.id, require2fa});
    })
    // deserialize user
    passport.deserializeUser(function(obj,done){
        // Find the user in the database
        User.findById(obj.id,function(err,user){
            // Return the use
            done(err,user);
        }).populate('organization'); // Make sure to populate any organizations the user has.
    })
}