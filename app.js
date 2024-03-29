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
const {ensureAuthenticated} = require('./config/auth') 
// Passport singleton setup
require('./config/passport')(passport)
// Set up the Mongoose URL
var uri = `mongodb+srv://${username}:${password}@swengschedule.geddkpi.mongodb.net/?retryWrites=true&w=majority`;

// Try to connect to mongoose
mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology : true})
    .then(() => console.log('connected,,'))
    .catch((err)=> console.log(err));

//EJS
app.set('view engine','ejs');
app.use(expressEjsLayout);
//BodyParser - for JSON
app.use(express.json());
app.use(express.urlencoded({extended : false}));
//express session
// Set up the session to be saved in the database using hte same mongo url
app.use(session({
    secret : 'secret',
    store: MongoStore.create({mongoUrl: uri}),
    resave : true,
    saveUninitialized : true
}));
// Set up the passport MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());
// Set up Flash Middleware
app.use(flash());

// Serve images and public files through this directory
app.use(express.static('public'))

// Set up the Flash middleware
app.use((req,res,next)=> {
    const MSG_TYPES = ['success', 'info', 'warning', 'error'];
    app.locals.messages = [];

    MSG_TYPES.forEach((type) => {
        req.flash(type).forEach(msg => {
            app.locals.messages.push({type, text:msg})
        });
    });

    next();
});

// Set up the user if we don't have one
app.use((req,res,next) => {
    if(req.user) app.locals.user = req.user;
    else app.locals.user = {};
    next();
});

// Set up the authrozatino middleware
app.use((req,res,next) => {
    // Ignore the base and login path
    if(req.path == '/' || req.path == '/users/login' || req.path == '/users/logout') return next();
    
    // If the user is termianted then redirect them back to welcome
    if(req.user && req.user.status == 'terminated') {
        req.flash('error', `You have been terminated from ${req.user.organization.name}. Please contact your HR representative for more details.`);
        return res.redirect('/');
    }

    // If the user's organization is pending or denied, redirect them to back to welcome
    if(req.user && req.user.role !='Admin' && req.user.organization.status != 'Approved') {
        if(req.user.organization.status == 'Pending')
            req.flash('warning', `Your organization is ${req.user.organization.status}. Please wait until it is approved.`);
        if(req.user.organization.status == 'Denied')
            req.flash('error', `Your organization is ${req.user.organization.status}. Please contact our team for more information.`);
        return res.redirect('/');
    }
    next();
});

// 2FA Middleware, basically it keeps the user from accessing any prilvedge pages without entering in the 2fa code
// if they have a secret
app.use((req, res, next) => {
    if(req.path != '/confirm-2fa' && req.session.passport) {
        if(req.session.passport.user) {
            if(req.session.passport.user.require2fa) {
                req.flash('warning', 'Enter in 2fa information');
                return res.redirect('/confirm-2fa');
            }
        }
    }
    next();
});

// ALL THE ROUTES
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use('/organization',require('./routes/SuperUser'));
app.use('/organization',
            checkIsInRole('Admin'),
            require('./routes/organization'));
app.use('/EmployeeList',
            checkIsInRole('Manager', 'SuperUser', 'HR'),
            require('./routes/EmployeeList'));
app.use('/calendar', 
            checkIsInRole('Employee', 'Manager', 'SuperUser', 'HR'),
            require('./routes/calendar'));
app.use('/casesUser', 
            checkIsInRole('Employee', 'Manager', 'SuperUser', 'HR'), 
            require('./routes/casesUser.js'));
app.use('/casesHR', 
            checkIsInRole('SuperUser', 'HR'), 
            require('./routes/casesHR.js'));
app.use('/admin', 
            checkIsInRole('Manager', 'SuperUser', 'HR'),
            require('./routes/admin'));
app.use('/', ensureAuthenticated,require('./routes/dashboard'));
 
/**
  * Error catching middleware 
  * 
  * Catch Any Errors that we do not explicity catch and show an error message to the user and send an email to the admins
  */
app.use((err, req, res, next) => {
    // Send an email to the admins to let them know an error occured with their application
    const Mailer = require('./config/mailer');
    const mail = new Mailer();
    mail.sendMail({
        to: 'SwengAdmin@SwengScheduler.com',
        from: 'no-reply@SwengScheduler.com',
        subject: "An error occurred with the application",
        msg: `
        This is a notification to let you know that there was an error with SwengScheduler: ${err.message}
            <pre>${err.stack}</pre>
        `,
    });
   
    // Show the general error page for the user
   res.render('error');
});

// Start up on port 3000
app.listen(3000); 
