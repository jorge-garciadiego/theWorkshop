const express = require('express');
const router = express.Router();

const productModel = require("../model/product");

//Home Route
router.get("/", (req, res)=>{

   res.render("general/home", {
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
router.get("/signup", (req, res)=>{
   res.render("general/signup", {
      title: "Welcome"
   });
});

// Post Route for Sign Up
router.post("/signup", (req, res)=>{
  const errors = [];

   const{firstName, lastName, mailPhone, password, rePassword} = req.body;

   let valid = true;
   let fName = [];
   let lname = [];
   let mail = [];
   let pass = [];
   let repass = [];

   let firstLabel;
   let lastLabel;
   let mailLabel;

   //Object with the javascript REGEX patterns
   const patterns = {
      name: /^[a-zA-Z]+$/,
      email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      phoneNum: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      password: /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/
   }

   if (!patterns.name.test(firstName)) {
      errors.push({description: 'You must eneter your first Name'});
      fName = `Invalid First Name`;
      valid = false;
   } else {
      firstLabel = firstName;
   }

   if (!patterns.name.test(lastName)){
      errors.push({description: 'You must eneter your last Name'});
      lname = `Invalid Last Name`;
      valid = false;
   } else {
      lastLabel = lastName;
   }

   if (!patterns.email.test(mailPhone) && !patterns.phoneNum.test(mailPhone)){
      errors.push({description: "Email must be from a valid domain / phone (10 digs)"});
      mail = `Ups, you must enter a valid email / phone number`;
      valid = false;
   } else {
      mailLabel = mailPhone;
   }

   if (!patterns.password.test(password)){
      errors.push({description: "Password: at least 8 char, 1 num, 1 lowercase, 1 uppercase, 1 special character => !@#$%^&* "});
      pass = `Invalid Password`;
      valid = false;
   }

   if (!patterns.password.test(rePassword) && password != rePassword){
      errors.push({description: "password re-entered invalid"});
      repass = `Password re-entered doesn't match`;
      valid = false;
   }

   // Validation array

   if (valid == false) {
      res.render("general/signup", {
         title: "Welcome",
         errorMessages: errors,
         first: fName,
         last: lname,
         e_mail: mail,
         p_pass: pass,
         p_repass: repass,
         actualFirst: firstLabel,
         actualLast: lastLabel,
         actualMail: mailLabel
      });
   }else{
      res.redirect("/welcome");
         // using Twilio SendGrid's v3 Node.js Library
         // https://github.com/sendgrid/sendgrid-nodejs
         const sgMail = require('@sendgrid/mail');
         sgMail.setApiKey(`${process.env.SEND_GRID_API_KEY}`);
         const msg = {
         to: `jorge.garciadiego@gmail.com`,
         from: `${mailPhone}`,
         subject: 'the Workshop message submit',
         html: 
         `Visitor's ${firstName} ${lastName} <br>
         Email address: ${mailPhone}; <br>
         Subject: "Welcome" <br>
         Message; [Welcome to the Workshop]
         `,
         };

         //Asynchornous operation
         sgMail.send(msg)
         .then(()=>{
            res.redirect("/welcome");
         })
         .catch(err=>{
            console.log(`Error ${err}`);
         })
         }

})

//Login Route
router.get("/login", (req,res)=>{
   res.render("general/login", {
      title: "Welcome Back"
   });
});

//Login Post Route
router.post("/login", (req, res) => {

   const loginErrors = [];

   let valid = true;
   let mail = [];
   let pass = [];

   let mailLabel;

   const {emailPhone, loginPass} = req.body;

   //Object with the javascript REGEX patterns
   const patterns = {
      email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      phoneNum: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      password: /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/
   }

   if (!patterns.email.test(emailPhone) && !patterns.phoneNum.test(emailPhone)){
      loginErrors.push({description: "Email must be from a valid domain / phone (10 digs)"});
      mail = `Ups, you must enter a valid email / phone number`;
      valid = false;
   } else {
      mailLabel = emailPhone;
   }

   if (!patterns.password.test(loginPass)){
      loginErrors.push({description: "Password: at least 8 char, 1 num, 1 lowercase, 1 uppercase, 1 special character => !@#$%^&* "});
      pass = `Invalid Password`;
      valid = false;
   }

  // Validation array

  if (valid == false) {
   res.render("general/login", {
      title: "Login",
      errorMessages: loginErrors,
      e_mail: mail,
      p_pass: pass,
      actualMail: mailLabel
   });
   } else {
      res.redirect("/welcome");
      console.log("Login successful!!");
   }
})

//Contact-us Route
router.get("/contact-us", (req, res)=>{

   res.render("general/contact-us", {
      title: "Contact Us"
   });


});

router.post("/contact-us", (req, res)=>{
   const errors = [];

   const {firstName, lastName, email, subject, message} = req.body;

   let valid = true;
   let fName = [];
   let lname = [];
   let mail = [];
   let messg = [];

   let firstLabel;
   let lastLabel;
   let mailLabel;

   const patterns = {
      name: /^[a-zA-Z]+$/,
      email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      mess: /[A-Za-z]+$/
   }

   if (!patterns.name.test(firstName)) {
      errors.push({description: 'You must eneter your first Name'});
      fName = `Invalid First Name`;
      valid = false;
   } else {
      firstLabel = firstName;
   }

   if (!patterns.name.test(lastName)){
      errors.push({description: 'You must eneter your last Name'});
      lname = `Invalid Last Name`;
      valid = false;
   } else {
      lastLabel = lastName;
   }

   if (!patterns.email.test(email)){
      errors.push({description: "Email must be from a valid domain / phone (10 digs)"});
      mail = `Ups, you must enter a valid email`;
      valid = false;
   } else {
      mailLabel = email;
   }

   if(!patterns.mess.test(message)){
      errors.push({description: "Must type a message"});
      messg = `Ups, you write us a message`;
      valid = false;
   } else {
      mailLabel = message;
   }

   if (valid == false) {
      res.render("general/contact-us", {
         title: "Contact Us",
         errorMessages: errors,
         first: fName,
         last: lname,
         e_mail: mail,
         messageUser: messg,
         actualFirst: firstLabel, 
         actualLast: lastLabel,
         actualMail: mailLabel
      });
   }else{
      res.redirect("/");
   // using Twilio SendGrid's v3 Node.js Library
   // https://github.com/sendgrid/sendgrid-nodejs
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(`${process.env.SEND_GRID_API_KEY}`);
      const msg = {
      to: `jorge.garciadiego@gmail.com`,
      from: `${email}`,
      subject: 'the Workshop message submit',
      html: 
      `Visitor's ${firstName} ${lastName} <br>
      Email address: ${email}; <br>
      Subject: ${subject}: <br>
      Message; [${message}]
      `,
      };

      //Asynchornous operation
      sgMail.send(msg)
      .then(()=>{
         res.redirect("/");
      })
      .catch(err=>{
         console.log(`Error ${err}`);
      })
   }
})

//Welcome Route
router.get("/welcome", (req, res)=>{

   res.render("general/welcome", {
      title: "Welcome to the Workshop"
   });


});

module.exports = router;

// express Router documentation expressjs/en/guide/routing.html