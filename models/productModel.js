import mongoose from "mongoose";

var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Category"
        type:String,
        required: true,
    },
    brand: {
        type: String,
        // enum: ["Apple", "Samsung", "Lenovo"]
        required: true,
    },
    quantity: {
        type: Number,
        required:true
    },
    sold: {
        type: Number,
        default: 0,
        // select:false, //if not show a field then use select 
    },
    images: [],
    color:[],
    tags:[],
    rating: [
        {
            star: Number,
            comment: String,
            postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        },
    ],
    totalrating:{
        type:String,
        default:0,
    },
    averagerating:{
        type:String,
        default:0,
    }
}, { timestamps: true });

//Export the model
const Product = mongoose.model('Product', productSchema);
export default Product;