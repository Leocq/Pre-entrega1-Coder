export const fieldMissing = (product) => {
    const { title, description, price, thumbnail, code, stock, category, status } = product;

    return !title || !description || price === undefined || !code || stock === undefined || !category || status === undefined || !Array.isArray(thumbnail);
}

export const setIdIfExists = (products, id) => {
    if (products.length === 0) {
        return id;
    }
    const idExists = products.some(product => product.id === id);
    const newId = products[products.length - 1].id + 1;
    if (idExists) {
        return newId;
    } else {
        return id;
    }
}