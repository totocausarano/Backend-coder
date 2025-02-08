import express from "express";
import path from "path";
import CartManager from "../fileManager/cartManager.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let carts = [];
let cartid = 1;
const router = express.Router();

const cartManager = new CartManager(path.join(__dirname, "../../carts.json"));

//Post
router.post("/", (req, res) => {
  const newCart = cartManager.createCart();
  res.json({ message: "Carrito creado exitosamente", cart: newCart });
});

router.post("/:cid/products/:pid", (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);

  const result = cartManager.addProductToCart(cartId, productId);

  if (result.error) {
    res.status(404).json(result);
  } else {
    res.json({
      message: "Producto agregado al carrito exitosamente",
      cart: result,
    });
  }
});

//Get
router.get("/:cid", (req, res) => {
  const cart = cartManager.getCartById(parseInt(req.params.cid));
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

export default router;
