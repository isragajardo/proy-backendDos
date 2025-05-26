
const socket = io();

socket.on("productsUpdated", (products) => {
  const list = document.getElementById("productList");
  list.innerHTML = "";
  products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${p.title}</strong> - ${p.description} ($${p.price}) <button onclick="deleteProduct('${p.id}')">Eliminar</button>`;
    li.dataset.id = p.id;
    list.appendChild(li);
  });
});

document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  data.status = true;
  data.thumbnails = [];

  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  e.target.reset();
});

async function deleteProduct(id) {
  await fetch("/api/products/" + id, {
    method: "DELETE",
  });
}
