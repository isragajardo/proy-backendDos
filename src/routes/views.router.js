const { Router } = require('express');
const ProductManager = require('../services/ProductManager');
const pm = new ProductManager('src/data/products.json');

module.exports = function (io) {
  const router = Router();

  // Home estático
  router.get('/', async (req, res) => {
    const products = await pm.getProducts();
    res.render('home', { products });
  });

  // Vista con WebSockets
  router.get('/realtimeproducts', async (req, res) => {
    const products = await pm.getProducts();
    res.render('realTimeProducts', { products });
  });

  return router;
};
