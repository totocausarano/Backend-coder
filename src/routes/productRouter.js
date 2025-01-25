import express from "express";

let products = [];
const router = express.Router();
let nextid = 1;
//Get
router.get("/", (req, res) => {
  res.json(products);
});
router.get("/:pid", (req, res) => {
  const { pid } = req.params;
  const product = products.find((product) => product.id === parseInt(pid));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json("producto no encontrado");
  }
});

//Post
router.post("/", (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.body;
  if (!title || !description || !price || !thumbnail || !code || !stock) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  const newProduct = {
    id: nextid++,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  };
  products.push(newProduct);
  res.json("producto agregado exitosamente");
});
//Put
router.put("/:pid", (req, res) => {
  const { pid } = req.params;
  const { title, description, price, thumbnail, code, stock } = req.body;
  const product = products.find((product) => product.id === parseInt(pid));
  if (product) {
    product.title = title;
    product.description = description;
    product.price = price;
    product.thumbnail = thumbnail;
    product.code = code;
    product.stock = stock;
    res.json("producto actualizado exitosamente");
  } else {
    res.status(404).json("producto no encontrado");
  }
});
//Delete
router.delete("/:pid", (req, res) => {
  const { pid } = req.params;
  const product = products.find((product) => product.id === parseInt(pid));
  products.splice(products[product], 1);
  res.json("producto eliminado exitosamente");
  if (!product) {
    res.status(404).json("producto no encontrado");
  }
});
export default router;
export { products };
