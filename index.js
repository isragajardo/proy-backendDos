const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const ProductManager = require('./src/services/ProductManager');

const app = express();
const server = http.createServer(app);      // ⬅️  Socket.IO necesita el server http
const io = socketio(server);

const hbs = create({
  layoutsDir: path.join(__dirname, 'src/views/layouts'),
  defaultLayout: 'main',
  extname: '.handlebars',
});

app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Routers ─────────────────────────────────────────────────────────
const productRoutes = require('./src/routes/products.router');
const cartRoutes    = require('./src/routes/carts.router');
const viewsRoutes   = require('./src/routes/views.router')(io);

app.use('/api/products', productRoutes);
app.use('/api/carts',    cartRoutes);
app.use('/',             viewsRoutes);

// ─── WebSockets ──────────────────────────────────────────────────────
const pm = new ProductManager('src/data/products.json');

io.on('connection', async socket => {
  console.log('🔌 Cliente conectado');
  socket.emit('productsUpdated', await pm.getProducts());

  socket.on('addProduct', async data => {
    await pm.addProduct(data);
    io.emit('productsUpdated', await pm.getProducts());
  });

  socket.on('deleteProduct', async id => {
    await pm.deleteProduct(id);
    io.emit('productsUpdated', await pm.getProducts());
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () =>
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`)
);
