import express from "express";
import ProductManager from "../fileManager/productManager.js";
import path from "path";

const router = express.Router();
const productManager = new ProductManager(
    path.join(process.cwd(), "products.json")  // Updated path
);
router.get("/products", async (req, res) => {
  const products = await productManager.getAllProducts();
  console.log(products);
  res.render("index", { products });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;
