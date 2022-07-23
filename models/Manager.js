const mongoose = require('mongoose');
const User = require('./user');

const Manager = User.discriminator('Manager', 
    new mongoose.Schema(
        // Custom SuperUser Fields here
        { }, 
        // What key to use for the discriminator
        {discriminatorKey: 'role'}
    )
);
    
module.exports = Manager;



// const mongoose = require('mongoose');
 
// // class Manager{
// //     mangodb;

// //     User(mangodb) {
// //         this.mangoDb = mangoDb;
// //     }

// //     getInformation(){

// //     }


// //     createManger(prams){
// //         this.mangoDb.createManger(params);
        
// //     }

// //     getManager({name: name}) {
// //         this.mangoConnection.findOne({
// //             name: name,
// //         })

// //     }

// //     // mangoConnection;

// // }

// const ManagerSchema  = new mongoose.Schema({
//     firstName :{
//         type  : String,
//         required : true
//     } ,
//     lastName :{
//         type  : String,
//         required : true
//     } ,
//     personalEmail :{
//         type  : String,
//         required : true
//     } ,
//     login :{
//         type  : String,
//         required : true
//     } ,
//     password :{
//         type  : String,
//         required : true
//     } ,
//     dateOfHire :{
//         type : Date,
//         default : Date.now
//     },
//     numberOfReports :{
//         type  : String,
//     } ,
//     permissionLevel :{
//         type  : String,
//         default : "Manager"
//     } 
//   });
//   const Manager= mongoose.model('Manager',ManagerSchema);

// module.exports = Manager;