const mongoose = require('mongoose');
const SuperUserSchema  = new mongoose.Schema({
    firstName :{
        type  : String,
        required : true
    } ,
    lastName :{
        type  : String,
        required : true
    } ,
    personalEmail :{
        type  : String,
        required : true
    } ,
    login :{
        type  : String,
        required : true
    } ,
    password :{
        type  : String,
        required : true
    } ,
    permissionLevel :{
        type  : String,
        default : "SuperUser"
    }  ,
    proposedCompany :{
        type: String,
        required : true
    }
});

const SuperUser= mongoose.model('SuperUser',SuperUserSchema);

module.exports = SuperUser;