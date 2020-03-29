//Import express package
const express = require("express");

//Create the express app object
const app = express();

//import express-handlebars
const exphbs = require("express-handlebars");

//Import bodyparser
const bodyparser = require("body-parser");

//Import the mongoose to the file
const mongoose = require('mongoose');

//load environmet variable file
require('dotenv').config({path:"./config/keys.env"});

//Handlebars Middleware (tells express to set Handlebars as the template engine)
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Configure the public folder to be the static elements container
app.use(express.static('public'));

//Tells express to make form data available via req.body in every request
app.use(bodyparser.urlencoded({extended:false}));

// Load controllers
const generalController = require("./controllers/general");
const productController = require("./controllers/products");

//Map each controller to the app express object
app.use("/", generalController);
app.use("/", productController);


// Connection method that connects mongoose to MongoDB
//This method is an assincronous operation
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
   console.log(`Connected to MongoDB Database`);
})
.catch(err=>console.log(`Error ocurred when connecting to the database: ${err}`));


//Setting up the PORT
const PORT = process.env.PORT;

app.listen(PORT, ()=>{

   console.log(`the Workshop Server up and running on Port ${PORT}`);

})