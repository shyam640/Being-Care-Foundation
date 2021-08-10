const chalk = require('chalk');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL,{
   useNewUrlParser : true,
   useCreateIndex : true,
   useFindAndModify : false
}).then(() => console.log(chalk.bold.bgRed('Success : Connected to Database!')))
   .catch((e) => console.log('Error : ',e));