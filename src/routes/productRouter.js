import { Router } from "express";
let products = [];
const router = Router();

//Get
router.get("/", (req, res) => {
  res.json(products);
});

//Post
router.post("/", (req, res) => {
  console.log("Cuerpo recibido:", req.body); // Imprime el cuerpo recibido
  const newproduct = req.body;
  products.push(newproduct);
  res.json("producto agregado exitosamente");
});
export default router;
