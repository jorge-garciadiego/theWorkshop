const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

//This indicates the shape of the documents that will be entring the database

const userSchema = new Schema({

   firstName:
   {
      type: String,
      required: true
   },

   lastName:
   {
      type: String,
      required: true
   },

   email:
   {
      type: String,
      required: true
   },

   password:
   {
      type: String,
      required: true
   },
   picture:
   {
      type: String

   },
   role:
   {
      type: String,
      default: "User"
   },
   dateCreated:
   {
      type: Date,
      default: Date.now()
   }


});

/*
   For every schema created (create a schema per collection), you must also create a model object.
   The model object will allow you to perform CRUD operations on a given collection
*/

userSchema.pre("save", function(next){

   // salt is random generated characters or strings
   bcrypt.genSalt(10)
   .then((salt)=>{
      bcrypt.hash(this.password, salt)
      .then((encryptPassword)=>{
         this.password = encryptPassword;
         next();
      })
      .catch(err=>console.log(`Error occurred when hashing`))
   })
   .catch(err=>console.log(`Error ocurred when salting ${err}`));

})


const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

