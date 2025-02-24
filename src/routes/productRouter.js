import express from "express";
import { getProducts, addProduct, getProductById, deleteProduct } from "../controllers/productsController.js";

const router = express.Router();

router.get("/", getProducts); // Obtener productos con filtros
router.post("/", addProduct); // Agregar producto
router.get("/:id", getProductById); // Obtener producto por ID
router.delete("/:id", deleteProduct); // Eliminar producto

export default router;
