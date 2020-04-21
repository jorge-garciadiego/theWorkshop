const express = require('express');
const router = express.Router();

//Import the User Model
const userModel = require("../model/User");

const productModel = require("../model/product");

const catModel = require("../model/cat");

const Cart = require("../model/cart");

const bcrypt = require("bcryptjs");

const path = require("path");

const isAuthenticated = require("../middleware/auth");

const isAdmin = require("../middleware/isAdmin");

const dashboardLoader = require("../middleware/authorization");

const orderModel = require("../model/order");

//Home Route
router.get("/", (req, res)=>{

   productModel.find({bestSeller:true})
   .then((products)=>{

      const filteredProduct = products.map(product=>{
         return{
            id: product._id,
            bestSeller: product.bestSeller,
            title: product.title,
            description: product.description,
            artist:product.artist,
            category: product.category,
            price: product.price,
            productPic: product.productPic
         }
      });

      catModel.find()
      .then((cats)=>{

         const filteredCat = cats.map(cat=>{
            return{
               id: cat._id,
               title: cat.title,
               description: cat.description,
               colour: cat.colour
            }
         });

         res.render("admin/home",{
            title: "the Workshop",
            heading: "Our Products",
            data: filteredProduct,
            categories: filteredCat     
         });
      })
      .catch(err=>console.log(`Error happend pulling Categories from the database ${err}`))

      
      
   })
   .catch(err=>console.log(`Error happend pulling from the database ${err}`));
   
     // categories: productModel.getCategories()



});


//Sign Up Route
router.get("/signup", (req, res)=>{
   res.render("admin/signup", {
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
      name: /(?:\s*[a-zA-Z]+){1,3}/,
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

   if (password != rePassword){
      errors.push({description: "password re-entered invalid"});
      repass = `Password re-entered doesn't match`;
      valid = false;
   }

   // Validation array

   if (valid == false) {
      res.render("admin/signup", {
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
         
      //Check to see if the users email is in the database
      userModel.findOne({email:mailPhone})
      .then((person)=>{
         
         const errors =[];
            
         if(person != null){
            //no matching email
            errors.push("Sorry, your email is already registrated");
            res.render("admin/signup",{
               errors,
               title: "Welcome",
               errorMessages: errors,
               first: fName,
               last: lname,
               actualFirst: firstLabel,
               actualLast: lastLabel,
            })

         } else {
            
            const newUser = 
            {
               firstName: req.body.firstName,
               lastName: req.body.lastName,
               email: req.body.mailPhone,
               password: req.body.password,
               picture: req.body.picture
            }

            const user = new userModel(newUser);
            
            
            user.save()
            .then((user)=>{
               req.files.picture.name = `user_pic${user._id}${path.parse(req.files.picture.name).name}${path.parse(req.files.picture.name).ext}`;
      
               req.files.picture.mv(`public/uploads/usersPictures/${req.files.picture.name}`)
               .then(()=>{
      
                  userModel.updateOne({_id:user._id},{
                     picture: req.files.picture.name
                  })
                  .then(()=>{

                     // using Twilio SendGrid's v3 Node.js Library
                     // https://github.com/sendgrid/sendgrid-nodejs
                     const sgMail = require('@sendgrid/mail');
                     sgMail.setApiKey(`${process.env.SEND_GRID_API_KEY}`);
                     const msg = {
                     to: `${mailPhone}`,
                     from: `jorge.garciadiego@gmail.com`,
                     subject: 'the Workshop message submit',
                     html: 
                     `Visitor's ${firstName} ${lastName} <br>
                     Email address: ${mailPhone}; <br>
                     Subject: "Welcome" <br>
                     Message; [Welcome to the Workshop]
                     `,
                     };

                     sgMail.send(msg)
                     .then(()=>{
                        console.log(`Email sent`);
                        res.redirect("/login");
                     })
                     .catch(err=>{
                        console.log(`Error ${err}`);
                     })
                     
                  })
                  
               })
               }).catch(err=>{
                  console.log(`Error entring into de data ${err}`);
               });
                     
                  
         }
         })
         .catch(err=>console.log(`Error ${err}`));
   }})


//Login Route
router.get("/login", (req,res)=>{
   res.render("admin/login", {
      title: "Login"
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
   res.render("admin/login", {
      title: "Login",
      errorMessages: loginErrors,
      e_mail: mail,
      p_pass: pass,
      actualMail: mailLabel
   });
   } else {
     
      //Check to see if the users email is in the database
      userModel.findOne({email:req.body.emailPhone})
      .then((user)=>{
         
         const errors =[];

         if(user == null){
            //no matching email
            errors.push("Sorry, your email and/or is incorrect");
            res.render("admin/login",{
               errors
            })

         } else {
            bcrypt.compare(req.body.loginPass, user.password)
            .then(isMatched=>{
               if(isMatched){
                  //create our session
                  req.session.userInfo = user;
                  res.redirect("/profile");
               } else {
                  errors.push("Sorry, your email and/or password is incorrect");
                  res.render("admin/login", {
                     errors
                  });
               }
            })
            .catch(err=>console.log(`Error ${err}`));
         }
      }) .catch(err=>console.log(`Error ${err}`));

      //res.redirect("/welcome");
      //console.log("Login successful!!");
   }
})

//Contact-us Route
router.get("/contact-us", (req, res)=>{

   res.render("admin/contact-us", {
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
   let messLabel;

   const patterns = {
      name: /^[a-zA-Z]+$/,
      email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      mess:  /[a-z0-9]/
   }

   if (!patterns.name.test(firstName)) {
      errors.push({description: 'You must eneter your first Name'});
      fName = `You forgot your name`;
      valid = false;
   } else {
      firstLabel = firstName;
   }

   if (!patterns.name.test(lastName)){
      errors.push({description: 'You must eneter your last Name'});
      lname = `You forgot your lastname`;
      valid = false;
   } else {
      lastLabel = lastName;
   }

   if (!patterns.email.test(email)){
      errors.push({description: "Email must be from a valid domain"});
      mail = `Ups, you must enter a valid email`;
      valid = false;
   } else {
      mailLabel = email;
   }

   if(!patterns.mess.test(message)){
      errors.push({description: "A message haven't been written"});
      messg = `Ups, you forgot to write us a message`;
      valid = false;
   } else {
      messLabel = message;
   }

   if (valid == false) {
      res.render("admin/contact-us", {
         title: "Contact Us",
         errorMessages: errors,
         first: fName,
         last: lname,
         e_mail: mail,
         messageUser: messg,
         actualFirst: firstLabel, 
         actualLast: lastLabel,
         actualMail: mailLabel,
         actualMess: messLabel,
         actualSubject: subject
      });
   }else{

   // using Twilio SendGrid's v3 Node.js Library
   // https://github.com/sendgrid/sendgrid-nodejs
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(`${process.env.SEND_GRID_API_KEY}`);
      const msg = {
      to: `me.garciadiego@gmail.com`,
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



router.get("/profile", isAuthenticated, dashboardLoader);


router.get("/logout",(req,res)=>{

   req.session.destroy();
   res.redirect("/")
})

// CART
router.get("/add-to-cart/:id", (req,res)=>{
   
   let cart = new Cart(req.session.cart ? req.session.cart : {});

   productModel.findById(req.params.id)
   .then((product)=>{
      
      cart.add(product, product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/products/list');
      
   })
   .catch(err=>`Error pulling the document from the database ${err}`);
   
})


router.get('/cart', (req,res, next)=>{

      if(!req.session.cart){
         return res.render("admin/shoppingCart",{
            products: null
         });
      }
      
      let cart= new Cart(req.session.cart);

      res.render("admin/shoppingCart", {
         title: "Shopping Cart",
         products: cart.generateArray(),
         totalPrice: cart.totalPrice
      });
      console.log(req.session.cart);
      }
   );
  
   router.get('/checkout', isAuthenticated, (req,res)=>{
      if(!req.session.cart){
         return res.redirect('/products/list');
      }

      let cart = new Cart(req.session.cart);
      console.log(cart.totalPrice);
      res.render('admin/checkout', {
         total: cart.totalPrice
      })


   })

   router.post("/checkout", (req, res)=>{
      const errors = [];
   
      const {total, firstName, lastName, email} = req.body;
   
      let valid = true;
      let fName = [];
      let lname = [];
      let mail = [];
   
      const patterns = {
         name: /^[a-zA-Z]+$/,
         email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
   
      }

      totalLabel = total;
   
      if (!patterns.name.test(firstName)) {
         errors.push({description: 'You must eneter your first Name'});
         fName = `You forgot your name`;
         valid = false;
      }
   
      if (!patterns.name.test(lastName)){
         errors.push({description: 'You must eneter your last Name'});
         lname = `You forgot your lastname`;
         valid = false;
      }
   
      if (!patterns.email.test(email)){
         errors.push({description: "Email must be from a valid domain"});
         mail = `Ups, you must enter a valid email`;
         valid = false;
      }
   
      if (valid == false) {
         res.render("admin/checkout", {
            title: "Checkout",
            errorMessages: errors,
            first: fName,
            last: lname,
            e_mail: mail,
            
            total,
            firstName,
            lastName,
            email
         });
      }else{

         const newOrder = 
            {
               user: req.session.userInfo._id,
               email,
               cart: req.session.cart
               
               
            }
         
         const user = new orderModel(newOrder);
         
         let cart = new Cart(req.session.cart);
         const itemsMess = cart.generateArray();
         console.log(itemsMess);

         let itemsList = `Thank you for choosing the Workshop. <br> Your items: </p><br>`;

         itemsMess.forEach((items)=>{
            itemsList+= `<p> ${items.item.title} Price: $${items.item.price}
            <br> Summary: 
            <br> Items: ${items.qty} 
            <br> total: $${items.item.price}`
         });
         itemsList+= `<hr> Total purchased: $${cart.totalPrice} <br>
         Items: ${cart.totalQty} <br>` ;
            
            
         user.save()
         .then(()=>{

         // using Twilio SendGrid's v3 Node.js Library
         // https://github.com/sendgrid/sendgrid-nodejs
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(`${process.env.SEND_GRID_API_KEY}`);
            const msg = {
            to: `${email}`,
            from: `me.garciadiego@gmail.com`,
            subject: 'Confirmation Order',
            html: 
            `Dear ${firstName} your purchase is complete <br>

               ${itemsList}
            see you soon at >the Workshop<
            www.jorgegarciadiego.com
            `,
            };
      
            //Asynchornous operation
            sgMail.send(msg)
            .then(()=>{
               req.session.cart = null;            
               res.redirect("/");
            })
            .catch(err=>{
               console.log(`Error ${err}`);
            })

         })
         .catch(err=>console.log(`Error saving the order into the Database: ${err}`));

      }
   })


   router.get('/cancel', (req,res)=>{
      if(!req.session.cart){
         return res.redirect('/products/list');
      }

         req.session.cart = null;            
         res.redirect("/");
   })

   
      router.get("/usersDashboard", isAuthenticated, isAdmin,(req, res)=>{
         const{productSearch} = req.body;
         userModel.find()
         .then((users)=>{
      
            const filteredUsers = users.map(user=>{
               return{
                  id: user._id,
                  role: user.role,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  picture: user.picture
               }
            });

            res.render("admin/usersDashboard",{
               title: "Users",
               heading: "User Dashboard",
               data: filteredUsers,                  
            })

      
                    
         })
         .catch(err=>console.log(`Error happend pulling from the database ${err}`));
      }
   )


   //Products Route
router.post("/usersDashboard", isAuthenticated, isAdmin, (req, res)=>{
   const{userSearch} = req.body;
  
   userModel.find({role:userSearch})
   .then((users)=>{

      const filteredUser = users.map(user=>{
         return{
            id: user._id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            picture: user.picture
         }
      });

      userModel.find()
      .then((cats)=>{

         const filteredRoles = cats.map(cat=>{
            return{
               role: cat.role
            }
         });

         res.render("admin/usersDashboard", {
            title: "Users",
            heading: "User Dashboard",
            data: filteredUser,
            roles: filteredRoles   
         });
      })
      .catch(err=>console.log(`Error happend pulling Categories from the database ${err}`))
     
   })
   .catch(err=>console.log(`Error happend when pulling from the database: ${err}`));
   
  
});

module.exports = router;

// express Router documentation expressjs/en/guide/routing.html