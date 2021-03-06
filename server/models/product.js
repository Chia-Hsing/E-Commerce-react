const mongoose = require('mongoose')
const categorySchema = require('./category')

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: 1,
            maxlength: 50,
            required: true,
        },
        category: {
            type: categorySchema,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            min: 0,
            required: true,
        },
        stock: {
            type: {
                S: { type: Number },
                M: { type: Number },
                L: { type: Number },
            },
        },
        description: {
            type: String,
            minlength: 1,
            maxlength: 500,
        },
        image: {
            type: Buffer,
            default: '',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Product = new mongoose.model('Product', productSchema)

module.exports = Product
