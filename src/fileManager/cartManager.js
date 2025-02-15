import fs from "fs";
import path from "path";

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.carts = this.loadCarts();
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.filePath, "utf-8");
      return data.trim() ? JSON.parse(data) : []; // ✅ Si está vacío, devuelve []
    } catch (error) {
      console.error("Error cargando carritos:", error);
      return [];
    }
  }

  saveCarts() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error("Error guardando el carrito:", error);
    }
  }

  async getAllCarts() {
    return this.carts;
  }

  getCartById(id) {
    return this.carts.find((cart) => cart.id === id);
  }

  createCart() {
    const newId =
      this.carts.length > 0 ? Math.max(...this.carts.map((c) => c.id)) + 1 : 1;
    const newCart = { id: newId, products: [] };
    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  addProductToCart(cartId, productId, quantity = 1) {
    const cart = this.getCartById(cartId);
    if (cart) {
      const existingProduct = cart.products.find(
        (p) => p.productId === productId
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
      this.saveCarts();
      return cart;
    }
    return null;
  }
}

export default CartManager;
