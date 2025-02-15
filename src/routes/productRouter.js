import express from "express";
import fs from "fs";
import path from "path";
import ProductManager from "../fileManager/productManager.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const productManager = new ProductManager(
  path.resolve(__dirname, "../../products.json")
);

let nextid = 1;

//Get
router.get("/", (req, res) => {
  const products = productManager.getAllProducts();
  res.json(products);
});
router.get("/:pid", (req, res) => {
  const product = productManager.getProductById(parseInt(req.params.pid));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

//Post
router.post("/", (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.body;
  //if (!title || !description || !price || !thumbnail || !code || !stock) {
  //return res.status(400).json({ error: "Todos los campos son obligatorios" });
  //}
  const newProduct = productManager.addProduct({
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  });
  res.json({ message: "Producto agregado exitosamente", product: newProduct });
});
//Put
router.put("/:pid", (req, res) => {
  const updatedProduct = productManager.updateProduct(
    parseInt(req.params.pid),
    req.body
  );
  if (updatedProduct) {
    res.json({
      message: "Producto actualizado exitosamente",
      product: updatedProduct,
    });
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});
//Delete
router.delete("/:pid", (req, res) => {
  const deletedProduct = productManager.deleteProduct(parseInt(req.params.pid));
  if (deletedProduct) {
    res.json({
      message: "Producto eliminado exitosamente",
      product: deletedProduct,
    });
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});
export default router;
