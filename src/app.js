import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewsrouter from "./routes/views.router.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import ProductManager from "./fileManager/productManager.js"; 
import path from 'path';

const app = express();
const productManager = new ProductManager(path.join(process.cwd(), "products.json")); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpServer = app.listen(8080, () => {
  console.log("el servidor esta corriendo en el puerto 8080");
});

const io = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsrouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');
    
    // Send initial products
    const products = await productManager.getAllProducts();
    socket.emit('updateProducts', products);

    // Handle new product addition
    socket.on('addProduct', async (productData) => {
        try {
            await productManager.addProduct(productData);
            const updatedProducts = await productManager.getAllProducts();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Error agregando producto:', error);
        }
    });

    // Handle product deletion
    socket.on('deleteProduct', async (id) => {
        try {
            await productManager.deleteProduct(id);
            const updatedProducts = await productManager.getAllProducts();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Error eliminando producto:', error);
        }
    });
});
