import fs from "fs/promises"; 
import path from "path";

class ProductManager {
  constructor(filePath = "products.json") {
    this.filePath = path.resolve(filePath);
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error cargando productos:", error);
      return [];
    }
  }


  async getAllProducts() {
    try {
      const products = await this.loadProducts();
      if (!Array.isArray(products)) {
        console.error("Products data is not an array");
        return [];
      }
      return products;
    } catch (error) {
      console.error("Error loading products:", error);
      return [];
    }
  }

  async saveProducts(products) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error("Error guardando productos:", error);
    }
  }

  async addProduct(product) {
    if (!product.title || !product.description || !product.price || 
        !product.code || !product.stock) {
        throw new Error('All fields are required: title, description, price, code, stock');
    }

    const products = await this.loadProducts();
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct = { 
        id: newId,
        title: product.title,
        description: product.description,
        price: product.price,
        code: product.code,
        stock: product.stock
    };
    products.push(newProduct);
    await this.saveProducts(products);
    return newProduct;
}

  async getProductById(id) {
    const products = await this.loadProducts();
    return products.find((product) => product.id === id);
  }

async deleteProduct(id) {
    try {
        const products = await this.loadProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return false;
        
        products.splice(index, 1);
        await this.saveProducts(products);
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}
}

export default ProductManager;
