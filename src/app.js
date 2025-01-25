import express from "express";
import __dirname from "./utils.js";

import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(8080, () => {
  console.log("el servidor esta corriendo en el puerto 8080");
});

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

app.use("/static", express.static(__dirname + "/public"));
