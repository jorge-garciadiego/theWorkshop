//Import express package
const express = require("express");

//Create the express app object
const app = express();

//import express-handlebars
const exphbs = require("express-handlebars");

//Import bodyparser
const bodyparser = require("body-parser");

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

//Setting up the PORT
const PORT = process.env.PORT;

app.listen(PORT, ()=>{

   console.log(`the Workshop Server up and running on Port ${PORT}`);

})