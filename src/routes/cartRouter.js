import express from 'express';
import CartModel from '../models/cartModel.js';
import ProductModel from '../models/productModel.js';

const router = express.Router();


router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        let cart = await CartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

      
        const product = await ProductModel.findById(pid);
        if (!product) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }

        
        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        res.status(200).json({ status: "success", message: "Producto agregado al carrito", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al agregar producto al carrito", error });
    }
});

router.delete('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        cart.products = cart.products.filter(product => product.product.toString() !== pid);
        await cart.save();
        res.json({ status: 'success', message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error eliminando el producto', error });
    }
});


router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ status: "error", message: "La cantidad debe ser mayor a 0" });
        }

        // Buscar el carrito
        let cart = await CartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado en el carrito" });
        }

     
        cart.products[productIndex].quantity = quantity;

        
        await cart.save();

        res.status(200).json({ status: "success", message: "Cantidad de producto actualizada", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error actualizando cantidad del producto", error });
    }
});


router.put('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        const productIndex = cart.products.findIndex(product => product.product.toString() === pid);
        if (productIndex === -1) return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });

        cart.products[productIndex].quantity = quantity;
        await cart.save();
        res.json({ status: 'success', message: 'Cantidad de producto actualizada', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error actualizando la cantidad', error });
    }
});


router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        
        let cart = await CartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        
        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado en el carrito" });
        }

     
        cart.products.splice(productIndex, 1);

        await cart.save();


        res.status(200).json({ status: "success", message: "Producto eliminado del carrito", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error eliminando producto del carrito", error });
    }
});
router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        let cart = await CartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

       
        cart.products = [];

        
        await cart.save();

        res.status(200).json({ status: "success", message: "Carrito vacío", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error vaciando carrito", error });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findById(cid).populate('products.product');
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error obteniendo el carrito', error });
    }
});
router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findById(cid).populate("products.product").lean();

        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        res.status(200).json(cart);  
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error obteniendo el carrito", error });
    }
});

export default router;
