import express, { Router } from "express";
import CartManager from "../cartManager.js";

const router = Router();

router.use(express.json());

const cartManager = new CartManager("src/carrito.json");

router.post("/", async (req, res) => {
    cartManager.addCart()
    res.status(200).send({ message: "El carrito se creo con exito!" });
});

router.get("/:cid", async (req, res) => {
    const products = await cartManager.getCartProductsById(parseInt(req.params.cid))
    if (!products) {
        res.status(404).send({ status: "error", error: "El carrito no existe en la base de datos" })
    }
    
    res.status(200).send(products);
});

router.post("/:cid/product/:pid", async (req, res) => {
    const response = await cartManager.insertProdToCart(parseInt(req.params.cid), parseInt(req.params.pid))
    if (!response) {
        return res.status(404).send({ status: "error", error: "El id no esta asociado a un carrito existente." })
    }
    
    res.status(200).send({ message: "Se ingreso el producto al carrito con exito" });
});

export default router;