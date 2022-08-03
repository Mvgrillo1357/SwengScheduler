const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");
const dotenv = require('dotenv');
const checkIsInRole = require('./config/utils');
const MongoStore = require('connect-mongo');
const ENV = dotenv.config().parsed;
const username = ENV.MONGO_USERNAME;
const password = ENV.MONGO_PASSWORD;

//passport config:
require('./config/passport')(passport)
//mongoose
var uri = `mongodb+srv://${username}:${password}@swengschedule.geddkpi.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology : true})
    .then(() => console.log('connected,,'))
    .catch((err)=> console.log(err));


app.locals = ({
    user: {},
}); 

//EJS
app.set('view engine','ejs');
app.use(expressEjsLayout);
//BodyParser
app.use(express.urlencoded({extended : false}));
//express session
app.use(session({
    secret : 'secret',
    store: MongoStore.create({mongoUrl: uri}),
    resave : true,
    saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Serve images and public files through this directory
app.use(express.static('public'))


app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
})
    
//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use('/organization',require('./routes/SuperUser'));
app.use('/organization',
            checkIsInRole('Admin'),
            require('./routes/organization'));
app.use('/Manager',require('./routes/Manager'));
app.use('/EmployeeList',
            checkIsInRole('SuperUser', 'HR'),
            require('./routes/EmployeeList'));
app.use('/calendar', 
            checkIsInRole('Employee', 'Manager', 'SuperUser', 'HR'),
            require('./routes/calendar'));


app.listen(3000); 
