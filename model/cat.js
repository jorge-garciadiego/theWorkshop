const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catSchema = new Schema({

   //this.categories.push({title: 'Accesories', description: 'Amazing crafted articles', colour: "background:#CFFFF1"});

   title:
   {
      type: String,
      required: true
   },
   description:
   {
      type: String,
      required: true
   },
   colour:
   {
      type: String,
      default: '#CFFFF1'
   }

});

const catModel = mongoose.model('Cat', catSchema);

module.exports = catModel;