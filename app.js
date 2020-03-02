//Import express package
const express = require("express");

//Create the express app object
const app = express();

//import express-handlebars
const exphbs = require("express-handlebars");

//Import bodyparser
const productModel = require("./model/products");
const bodyparser = require("body-parser");

//This tells express to get up our template engine has handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Configure the public folder to be the static elements container
app.use(express.static('public'));

//Tells express to make form data available via req.body in every request
app.use(bodyparser.urlencoded({extended:false}));

//Home Route
app.get("/", (req, res)=>{
   console.log("you are at Home");
   res.render("home", {
      title: "Home",
      bestSellers: productModel.getBestSellers(),
      categories: productModel.getCategories()
   });
});

app.post("/", (req, res) =>{
   const errors = [];

   const patterns = {
      email: /^([a-z\d\.-]+)@([a-z\d]+)\.(a-z{2,8})(\.[a-z]{2,8})?$/
   }

   if (req.body.firstName=="") {
      errors.push("You must eneter your first Name");
   }

   if (req.body.lastName==""){
      errors.push("You must enter your last Name");
   }

   if (req.body.mailPhone==""){
      errors.push("You must eneter a valid email or phone number");
   }

   if (req.body.password==""){
      errors.push("You must enter a password");
   }

   if (req.body.rePassword==""){
      errors.push("You must re enter the password");
   }


   //Validating login

   if (req.body.username=="") {
      errors.push("Must enter Your username");
   }

   if (req.body.loginPass=="") {
      errors.push("Must enter Your password");
   }

   //If validation fails

   if (errors.length > 0){
      res.render("home", {
         title: "the Workshop",
         bestSellers: productModel.getBestSellers(),
         categories: productModel.getCategories(),
         errorMessages: errors
      });
   } else {
      res.render("home", {
         title: "the Workshop",
         bestSellers: productModel.getBestSellers(),
         categories: productModel.getCategories()
      });
      console.log("Sign Up correct!!");
   }
})

//Products Route
app.get("/products", (req,res) => {
   res.render("products", {
      title: "Products",
      heading: "Our Products",
      products: productModel.getAllProducts()
   });
});

const PORT = process.env.PORT || 3500;

app.listen(PORT, ()=>{

   console.log(`byHand Server up and running on Port ${PORT}`);

})