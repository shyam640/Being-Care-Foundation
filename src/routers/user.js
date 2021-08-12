const express = require('express');
const router = new express.Router();
const User = require('../models/user');


router.post('/users/register',async (req,res) => {
   // console.log(req.body);
   const user = new User(req.body);
   try{
      await user.save();
      const token = await user.generateAuthToken();
      res.redirect('/login');
   }catch(e){
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