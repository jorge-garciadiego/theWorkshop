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
   res.render("home", {
      title: "the Workshop",
      bestSellers: productModel.getBestSellers(),
      categories: productModel.getCategories()
   });
});

/* Unable the idea is to apply the error messages in the main page, with the forms in in the main page
   for now login and sign Up have their oun view
app.post("/", (req, res) =>{
   const errors = [];

   const patterns = {
      email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
   }

   if (req.body.firstName=="") {
      errors.push({firstName:"You must eneter your first Name"});
   }

   if (req.body.lastName==""){
      errors.push({lastName:"You must enter your last Name"});
   }

   if (!patterns.email.test(req.body.mailPhone)){
      console.log(patterns.email.test(req.body.mailPhone));
      errors.push({email:"You must eneter a valid email or phone number"});
   }

   if (req.body.password==""){
      errors.push({password:"You must enter a password"});
   }

   if (req.body.rePassword==""){
      errors.push({rePassword:"You must re enter the password"});
   }


   //Validating login

   if (req.body.username=="") {
      errors.push({username:"Must enter Your username"});
   }

   if (req.body.loginPass=="") {
      errors.push({password:"Must enter Your password"});
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


*/

//Sign Up Route
app.get("/signup", (req, res)=>{
   res.render("signup", {
      title: "Welcome",
   });
});

// Post Route for Sign Up
app.post("/signup", (req, res)=>{
   const errors = [];

   const patterns = {
      email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      phoneNum: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      password: /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/
   }

   if (req.body.firstName=="") {
      errors.push({description: 'You must eneter your first Name'});
   }

   if (req.body.lastName==""){
      errors.push({description: 'You must eneter your last Name'});
   }

   if (!patterns.email.test(req.body.mailPhone) && !patterns.phoneNum.test(req.body.mailPhone)){
      errors.push({description: "You must eneter a valid email or phone number"});
   }

   if (!patterns.password.test(req.body.password)){
      errors.push({description: "Invalid password"});
   }

   if (!patterns.password.test(req.body.rePassword) && req.body.password != req.body.rePassword){
      errors.push({description: "password re-entered invalid"});
   }

   // Validation array

   if (errors.length > 0) {
      res.render("signup", {
         title: "Welcome",
         errorMessages: errors
      });
   }else{
      res.redirect("/signup");
      console.log("Sign Up successful!");
   }

})

//Login Route
app.get("/login", (req,res)=>{
   res.render("login", {
      title: "Welcome Back"
   });
});

//Login Post Route
app.post("/login", (req, res) => {
   const loginErrors = [];

   const patterns = {
      email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      phoneNum: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      password: /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/
   }

   if (!patterns.email.test(req.body.emailPhone) && !patterns.phoneNum.test(req.body.emailPhone)) {
      loginErrors.push({description: "Invalid Email / Phone number"});
   }

   if (!patterns.password.test(req.body.loginPass)) {
      loginErrors.push({description: "Invalid password"});
   }

   if (loginErrors.length > 0) {
      res.render("login", {
         title: "Login",
         errorMessages: loginErrors
      });
   } else {
      res.redirect("/");
      console.log("Login successful!!");
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{

   console.log(`byHand Server up and running on Port ${PORT}`);

})