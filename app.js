import express from "express";
import productRouter from "./routes/productsRouter.js"
import cartRouter from "./routes/cartRouter.js"

const app = express();

app.use(express.json())

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.listen(8080, () => console.log("Servidor arriba en el puerto 8080!"))