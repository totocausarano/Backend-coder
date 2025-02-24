import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1, default: 1 }
        }
    ]
});

// Crear el modelo de carrito
const Cart = mongoose.model("Cart", cartSchema);

export default Cart;