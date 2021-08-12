const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const sharp = require('sharp');
const passport = require('passport');

router.post('/users/register',async (req,res) => {
   console.log(req.body);
   const user = new User(req.body);
   try{
      await user.save();
      const token = await user.generateAuthToken();
      res.cookie('user_token',token,{ maxAge: 1000 * 60 * 60 * 24 * 30 });
      res.redirect('/');
   }catch(e){
      console.log(e);
      res.status(400).send(e);
   }
});

router.post('/users/login',async (req,res) => {
   try{
      const user = await User.findByCredentials(req.body.emailphone , req.body.password);
      const token = await user.generateAuthToken();
      res.cookie('username',user.username);        // 30 days
      if(token){
         res.cookie('isAuthenticated',true);
      }
      res.redirect('/');
   }catch(e){
      console.log(e);
      res.status(400).send(e);
   }
});


module.exports = router;