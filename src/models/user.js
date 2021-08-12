const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
   {
      name : {
         type : String,
         required : true,
         trim : true
      },
      username : {
         type : String,
         required : true,
         trim : true
      },
      email : {
         type : String,
         unique : true,
         index : true,
         required : true,
         trim : true,
         lowercase : true,
         validate(value){
            if(!validator.isEmail(value)){
               throw new Error('Please provide correct Email!');
            }
         }
      },
      phone : {
         type : String,
         unique : true,
         index : true,
         required : true,
         trim : true,
      },
      password : {
         type : String,
         required : true,
         trim : true,
         minlength : 8,
         validate(value){
            if(value.toLowerCase().includes('password')){
               throw new Error('password cannot be "password"');
            }
         }
      },
      tokens : [{
         token : {
            type : String,
            required : true
         }
      }],
   },
   {
      timestamps : true
   }
);


userSchema.methods.toJSON = async function(){
   const user = this;
   const userObject = user.toObject();
   delete userObject.password;
   delete userObject.tokens;
   delete userObject.avatar;
   return userObject;
}

// methods allows one to use custom function on instances sometimes they are called instance function.
userSchema.methods.generateAuthToken = async function() {
   const user = this;
   const token = jwt.sign({ _id : user._id.toString() },process.env.JWT_SECRET_CODE,{expiresIn : '30 days'});
   user.tokens = user.tokens.concat({token}); 
   await user.save();
   return token;
}

// statics allows one to use custom function on models sometimes they are called model function
userSchema.statics.findByCredentials = async (value,password) =>{
   const user = await User.findOne({
      $or: [{
         "email": value
       }, {
         "phone": value
       }]
   });
   if(!user){
      throw new Error('Unable to login!');
   }
   const isMatch = await bcrypt.compare(password,user.password);
   if(!isMatch){
      throw new Error('Unable to login!');
   }
   return user;
}

userSchema.pre('save', async function (next){
   const user = this;
   if(user.isModified('password')){
      user.password = await bcrypt.hash(user.password,8);
   }
   next();
});

const User = mongoose.model('User',userSchema);

module.exports = User;