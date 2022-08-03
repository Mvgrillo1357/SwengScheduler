
const express = require('express');
const router = express.Router();

//login handle
router.get('/',(req,res)=>{
    res.render('Admin');
})

module.exports  = router;