import express, { Router } from "express";
import ProductManager from "../productManager.js"
import { fieldMissing } from "../utils.js";

const router = Router();

router.use(express.json());

const jugueteriaManager = new ProductManager("src/productos.json");

router.get("/", async (req, res) => {
    let limit = req.query.limit;
    const products = await jugueteriaManager.getProducts(limit);
    res.send(products);
});

router.get("/:pid", async (req, res) => {
    const product = await jugueteriaManager.getProductById(parseInt(req.params.pid));
    if (!product) {
        return res.status(404).send({ status: "error", error: "El producto no existe en la base de datos" })
    }
    res.send(product);
});

router.post("/", async (req, res) => {
    const newProduct = req.body;

    if (fieldMissing(newProduct)) {
        return res.status(500).send({ status: "error", error: "Falta informacion de alguno de los campos." })
    }

    await jugueteriaManager.addProduct(newProduct);
    res.status(200).send({message: "Se ingreso el producto a la base"});
});

router.put("/:pid", async (req, res) => {
    const product = await jugueteriaManager.updateProduct(parseInt(req.params.pid), req.body);
    if (!product) {
        return res.status(404).send({ status: "error", error: "No se encontro el producto asociado al id" })
    }
    res.status(200).send({message: "Se actualizo el producto correctamente"});
});

router.delete("/:pid", async (req, res) => {
    const product = await jugueteriaManager.deleteProduct(parseInt(req.params.pid));
    if (!product) {
        return res.status(404).send({ status: "error", error: "No se encontro el producto asociado al id" })
    }
    res.status(200).send({message: "Se elimino el producto correctamente"});
});

export default router;