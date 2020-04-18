//Import express package
const express = require("express");

//import express-handlebars
const exphbs = require("express-handlebars");

//Import bodyparser
const bodyparser = require("body-parser");

//Import the mongoose to the file
const mongoose = require('mongoose');

//importing express-session
const session = require('express-session');

//Import express-fileupload
const fileupload = require('express-fileupload');

//load environmet variable file
require('dotenv').config({path:"./config/keys.env"});

//Import router objects
const adminRoutes = require("./controllers/admin");
const productRoutes = require("./controllers/products");


//Create the express app object
const app = express();

//Tells express to make form data available via req.body in every request
app.use(bodyparser.urlencoded({extended:false}));

//Configure the public folder to be the static elements container
app.use(express.static('public'));

//Handlebars Middleware (tells express to set Handlebars as the template engine)
//Handlebars Helpers added
app.engine("handlebars",exphbs(
   {
       helpers:{
           
           ifOption: function(value, compare){
            if(value === compare.toLowerCase()){
                return "selected";
            }
           },

           ifCheck: function(value){
               if(value == true || value == 'on'){ 
                return "checked"  
               }
           },
           
           convDate: function(date){
               return moment(date).format("YYYY-MM-DD");
           }
           
           }
   }
));

app.set('view engine', 'handlebars');

//This is to allow specific forms and/or links that were submitted/press to send PUT and DELETE 
app.use((req,res,next)=>{
   if(req.query.method == "PUT"){
       req.method="PUT"
   } else if(req.query.method == "DELETE"){
       req.method="DELETE"
   }

   next();
})

app.use(fileupload());


app.use(session({
    secret: `${process.nextTick.SECRET_KEY}`,
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
  }));

//This is a middleware function that creates a Template Variable that holds the session in order to acces the user object in Handlebars POWERFUL YEEIIIIIIIIIII
app.use((req,res,next)=>{
   
    res.locals.user = req.session.userInfo;
    res.locals.cart = req.session.cart;
 
    next();
 })


//Maps EXPRESS TO ALL OUR ROUTER OBJECTS
app.use("/", adminRoutes);
app.use("/products", productRoutes);


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