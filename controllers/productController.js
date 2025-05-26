
const ProductManager = require("../services/ProductManager");
const manager = new ProductManager("src/data/products.json");

let io = null;
const setSocketServer = (ioInstance) => { io = ioInstance; };

const emitUpdate = async () => {
  if (io) {
    const products = await manager.getProducts();
    io.emit("productsUpdated", products);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await manager.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.pid;
    const product = await manager.getProductById(id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

const addProduct = async (req, res) => {
  try {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
    if (!title || !description || !code || price == null || stock == null || !category) {
      return res.status(400).json({ error: "Campos requeridos faltantes" });
    }
    const newProduct = await manager.addProduct({ title, description, code, price, status, stock, category, thumbnails });
    await emitUpdate();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Error al agregar producto" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.pid;
    const data = req.body;
    if (data.id) delete data.id;
    const updated = await manager.updateProduct(id, data);
    if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.pid;
    const deleted = await manager.deleteProduct(id);
    if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
    await emitUpdate();
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

module.exports = {
  setSocketServer,
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
