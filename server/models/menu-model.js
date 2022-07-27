const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MenuModel = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        stock:{
            type: Number,
            required: true
        }
    },
)

module.exports = mongoose.model('menu', MenuModel);