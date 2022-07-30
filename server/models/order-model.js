const mongoose = require("mongoose");
const Schema = mongoose.Schema
 
const OrderModel =  new Schema({
    email: {type: String,required: true},
    orderedItems: [{
        itemName: {type: String,required: true},
        quantity: {type: Number, required: true},
        price: { type: Number,required: true}
    }],
    // total: {
    //     type: Number,
    //     required: true
    // }

    },{timestamps:true}
)


module.exports = mongoose.model("order",OrderModel)