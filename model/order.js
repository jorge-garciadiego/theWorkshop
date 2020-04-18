const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({

user:
{
   type: Schema.Types.ObjectId, 
   ref: 'User'
},
cart:
{
   type: Object,
   required: true
},
email:
{
   type: String,
   
}

});

const orderModel = mongoose.model('Order', orderSchema);
module.exports = orderModel;