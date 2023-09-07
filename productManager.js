import fs from "fs";
import { fieldMissing, setIdIfExists } from "./utils.js";

class ProductManager {
    path;

    static id = 1;

    constructor (path) {
        this.products = [];
        this.path = path;
    }

    async addProduct(product) {
        if (fieldMissing(product)) {
            console.log("Todos los campos deben proporcionarse");
            return;
        }

        const { title, description, price, thumbnail, code, stock, category, status } = product; 

        const newProduct = { 
            title,
            description,
            price,
            thumbnail,
            code,
            id: setIdIfExists(await this.getProducts(), ProductManager.id),
            stock,
            category,
            status
        };

        try {
            if (!fs.existsSync(this.path)) {
                const listaJuguetes = [];
                listaJuguetes.push(newProduct);
                await fs.promises.writeFile(this.path, JSON.stringify(listaJuguetes, null, "\t"));
            } else {
                const juguetesArchivo = await this.getProducts();

                if (juguetesArchivo.find(product => product.code === code)) {
                    throw Error(`El codigo ${code} ya se encuentra registrado.`);
                } else {
                    juguetesArchivo.push(newProduct);
                    await fs.promises.writeFile(this.path, JSON.stringify(juguetesArchivo, null, "\t"))
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getProducts(_limit) {
        try {
            if (!fs.existsSync(this.path)) {
                return [];
            } else {
                const archivo = await fs.promises.readFile(this.path, "utf-8");
                const archivoParseado = JSON.parse(archivo);
                if (_limit) {
                    const slicedArray = archivoParseado.slice(0, _limit);
                    return slicedArray;
                }
                return archivoParseado;
            }
        } catch ({ name, message }) {
           console.log(name);
           console.log(message);
        }

    }

    async getProductById(id) {
        try {
            const juguetesArchivo = await this.getProducts();
            const searchedProduct = juguetesArchivo.find(product => product.id === id);
            if (searchedProduct === undefined) {
                throw Error("El codigo no esta asociado a un producto.");
            }
            return searchedProduct;
        } catch ({ name, message }) {
            console.log(name);
            console.log(message);
        }
    }

    async deleteProduct(id) {
        try {
            const juguetesArchivo = await this.getProducts();
            const jugueteAEliminar = await this.getProductById(id);

            const products = juguetesArchivo.filter(product => product.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));

            return jugueteAEliminar;

            // Esta bien si el manejo del error lo hace this.getProductById(id) ??
            // if (JSON.stringify(juguetesArchivo) === JSON.stringify(products)) {
            //     throw Error("El elemento a eliminar no existe")
            // }
        } catch ({ name, message }) {
            console.log(name);
            console.log(message);
        }
    }

    async updateProduct(id, producto) {
        try {
            const juguetesArchivo = await this.getProducts();
            const noHayJuguetes = juguetesArchivo.find(juguete => juguete.id === id);
            if (!noHayJuguetes) {
                return noHayJuguetes;
            }

            const listaActualizada = juguetesArchivo.map(juguete => {
                let draftJuguete;
                if (juguete.id === id) {
                    for (const prop in producto) {
                        if (!(prop in juguete)) {
                            continue;
                        } else {
                            draftJuguete = { ...juguete, ...draftJuguete, [prop]: producto[prop] }
                        }
                    }
                    return draftJuguete; 
                }
                return { ...juguete };
            });

            await fs.promises.writeFile(this.path, JSON.stringify(listaActualizada, null, "\t"))
            return this.getProductById(id);
        } catch ({ name, message }) {
            console.log(name);
            console.log(message);
        }
    }
}

const Programa = async () => {
    const jugueteriaManager = new ProductManager("ejemplo.json");

    const juguetes = await jugueteriaManager.getProducts();
    console.log(juguetes, "Listado de juguetes");

    const jugueteEjemplo = await jugueteriaManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

    jugueteEjemplo && console.log(jugueteEjemplo, "Primer juguete");

    const juguetesActualizados = await jugueteriaManager.getProducts();
    console.log(juguetesActualizados, "Listado de juguetes");

    const jugueteBuscado = await jugueteriaManager.getProductById(14);
    jugueteBuscado && console.log(jugueteBuscado, "Juguete buscado");

    const jugueteActualizado = await jugueteriaManager.updateProduct(1, { price: 500 } )
    console.log(jugueteActualizado, "Juguete actualizado");

    const jugueteEliminado = await jugueteriaManager.deleteProduct(4);
    jugueteEliminado && console.log(jugueteEliminado, "Juguete eliminado");
}

// Programa();

export default ProductManager;