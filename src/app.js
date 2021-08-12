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
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const jwt = require('jsonwebtoken');

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
// app.use(cookieParser);

// setting up handler bar engine and views location
app.set('view engine','hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());  // connecting flash for messages


app.use(session({
    secret : 'This_is_Session_secret_Key_By_its_shyam_640',
    resave : false,
    saveUninitialized : false,
    cookie : {maxAge : 1000 * 60 * 60 * 24}
}));

app.get('',(req, res) => {
    var list = parseCookies(req);
    let isAuthenticated = list.isAuthenticated;
    let username = list.username;
   res.render('home', {
       title: 'Being Care Foundation | Home',
       name: 'being-care-foundation',
       message1: 'Donate for the One ',
       message2: `You'll get thousand`,
       username,
       isAuthenticated
   });
});

app.get('/about',(req,res) => {
    var list = parseCookies(req);
    let isAuthenticated = list.isAuthenticated;
    let username = list.username;
    res.render('about',{
        title : 'Being Care Foundation | About',
        name : 'being-care-foundation',
        message1: 'About ',
        message2: `Us`,
        username,
        isAuthenticated
    });
});

app.get('/blog',(req,res) => {
    var list = parseCookies(req);
    let isAuthenticated = list.isAuthenticated;
    let username = list.username;
    res.render('blog',{
        title : 'Being Care Foundation | Blog',
        name : 'being-care-foundation',
        message1: 'Blogs & ',
        message2: `Latest Updates!`,
        username,
        isAuthenticated
    });
});

app.get('/contact',(req,res) => {
    var list = parseCookies(req);
    let isAuthenticated = list.isAuthenticated;
    let username = list.username;
    res.render('contact',{
        title : 'Being Care Foundation | Contact',
        name : 'being-care-foundation',
        message1: 'Contact ',
        message2: `Us`,
        username,
        isAuthenticated
    });
});

app.get('/faq',(req,res) => {
    var list = parseCookies(req);
    let isAuthenticated = list.isAuthenticated;
    let username = list.username;
    res.render('faq',{
        title : 'Being Care Foundation | FAQs',
        name : 'being-care-foundation',
        message1: 'Frequently ',
        message2: `Asked Questions`,
        username,
        isAuthenticated
    });
});

app.get('/register',(req,res) => {
    var list = parseCookies(req);
    if(list.isAuthenticated){
        res.render('redirect',{
            title : 'Being Care Foundation | Redirecting...'
        });
    }else{
        res.render('register',{
            title : 'Being Care Foundation | Register',
        });
    }
});

app.get('/login',(req,res) => {
    var list = parseCookies(req);
    if(list.isAuthenticated){
        res.render('redirect',{
            title : 'Being Care Foundation | Redirecting...'
        });
    }else{
        res.render('login',{
            title : 'Being Care Foundation | Login',
        });
    }
});

app.get('/resetPassword',(req,res) => {
    res.render('forgotpass',{
        title : 'Being Care Foundation | Reset Password'
    });
});

app.get('/dashboard',(req,res) => {
    var list = parseCookies(req);
    if(list.isAuthenticated){
        res.render('dashboard',{
            title : 'Being Care Foundation | Dashboard'
        });
    }else{
        res.render('login',{
            title : 'Being Care Foundation | Login',
        });
    }
});

app.get('/logout', async (req, res) => {
    // console.log(req);
    var list = parseCookies(req);
    // let decoded_id = jwt.decode();
    const decoded = jwt.verify(list.user_token , process.env.JWT_SECRET_CODE);
    const user = await User.findOne({ _id : decoded._id , 'tokens.token' : list.user_token});
    if(!user){
        throw new Error();
    }
    try{
        user.tokens = user.tokens.filter((token) => {
            return token.token !== list.user_token;
        });
        await user.save();
        res.clearCookie("user_token");
        res.clearCookie("connect.sid");
        res.clearCookie("username");
        res.clearCookie("isAuthenticated");
        res.redirect('/');
     }catch(e){
         console.log(e);
        res.status(500).redirect('/500');
     }
});

app.post('/logoutAll',auth, async (req,res) => {
    try{
       req.user.tokens = [];
       await req.user.save();
       res.send();
    }catch(e){
       res.status(500).send();
    }
 });

 app.get('/redirect',(req,res) => {
     res.render('redirect',{
         title : 'Redirecting...'
     });
 });

// Global variable for flash messages
app.use((req, res, next)=>{
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    next();
});

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

module.exports = app;