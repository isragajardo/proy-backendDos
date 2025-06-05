
const CartManager = require("../src/services/CartManager");
const manager = new CartManager("src/data/carts.json");

const createCart = async (req, res) => {
  try {
    const newCart = await manager.createCart();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: "Error al crear carrito" });
  }
};

const getCartById = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await manager.getCartById(cartId);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener carrito" });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const updatedCart = await manager.addProductToCart(cartId, productId);
    if (!updatedCart) return res.status(404).json({ error: "Carrito o producto no encontrado" });
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
};

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
};
