const express = require('express');
const router  = express.Router();


const { Controller} = require("./controller");

class indexController extends Controller {
    async login (req,res){
        res.render('welcome');
    }

    async register (req,res){
        res.render('register');
    }
}

module.exports = new indexController(router);
