const socket = io();

socket.on('productsUpdated', renderProducts);

document
  .getElementById('productForm')
  .addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.status = true;
    data.thumbnails = [];
    socket.emit('addProduct', data);   // ⬅️ WebSocket, no fetch
    e.target.reset();
  });

function deleteProduct(id) {
  socket.emit('deleteProduct', id);    // ⬅️ WebSocket, no fetch
}

function renderProducts(products) {
  const list = document.getElementById('productList');
  list.innerHTML = products
    .map(
      p => `
      <li>
        <strong>${p.title}</strong> – $${p.price}
        <button onclick="deleteProduct('${p.id}')">Eliminar</button>
      </li>`
    )
    .join('');
}
