import express from "express";
import ProductModel from "../models/productModel.js"; // Importamos el modelo de productos

const router = express.Router();

/** 
 * 📌 GET /api/products → Obtener todos los productos con paginación, filtros y ordenamiento 
 */
router.get("/", async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);
        
        const filter = query ? { $or: [
            { name: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } }
        ]} : {};
        
        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
        const totalProducts = await ProductModel.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        
        const products = await ProductModel.find(filter)
            .sort(sortOption)
            .limit(limit)
            .skip((page - 1) * limit)
            .lean(); 

        res.status(200).json({ 
            status: "success", 
            products, 
            totalPages, 
            page, 
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error obteniendo productos", error });
    }
});

/** 
 * 📌 POST /api/products → Agregar un nuevo producto 
 */
router.post("/", async (req, res) => {
    try {
        const { name, description, price, code, stock, category } = req.body;

        if (!name || !description || !price || !code || !stock || !category) {
            return res.status(400).json({ status: "error", message: "Todos los campos son obligatorios" });
        }

        const newProduct = new ProductModel({ name, description, price, code, stock, category });
        await newProduct.save();

        res.status(201).json({ status: "success", message: "Producto agregado correctamente", product: newProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al agregar producto", error });
    }
});

/** 
 * 📌 PUT /api/products/:id → Actualizar un producto por ID 
 */
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, code, stock, category } = req.body;

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { name, description, price, code, stock, category },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }

        res.status(200).json({ status: "success", message: "Producto actualizado", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al actualizar producto", error });
    }
});

/** 
 * 📌 DELETE /api/products/:id → Eliminar un producto por ID 
 */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await ProductModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }

        res.status(200).json({ status: "success", message: "Producto eliminado", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al eliminar producto", error });
    }
});

export default router;