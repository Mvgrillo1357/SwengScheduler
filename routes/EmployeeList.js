const express = require('express');
const router = express.Router();
const Users = require("../models/user");



router.get('/', async (req,res) =>{
    const users = await Users.find();
    res.render('EmployeeList',{
        user: req.user,
        users
    });
})





module.exports  = router;