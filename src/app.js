const express = require('express');
const chalk = require('chalk');
const path = require('path');
const hbs = require('hbs');
require('./db/mongoose');
const userRouter = require('../src/routers/user');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();

// Defining path for express use
const pathToPublicDir = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');

// setting up static directory to serve
app.use(express.static(pathToPublicDir));
app.use(express.json());
app.use(bodyParser.urlencoded({ 
    extended: true
}));
app.use(userRouter);

// setting up handler bar engine and views location
app.set('view engine','hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());  // connecting flash for messages

app.get('',(req, res) => {
   res.render('home', {
       title: 'Being Care Foundation | Home',
       name: 'being-care-foundation',
       message1: 'Donate for the One ',
       message2: `You'll get thousand`,
   });
});

app.get('/about',(req,res) => {
    res.render('about',{
        title : 'Being Care Foundation | About',
        name : 'being-care-foundation',
        message1: 'About ',
        message2: `Us`,
    });
});

app.get('/blog',(req,res) => {
    res.render('blog',{
        title : 'Being Care Foundation | Blog',
        name : 'being-care-foundation',
        message1: 'Blogs & ',
        message2: `Latest Updates!`,
        
    });
});

app.get('/contact',(req,res) => {
    res.render('contact',{
        title : 'Being Care Foundation | Contact',
        name : 'being-care-foundation',
        message1: 'Contact ',
        message2: `Us`,
    });
});

app.get('/faq',(req,res) => {
    res.render('faq',{
        title : 'Being Care Foundation | FAQs',
        name : 'being-care-foundation',
        message1: 'Frequently ',
        message2: `Asked Questions`,
    });
});

app.get('/register',(req,res) => {
    res.render('register',{
        title : 'Being Care Foundation | Register'
    });
});

app.get('/login',(req,res) => {
    res.render('login',{
        title : 'Being Care Foundation | Login'
    });
});

app.get('/resetPassword',(req,res) => {
    res.render('forgotpass',{
        title : 'Being Care Foundation | Reset Password'
    });
});



module.exports = app;