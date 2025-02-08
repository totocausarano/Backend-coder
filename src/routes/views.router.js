import express from "express";
import ProductManager from "../fileManager/productManager.js";
import path from "path";

const router = express.Router();
const productManager = new ProductManager(
  path.join(process.cwd(), "productos.json")
);

router.get("/products", (req, res) => {
  const products = productManager.getAllProducts();
  console.log(products);
  res.render("index", { products });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;
