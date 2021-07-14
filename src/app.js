const express = require('express');
const chalk = require('chalk');
const path = require('path');
const hbs = require('hbs');

const app = express();

// Defining path for express use
const pathToPublicDir = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');

// setting up static directory to serve
app.use(express.static(pathToPublicDir));
app.use(express.json());

// setting up handler bar engine and views location
app.set('view engine','hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);

app.get('', (req, res) => {
   res.render('home', {
       title: 'Being Care Foundation | Home',
       name: 'being-care-foundation'
   });
});

module.exports = app;