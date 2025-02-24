import express from 'express';
import ProductModel from '../models/productModel.js';  
import CartModel from '../models/cartModel.js';

const router = express.Router();

router.get('/products', async (req, res) => {
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
            
        res.render('index', { products, totalPages, page });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error obteniendo productos', error });
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await ProductModel.findById(pid);
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        
        res.render('productDetail', { product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error obteniendo el producto', error });
    }
});


router.get("/carts/:cid", async (req, res) => {
  try {
      const { cid } = req.params;
      const cart = await CartModel.findById(cid).populate("products.product");

      if (!cart) {
          return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
      }

      console.log("Carrito encontrado:", JSON.stringify(cart, null, 2));  // 🔥 Esto imprimirá los datos en la terminal

      res.render("cartDetail", { cart });
  } catch (error) {
      res.status(500).json({ status: "error", message: "Error obteniendo el carrito", error });
  }
});

export default router;
