import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  code: { type: String, unique: true, required: true },
  stock: { type: Number, required: true }
});

const Product = mongoose.model("Product", productSchema);

export default Product;