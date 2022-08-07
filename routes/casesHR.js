const casesHRController = require('../controllers/casesHRController');


const express = require('express');
const router = express.Router();
const Case = require("../models/Case");

// EmployeeListController.get('/', EmployeeListController.index);
casesHRController.get('/', casesHRController.index);

casesHRController.get('/comments/:id', casesHRController.getCommentsListRender);


// notes: [{
//     comment: { type: String },
//     writer: {
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User',
//     },
//     timeStamp: {type: Date},
// }],

casesHRController.post('/comments/:_id', casesHRController.postCommentsListRender);

// router.get('/approve/:id', async (req,res) =>{
//     try {
//     const org = await Organization.findOne({_id: req.params.id});
//     org.status = "Approved";
//     org.save();
//     res.redirect('/dashboard');
//     }catch (e) {
//         res.redirect('/dashboard');
//     }
// });
// router.get('/deny/:id', async (req,res) =>{
//     const org = await Organization.findOne({_id: req.params.id});
//     org.status = "Denied";
//     org.save();
//     res.redirect('/dashboard');
// });
// router.get('/delete/:id', async (req,res) =>{
//     const org = await Organization.deleteOne({_id: req.params.id});
//     req.flash('msg', 'organization was deleted');
//     res.redirect('/dashboard');
// });

// need to resolve cases
// status: {
//     type: String,
//     default: 'un-assigned',
//     enum: ['in-progress', 'resolved', 'denied', 'un-assigned'],
// },
casesHRController.post('/status/:_id', casesHRController.postCommentsUpdateStatus);

// module.exports  = EmployeeListController.getRouter();
module.exports  = casesHRController.getRouter();