const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const options = { discriminatorKey: 'role' };

const UserSchema  = new mongoose.Schema({
    firstName :{
        type  : String,
        required : [true, 'Must enter first name'],
    },
    lastName :{
        type  : String,
        required : [true, 'Must enter last naem'],
    },
    personalEmail :{
        type  : String,
        required : [true, 'Must enter personal email'],
        unique: [true, "Email Already exists"],
    },
    login :{
        type  : String,
        required : [true, 'Must enter a login/username'],
        unique: [true, "Login is already in use"],
    },
    password : {
        type  : String,
        required : [true, 'Must have a password']
    },
    dateOfHire :{
        type : Date,
        default : Date.now
    },
    numberOfReports :{
        type  : Number,
    },
    permissionLevel :{
        type  : Number,
        default: 1,
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Organization', 
    },
    secret: {
        type: String,
    }
}, options);

UserSchema.virtual('name')
    .get(function() {
        return this.firstName + ' ' + this.lastName;
    });

UserSchema.methods.setPassword = async function(newPassword) {
    const user = this;
    return new Promise( function(resolve, reject) {
        bcrypt.genSalt(10, function (err,salt) {
            if(err) reject(err)
            bcrypt.hash(newPassword, salt,
                function (err,hash)  {
                    if(err) reject(err);
                    user.password = hash;
                    resolve();
                }
            )
        });
    });
};
const User = mongoose.model('User',UserSchema);

module.exports = User;