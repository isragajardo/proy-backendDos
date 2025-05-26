const fs = require('fs').promises;
const path = require('path');

class ProductManager {
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

  async getProducts()
 {
    return await this._readFile();
  }

  async getById(id) {
    const products = await this._readFile();
    return products.find(p => p.id == id);
  }

  async addProduct(product) {
    const products = await this._readFile();

    const requiredFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
    const missing = requiredFields.filter(f => !(f in product));
    if (missing.length) return { error: `Faltan campos: ${missing.join(', ')}` };

    const newProduct = {
      id: (products.length ? products[products.length - 1].id + 1 : 1),
      ...product
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return { error: 'Producto no encontrado' };

    delete updates.id; 
    products[index] = { ...products[index], ...updates };
    await this._writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const newProducts = products.filter(p => p.id != id);
    if (products.length === newProducts.length) return { error: 'Producto no encontrado' };

    await this._writeFile(newProducts);
    return { message: 'Producto eliminado' };
  }
}

module.exports = ProductManager;
