const mongoose = require('mongoose');
const SuperUserSchema  = new mongoose.Schema({
  name :{
      type  : String,
      required : true
  } ,
  email :{
    type  : String,
    required : true
} ,
password :{
    type  : String,
    required : true
} ,
date :{
    type : Date,
    default : Date.now
} ,
proposedCompany : {
    type : String,
    required : true
}
/*
may implement this in the future
permissionLevel :{
    type  : String,
    default : "SuperUser"
} 
*/

});

const SuperUser= mongoose.model('SuperUser',SuperUserSchema);

module.exports = SuperUser;