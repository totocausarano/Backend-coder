import express from "express";
let cart = [];
const router = express.Router();

//Get
router.get("/", (req, res) => {
  res.json(cart);
});

export default router;
