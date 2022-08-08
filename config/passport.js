
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
    

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'login'},(login,password,done)=>{
            //match user
            User.findOne({login})
            .then((user)=>{
                if(!user){
                    return done(null,false,{message:'Email not registered.'});
                }
                //math passwords
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        user.lastLoggedIn = Date.now();
                        user.save();
                        return done(null,user);
                    } else{
                        return done(null,false,{message: 'Password is incorrect.'});
                    }
                })
            })
            .catch((err)=>{console.log(err)})
        })
    ),

    
    passport.serializeUser(function(user,done) {
        // If the user has a secret
        let require2fa = false;
        if(user.secret) {
            require2fa = true;
        }
        done(null,{id: user.id, require2fa});
    })
    passport.deserializeUser(function(obj,done){
        User.findById(obj.id,function(err,user){
            done(err,user);
        }).populate('organization');
    })
}