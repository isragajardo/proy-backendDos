const express = require('express');
const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
    res.send('¡Servidor funcionando correctamente!');
  });

// Middleware para JSON
app.use(express.json());

// Importar routers
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

// Usar routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

