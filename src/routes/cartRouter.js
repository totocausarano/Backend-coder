import express from "express";
import { products } from "./productRouter.js";
let carts = [];
let cartid = 1;
const router = express.Router();

//Post
router.post("/", (req, res) => {
  const newcart = {
    id: cartid++,
    cartProduct: [],
  };
  carts.push(newcart);
  res.json("carrito creado exitosamente");
});

router.post("/:cid/products/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const product = products.find((product) => product.id === parseInt(pid));
  const cart = carts.find((cart) => cart.id === parseInt(cid));
  if (!product) {
    return res.status(404).json("producto no encontrado");
  }
  if (!cart) {
    return res.status(404).json("carrito no encontrado");
  }
  const existingProduct = cart.cartProduct.find(
    (item) => item.id === product.id
  );
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.cartProduct.push({ id: product.id, quantity: 1 });
  }
  res.json("producto agregado al carrito exitosamente");
});

//Get
router.get("/:cid", (req, res) => {
  const { cid } = req.params;
  const cart = carts.find((cart) => cart.id === parseInt(cid));
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json("carrito no encontrado");
  }
});

export default router;
