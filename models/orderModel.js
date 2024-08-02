import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            count: Number,
            color: String
        },
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: ["Not Processed", "Cash On Delivery", "Order Placed","Processing", "Dispatched", "cancelled", "Delivered"],
    },
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order