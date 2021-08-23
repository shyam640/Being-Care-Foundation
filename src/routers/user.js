const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
   port: 465,
   host: "smtp.gmail.com",
   auth: {
       user: process.env.SMTP_TO_EMAIL,
       pass: process.env.SMTP_PASS,
   },
   secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

router.post('/attachments-mail', (req, res) => {
   const {to, subject, text } = req.body;
   const mailData = {
       from: 'shyamvashishtha640@gmail.com',
       to: to,
       subject: subject,
       text: text,
       html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
       attachments: [
           {   // file on disk as an attachment
               filename: 'Welcome Image!',
               path: './images/about_us.jpg'
           }
       ]
   };

   transporter.sendMail(mailData, (error, info) => {
       if (error) {
           return console.log(error);
       }
       res.status(200).redirect('/');
   });
});

router.post('/users/register',async (req,res) => {
   // console.log(req.body);
   const user = new User(req.body);
   try{
      await user.save();
      const token = await user.generateAuthToken();
      res.redirect('/login');
   }catch(e){
      console.log(e);
      res.redirect('/login');
   }
});

router.post('/users/login',async (req,res) => {
   try{
      const user = await User.findByCredentials(req.body.emailphone , req.body.password);
      const token = await user.generateAuthToken();
      res.cookie('username',user.username);        // 30 days
      res.cookie('user_token',token);        // 30 days
      if(token){
         res.cookie('isAuthenticated',true);
         
      }
      res.redirect('/');
   }catch(e){
      res.redirect('/login');
   }
});


module.exports = router;