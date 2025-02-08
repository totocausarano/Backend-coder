import fs from "fs";
import path from "path";

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.filePath, "utf-8");
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      console.error(" Error cargando productos:", error);
      return [];
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error("Error guardando producto:", error);
    }
  }

  getAllProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  addProduct(product) {
    const newId =
      this.products.length > 0
        ? Math.max(...this.products.map((p) => p.id)) + 1
        : 1;
    const newProduct = { id: newId, ...product };
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      this.saveProducts();
      return this.products[index];
    }
    return null;
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1)[0];
      this.saveProducts();
      return deletedProduct;
    }
    return null;
  }
}

export default ProductManager;
