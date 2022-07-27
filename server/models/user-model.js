const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserModel = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phoneno: { type: String, required: true },
        // payment: { 
        //     amountPaid: {type: Number},
        //     isSuccessful: {type : Boolean }
        // },
        password: { type: String, required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('user', UserModel)