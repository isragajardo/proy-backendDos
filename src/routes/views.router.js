
const express = require("express");
const ProductManager = require("../../services/ProductManager");
const manager = new ProductManager("src/data/products.json");

module.exports = function(io) {
  const router = express.Router();

  router.get("/home", async (req, res) => {
    const products = await manager.getProducts();
    res.render("home", { title: "Home", products });
  });

  router.get("/realtimeproducts", async (req, res) => {
    const products = await manager.getProducts();
    res.render("realTimeProducts", { title: "Productos en Tiempo Real", products, realtime: true });
  });

  return router;
};
