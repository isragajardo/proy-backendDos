
const express = require("express");
const { create } = require("express-handlebars");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars
const hbs = create({
  layoutsDir: path.join(__dirname, "src/views/layouts"),
  defaultLayout: "main",
  extname: ".handlebars",
});
app.engine(".handlebars", hbs.engine);
app.set("view engine", ".handlebars");
app.set("views", path.join(__dirname, "src/views"));

// Routers
const { setSocketServer } = require("./controllers/productController");
const productRoutes = require("./src/routes/products.router");
const cartRoutes = require("./src/routes/carts.router");
const viewsRoutes = require("./src/routes/views.router")(io);

app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/", viewsRoutes);

setSocketServer(io);

const ProductManager = require("./services/ProductManager");
const productManager = new ProductManager("src/data/products.json");

// WebSocket: emitir productos al conectar
io.on("connection", async (socket) => {
  console.log("Cliente conectado");
  const products = await productManager.getProducts();
  socket.emit("productsUpdated", products);
});

server.listen(8080, () => {
  console.log("Servidor escuchando en puerto 8080");
});
