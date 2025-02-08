import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewsrouter from "./routes/views.router.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import productManager from "./fileManager/productManager.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpServer = app.listen(8080, () => {
  console.log("el servidor esta corriendo en el puerto 8080");
});

const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsrouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

socketServer.on("connection", (socket) => {
  socket.emit("loadProducts", productManager.getAllProducts());
  socket.on("newProduct", (product) => {
    console.log(product);
    productManager.addProduct(product);
    socketServer.emit("newProduct", product);
  });
});
