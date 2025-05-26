const fs = require('fs').promises;
const path = require('path');

  class CartManager {
    constructor(filePath) {
      this.filePath = path.resolve(filePath);
    }

    async _readFile() {
      try {
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
      } catch {
        return [];
      }
    }

    async _writeFile(data) {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    async getAll() {
      return await this._readFile();
    }

    async getById(id) {
      const carts = await this._readFile();
      return carts.find(c => c.id == id);
    }

    async createCart() {
      const carts = await this._readFile();
      const newCart = {
        id: (carts.length ? carts[carts.length - 1].id + 1 : 1),
        products: []
      };
      carts.push(newCart);
      await this._writeFile(carts);
      return newCart;
    }

    async addProductToCart(cid, pid) {
      const carts = await this._readFile();
      const cart = carts.find(c => c.id == cid);
      if (!cart) return { error: 'Carrito no encontrado' };

      const existingProduct = cart.products.find(p => p.product == pid);
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await this._writeFile(carts);
      return cart;
    }
  }

module.exports = CartManager;
