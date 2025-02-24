import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  code: { type: String, unique: true, required: true },
  stock: { type: Number, required: true, min: 0 }
});

const Product = mongoose.model("Product", productSchema);

export default Product;