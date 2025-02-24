import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewsrouter from "./routes/views.router.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import path from 'path';
import mongoose from "mongoose";
import dotenv from "dotenv";
import ProductModel from "./models/productModel.js"; 

dotenv.config();
const app = express();

const URIMongoDB = process.env.URIMONGO;

mongoose.connect(URIMongoDB)
    .then(() => console.log("Conectado a MongoDB"))
    .catch((error) => console.log(" Error en la conexión a MongoDB:", error));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(8080, () => {
    console.log(" Servidor corriendo en el puerto 8080");
});

const io = new Server(httpServer);

app.engine("handlebars", handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "/public")));

app.use("/", viewsrouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar productos iniciales desde MongoDB
    const products = await ProductModel.find();

    // Agregar producto a MongoDB
    socket.on('addProduct', async (productData) => {
        try {
            const newProduct = new ProductModel(productData);
            await newProduct.save();
            const updatedProducts = await ProductModel.find();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Error agregando producto:', error);
        }
    });

    // Eliminar producto de MongoDB
    socket.on('deleteProduct', async (id) => {
        try {
            await ProductModel.findByIdAndDelete(id);
            const updatedProducts = await ProductModel.find();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error(' Error eliminando producto:', error);
        }
    });
});